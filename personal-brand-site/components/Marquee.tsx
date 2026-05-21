"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "./useMediaQuery";

const items = [
  "Brand Identity",
  "Motion Design",
  "Art Direction",
  "Web Experience",
  "Editorial",
  "Newsletter",
];

export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-22%"]);

  if (isMobile) {
    return (
      <div
        ref={ref}
        className="relative py-8 border-y border-ink/10 overflow-hidden bg-bone"
      >
        <div className="flex whitespace-nowrap gap-10 text-[10vw] leading-none font-display animate-marquee-slow will-change-transform">
          {[...items, ...items].map((it, i) => (
            <span key={`${it}-${i}`} className="flex items-center gap-10">
              <span
                className={
                  i % 2 === 0 ? "text-ink" : "text-stroke text-ink italic"
                }
              >
                {it}
              </span>
              <span className="text-flame">✦</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative py-14 md:py-20 border-y border-ink/10 overflow-hidden bg-bone"
    >
      <motion.div
        className="flex whitespace-nowrap gap-12 text-[7vw] md:text-[5.5vw] leading-none font-display will-change-transform"
        style={{ x }}
      >
        {[...items, ...items, ...items].map((it, i) => (
          <span key={`${it}-${i}`} className="flex items-center gap-12">
            <span
              className={
                i % 2 === 0 ? "text-ink" : "text-stroke text-ink italic"
              }
            >
              {it}
            </span>
            <span className="text-flame">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
