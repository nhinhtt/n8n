#!/usr/bin/env python3
"""
Video pipeline cho kênh du lịch Việt Nam.

Tự động xử lý video GỐC mà bạn có quyền sử dụng (tự quay, stock có license,
hoặc được creator cho phép bằng văn bản). Các bước:

    1. Trim / cắt video theo khoảng thời gian.
    2. Chuyển khung dọc 9:16 (1080x1920) cho Reels / Shorts / TikTok.
    3. Gắn watermark (logo ảnh hoặc chữ tên kênh).
    4. Burn phụ đề từ file .srt với style tuỳ chỉnh.

CÔNG CỤ NÀY KHÔNG tải video từ TikTok/YouTube và KHÔNG dùng để đăng lại nội
dung của người khác. Chỉ xử lý các file video bạn đã có quyền sử dụng hợp pháp.

Yêu cầu: ffmpeg + ffprobe đã cài trong PATH.
"""

from __future__ import annotations

import argparse
import json
import shlex
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

VIDEO_EXTENSIONS = {".mp4", ".mov", ".mkv", ".avi", ".webm", ".m4v"}


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _check_dependencies() -> None:
    for tool in ("ffmpeg", "ffprobe"):
        try:
            subprocess.run(
                [tool, "-version"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=True,
            )
        except (subprocess.CalledProcessError, FileNotFoundError):
            sys.exit(
                f"Lỗi: không tìm thấy '{tool}'. Hãy cài ffmpeg trước "
                "(vd: 'sudo apt-get install ffmpeg' hoặc 'brew install ffmpeg')."
            )


def _probe_dimensions(path: Path) -> tuple[int, int]:
    """Trả về (width, height) của stream video đầu tiên."""
    out = subprocess.run(
        [
            "ffprobe", "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=width,height",
            "-of", "json", str(path),
        ],
        capture_output=True, text=True, check=True,
    )
    stream = json.loads(out.stdout)["streams"][0]
    return int(stream["width"]), int(stream["height"])


def _escape_drawtext(text: str) -> str:
    """Escape ký tự đặc biệt cho filter drawtext của ffmpeg."""
    return (
        text.replace("\\", "\\\\")
        .replace(":", "\\:")
        .replace("'", "\\'")
        .replace("%", "\\%")
    )


def _escape_subtitle_path(path: Path) -> str:
    """Escape đường dẫn cho filter subtitles của ffmpeg."""
    s = str(path)
    return s.replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")


# --------------------------------------------------------------------------- #
# Config
# --------------------------------------------------------------------------- #
@dataclass
class PipelineConfig:
    start: str | None = None              # vd "00:00:05"
    end: str | None = None                # vd "00:00:35"
    duration: float | None = None         # giây, dùng thay cho end

    vertical: bool = False                # reframe 9:16
    target_w: int = 1080
    target_h: int = 1920

    watermark_text: str | None = None
    watermark_image: Path | None = None
    watermark_position: str = "bottom-right"
    watermark_opacity: float = 0.85
    watermark_scale: float = 0.18         # tỉ lệ chiều rộng logo so với video
    watermark_fontsize: int = 36
    watermark_fontcolor: str = "white"

    subtitles: Path | None = None
    subtitle_fontsize: int = 22
    subtitle_color: str = "&H00FFFFFF"    # ASS BGR: trắng
    subtitle_outline: str = "&H00000000"  # đen

    crf: int = 20                         # chất lượng (thấp = đẹp hơn, nặng hơn)
    preset: str = "medium"
    audio_bitrate: str = "128k"


_POSITION_OVERLAY = {
    "top-left": "x=24:y=24",
    "top-right": "x=W-w-24:y=24",
    "bottom-left": "x=24:y=H-h-24",
    "bottom-right": "x=W-w-24:y=H-h-24",
    "center": "x=(W-w)/2:y=(H-h)/2",
}

_POSITION_TEXT = {
    "top-left": "x=24:y=24",
    "top-right": "x=w-text_w-24:y=24",
    "bottom-left": "x=24:y=h-text_h-32",
    "bottom-right": "x=w-text_w-24:y=h-text_h-32",
    "center": "x=(w-text_w)/2:y=(h-text_h)/2",
}


# --------------------------------------------------------------------------- #
# Filter graph builder
# --------------------------------------------------------------------------- #
def _build_filter_complex(cfg: PipelineConfig, has_logo: bool) -> str:
    """
    Xây filter_complex. Luồng video bắt đầu từ [0:v]. Nếu có logo thì là input [1:v].
    """
    steps: list[str] = []
    cur = "[0:v]"

    # 1. Reframe dọc 9:16: scale to cover rồi crop giữa.
    if cfg.vertical:
        w, h = cfg.target_w, cfg.target_h
        steps.append(
            f"{cur}scale={w}:{h}:force_original_aspect_ratio=increase,"
            f"crop={w}:{h}[v_scaled]"
        )
        cur = "[v_scaled]"

    # 2. Phụ đề (burn-in) — làm trước watermark để watermark luôn nằm trên.
    if cfg.subtitles is not None:
        sub_path = _escape_subtitle_path(cfg.subtitles)
        style = (
            f"FontSize={cfg.subtitle_fontsize},"
            f"PrimaryColour={cfg.subtitle_color},"
            f"OutlineColour={cfg.subtitle_outline},"
            f"BorderStyle=1,Outline=2,Shadow=0,Alignment=2,MarginV=60"
        )
        steps.append(
            f"{cur}subtitles='{sub_path}':force_style='{style}'[v_sub]"
        )
        cur = "[v_sub]"

    # 3. Watermark
    if has_logo:
        overlay_pos = _POSITION_OVERLAY.get(
            cfg.watermark_position, _POSITION_OVERLAY["bottom-right"]
        )
        # Áp độ mờ cho logo, rồi co logo theo tỉ lệ chiều rộng video (scale2ref).
        steps.append(
            f"[1:v]format=rgba,colorchannelmixer=aa={cfg.watermark_opacity}[logo_a]"
        )
        steps.append(
            f"[logo_a]{cur}scale2ref=w='main_w*{cfg.watermark_scale}':"
            f"h=-1[logo_s][base]"
        )
        steps.append(
            f"[base][logo_s]overlay={overlay_pos}:format=auto[v_out]"
        )
        cur = "[v_out]"
    elif cfg.watermark_text:
        text = _escape_drawtext(cfg.watermark_text)
        pos = _POSITION_TEXT.get(
            cfg.watermark_position, _POSITION_TEXT["bottom-right"]
        )
        steps.append(
            f"{cur}drawtext=text='{text}':"
            f"fontsize={cfg.watermark_fontsize}:"
            f"fontcolor={cfg.watermark_fontcolor}@{cfg.watermark_opacity}:"
            f"box=1:boxcolor=black@0.35:boxborderw=8:"
            f"{pos}[v_out]"
        )
        cur = "[v_out]"

    if not steps:
        return ""  # không có xử lý video nào → copy trực tiếp

    # Nhãn output cuối (cur) chỉ xuất hiện một lần (không bước nào tiêu thụ nó).
    # Đổi nó thành [vout] để -map dùng được.
    graph = ";".join(steps)
    if cur != "[vout]":
        graph = graph.replace(cur, "[vout]")
    return graph


def _build_command(src: Path, dst: Path, cfg: PipelineConfig) -> list[str]:
    cmd: list[str] = ["ffmpeg", "-y"]

    # Trim bằng -ss/-to (input seeking cho nhanh + chính xác sau khi re-encode).
    if cfg.start:
        cmd += ["-ss", cfg.start]
    cmd += ["-i", str(src)]

    has_logo = cfg.watermark_image is not None
    if has_logo:
        cmd += ["-i", str(cfg.watermark_image)]

    if cfg.duration is not None:
        cmd += ["-t", str(cfg.duration)]
    elif cfg.end:
        cmd += ["-to", cfg.end]

    filt = _build_filter_complex(cfg, has_logo)
    if filt:
        cmd += ["-filter_complex", filt, "-map", "[vout]", "-map", "0:a?"]
        cmd += [
            "-c:v", "libx264", "-crf", str(cfg.crf), "-preset", cfg.preset,
            "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", cfg.audio_bitrate,
        ]
    else:
        # Không có filter → chỉ trim, copy stream cho nhanh.
        cmd += ["-c", "copy"]

    cmd += ["-movflags", "+faststart", str(dst)]
    return cmd


# --------------------------------------------------------------------------- #
# Processing
# --------------------------------------------------------------------------- #
def process_file(src: Path, out_dir: Path, cfg: PipelineConfig, suffix: str) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    dst = out_dir / f"{src.stem}{suffix}.mp4"
    cmd = _build_command(src, dst, cfg)

    print(f"\n▶ Xử lý: {src.name}")
    print("  " + " ".join(shlex.quote(c) for c in cmd))

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr[-1500:], file=sys.stderr)
        raise RuntimeError(f"ffmpeg thất bại cho {src.name}")

    w, h = _probe_dimensions(dst)
    print(f"  ✓ Xong → {dst}  ({w}x{h})")
    return dst


