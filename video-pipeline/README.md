# Video Pipeline — Kênh du lịch Việt Nam

Công cụ CLI tự động xử lý **video gốc** cho Reels / Shorts / TikTok: cắt (trim),
chuyển khung dọc 9:16, gắn watermark (logo hoặc chữ tên kênh), và burn phụ đề.
Dùng `ffmpeg` ở bên dưới, không phụ thuộc thư viện Python ngoài.

## ⚠️ Lưu ý quan trọng về bản quyền

Công cụ này **chỉ xử lý video bạn có quyền sử dụng hợp pháp**:

- Video bạn **tự quay**.
- Video **stock có license** (Pexels, Pixabay, Storyblocks...).
- Video được creator khác **cho phép bằng văn bản**.
- Nội dung **Creative Commons** đúng điều khoản cho phép tái sử dụng.

Công cụ **KHÔNG** tải video từ TikTok/YouTube và **KHÔNG** dùng để đăng lại nội
dung của người khác. Tải nội dung người khác đăng lại lên kênh của bạn vi phạm
bản quyền và điều khoản của các nền tảng (Facebook/Instagram phạt nội dung
"unoriginal/reuploaded"). Hãy sản xuất nội dung gốc — bền vững và an toàn hơn.

## Cài đặt

Cần `ffmpeg` và `ffprobe` trong PATH:

```bash
# Ubuntu / Debian
sudo apt-get install ffmpeg
# macOS
brew install ffmpeg
```

Không cần cài thêm package Python (chỉ dùng thư viện chuẩn, Python 3.10+).

## Cách dùng

```bash
# Xử lý 1 file: cắt 6 giây từ giây thứ 1, dọc 9:16, logo + phụ đề
python3 video_pipeline.py input/clip.mp4 \
  --start 00:00:01 --duration 6 \
  --vertical \
  --watermark-image assets/logo.png --watermark-position bottom-right \
  --subtitles input/clip.srt

# Watermark dạng chữ (tên kênh)
python3 video_pipeline.py input/clip.mp4 --vertical \
  --watermark-text "@HanoiTravel" --watermark-position top-left

# Chỉ cắt nhanh (copy stream, không re-encode)
python3 video_pipeline.py input/clip.mp4 --start 00:00:02 --duration 4

# Xử lý hàng loạt cả thư mục
python3 video_pipeline.py input/ --vertical --watermark-text "VN Travel"
```

File xuất ra thư mục `output/` (đổi bằng `-o`), tên có hậu tố `_ready`
(đổi bằng `--suffix`).

## Các tùy chọn chính

| Nhóm       | Cờ                                  | Ý nghĩa                                      |
|------------|-------------------------------------|----------------------------------------------|
| Cắt        | `--start`, `--end`, `--duration`    | Khoảng thời gian giữ lại                      |
| Khung hình | `--vertical`, `--target-size`       | Chuyển dọc 9:16 (mặc định 1080x1920)         |
| Watermark  | `--watermark-text` / `--watermark-image` | Chữ hoặc logo PNG                       |
|            | `--watermark-position`              | top-left, top-right, bottom-left, bottom-right, center |
|            | `--watermark-opacity`, `--watermark-scale` | Độ mờ (0–1), tỉ lệ rộng logo          |
| Phụ đề     | `--subtitles`, `--subtitle-fontsize`| Burn file `.srt` vào video                   |
| Mã hoá     | `--crf`, `--preset`                 | Chất lượng (CRF thấp = đẹp hơn) và tốc độ x264 |

Xem đầy đủ: `python3 video_pipeline.py --help`.

## Gợi ý workflow cho kênh du lịch

1. Quay hoặc thu thập video gốc (có quyền dùng) vào `input/`.
2. Chuẩn bị logo kênh dạng PNG nền trong suốt trong `assets/`.
3. Tạo file phụ đề `.srt` (có thể tạo tay hoặc bằng công cụ speech-to-text).
4. Chạy pipeline để ra video dọc 9:16 có watermark + phụ đề.
5. Đăng video gốc đã xử lý lên Facebook / Instagram qua **API chính thức**
   (có thể tự động hoá bằng workflow n8n — bước tiếp theo nếu bạn cần).
