"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedText from "./AnimatedText";
import { useIsMobile } from "./useMediaQuery";

const stats = [
  { value: "07", label: "Years of practice" },
  { value: "82+", label: "Brands shipped" },
  { value: "14", label: "Design awards" },
  { value: "∞", label: "Cups of cà phê sữa" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgYRaw = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const rotateRaw = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const imgY = isMobile ? undefined : imgYRaw;
  const rotate = isMobile ? undefined : rotateRaw;

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 md:py-36 px-6 md:px-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-mute mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="block w-10 h-px bg-ink/30" />
          <span>01 — About</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <motion.div
            className="lg:col-span-5 relative"
            style={{ y: imgY, rotate }}
            data-cursor="view"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-gradient-to-br from-flame via-gold to-sky">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="font-display text-[15rem] leading-none text-bone/95 italic"
                  initial={{ scale: 1.2, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  L
                </motion.div>
              </div>
              <div
                className="absolute inset-0 mix-blend-overlay"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(255,90,31,0.4), transparent 60%)",
                }}
              />
              <motion.div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-ink flex items-center justify-center text-bone font-display text-sm uppercase tracking-widest will-change-transform"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <path
                        id="circle"
                        d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      />
                    </defs>
                    <text className="text-[10px] fill-bone font-bold tracking-widest">
                      <textPath href="#circle">
                        AVAILABLE · 2026 · AVAILABLE · 2026 ·{" "}
                      </textPath>
                    </text>
                  </svg>
                </span>
              </motion.div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <AnimatedText
              text="I design brands that move — literally and emotionally."
              className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight text-ink"
            />

            <motion.div
              className="mt-10 space-y-5 text-mute text-base md:text-lg leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p>
                For the past seven years, I&apos;ve helped founders, studios and
                cultural institutions translate their ideas into identities
                that vibrate. From kinetic logos to full-stack design systems,
                every project starts with a single question:{" "}
                <em className="text-flame not-italic font-medium">
                  what makes this unforgettable?
                </em>
              </p>
              <p>
                I previously led brand at a SEA-based studio, art-directed
                campaigns for global beauty houses, and shipped products read
                by millions. Now I work independently with a small circle of
                clients I deeply believe in.
              </p>
            </motion.div>

            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="border-t border-ink/15 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                >
                  <div className="font-display text-3xl md:text-4xl text-ink">
                    {s.value}
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-mute mt-2">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