def collect_inputs(input_path: Path) -> list[Path]:
    if input_path.is_dir():
        return sorted(
            p for p in input_path.iterdir()
            if p.suffix.lower() in VIDEO_EXTENSIONS
        )
    if input_path.is_file():
        return [input_path]
    sys.exit(f"Lỗi: không tìm thấy input '{input_path}'.")


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #
def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Pipeline xử lý video gốc: trim, dọc 9:16, watermark, phụ đề.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    p.add_argument("input", type=Path,
                   help="File video hoặc thư mục chứa video cần xử lý.")
    p.add_argument("-o", "--output", type=Path, default=Path("output"),
                   help="Thư mục xuất (mặc định: ./output).")
    p.add_argument("--suffix", default="_ready",
                   help="Hậu tố tên file xuất (mặc định: _ready).")

    g_trim = p.add_argument_group("Cắt / trim")
    g_trim.add_argument("--start", help="Thời điểm bắt đầu, vd 00:00:05.")
    g_trim.add_argument("--end", help="Thời điểm kết thúc, vd 00:00:35.")
    g_trim.add_argument("--duration", type=float,
                        help="Độ dài (giây) tính từ --start, thay cho --end.")

    g_frame = p.add_argument_group("Khung hình")
    g_frame.add_argument("--vertical", action="store_true",
                         help="Chuyển sang dọc 9:16 (mặc định 1080x1920).")
    g_frame.add_argument("--target-size", default="1080x1920",
                         help="Kích thước đích khi --vertical, vd 1080x1920.")

    g_wm = p.add_argument_group("Watermark")
    g_wm.add_argument("--watermark-text", help="Watermark dạng chữ (tên kênh).")
    g_wm.add_argument("--watermark-image", type=Path,
                      help="Watermark dạng ảnh logo (PNG nền trong suốt).")
    g_wm.add_argument("--watermark-position", default="bottom-right",
                      choices=list(_POSITION_OVERLAY.keys()),
                      help="Vị trí watermark.")
    g_wm.add_argument("--watermark-opacity", type=float, default=0.85,
                      help="Độ mờ watermark 0..1 (mặc định 0.85).")
    g_wm.add_argument("--watermark-scale", type=float, default=0.18,
                      help="Tỉ lệ rộng logo so với video (mặc định 0.18).")

    g_sub = p.add_argument_group("Phụ đề")
    g_sub.add_argument("--subtitles", type=Path,
                       help="File phụ đề .srt để burn vào video.")
    g_sub.add_argument("--subtitle-fontsize", type=int, default=22,
                       help="Cỡ chữ phụ đề (mặc định 22).")

    g_enc = p.add_argument_group("Mã hoá")
    g_enc.add_argument("--crf", type=int, default=20,
                       help="Chất lượng x264 (thấp=đẹp, mặc định 20).")
    g_enc.add_argument("--preset", default="medium",
                       help="Preset x264 (mặc định medium).")
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    _check_dependencies()

    try:
        tw, th = (int(x) for x in args.target_size.lower().split("x"))
    except ValueError:
        sys.exit("Lỗi: --target-size phải dạng RỘNGxCAO, vd 1080x1920.")

    if args.subtitles and not args.subtitles.is_file():
        sys.exit(f"Lỗi: không tìm thấy file phụ đề '{args.subtitles}'.")
    if args.watermark_image and not args.watermark_image.is_file():
        sys.exit(f"Lỗi: không tìm thấy logo '{args.watermark_image}'.")

    cfg = PipelineConfig(
        start=args.start, end=args.end, duration=args.duration,
        vertical=args.vertical, target_w=tw, target_h=th,
        watermark_text=args.watermark_text,
        watermark_image=args.watermark_image,
        watermark_position=args.watermark_position,
        watermark_opacity=args.watermark_opacity,
        watermark_scale=args.watermark_scale,
        subtitles=args.subtitles,
        subtitle_fontsize=args.subtitle_fontsize,
        crf=args.crf, preset=args.preset,
    )

    files = collect_inputs(args.input)
    if not files:
        sys.exit("Không có file video nào để xử lý.")

    print(f"Tìm thấy {len(files)} video. Xuất ra: {args.output.resolve()}")
    ok, fail = 0, 0
    for f in files:
        try:
            process_file(f, args.output, cfg, args.suffix)
            ok += 1
        except RuntimeError as e:
            print(f"  ✗ {e}", file=sys.stderr)
            fail += 1

    print(f"\nHoàn tất: {ok} thành công, {fail} lỗi.")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
