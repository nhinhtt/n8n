"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnimatedText from "./AnimatedText";
import { useIsMobile } from "./useMediaQuery";

const projects = [
  {
    title: "Maison Loa",
    year: "2025",
    cat: "Beauty / Identity",
    tagline: "Reimagining heritage fragrance for a Gen-Z audience.",
    bg: "from-flame to-gold",
    accent: "Maison",
  },
  {
    title: "Tide Finance",
    year: "2025",
    cat: "Fintech / Motion",
    tagline: "A kinetic identity that makes saving feel like winning.",
    bg: "from-sky to-moss",
    accent: "Tide",
  },
  {
    title: "Bãi Sau Records",
    year: "2024",
    cat: "Culture / Web",
    tagline: "Indie music label site driven by sound-reactive visuals.",
    bg: "from-ink to-flame",
    accent: "Bãi Sau",
  },
  {
    title: "Hư Vô Studio",
    year: "2024",
    cat: "Lifestyle / Direction",
    tagline: "A minimal ceramics brand with a maximalist launch film.",
    bg: "from-gold to-sky",
    accent: "Hư Vô",
  },
];

export default function Portfolio() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const y = isMobile ? undefined : yRaw;

  return (
    <section id="portfolio" className="relative py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-mute mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="block w-10 h-px bg-ink/30" />
          <span>03 — Selected Work</span>
        </motion.div>

        <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <AnimatedText
            text="Recent obsessions."
            className="font-display text-4xl md:text-6xl leading-[1.05] max-w-4xl text-ink"
          />
          <motion.a
            href="#contact"
            className="text-sm uppercase tracking-widest text-mute hover:text-flame transition-colors flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            View archive
            <span>→</span>
          </motion.a>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12"
        >
          {projects.map((p, i) => {
            const isOffset = i % 2 === 1;
            return (
              <motion.a
                key={p.title}
                href="#"
                className={`group relative ${
                  isOffset
                    ? "md:col-span-6 md:col-start-7 md:mt-24"
                    : "md:col-span-6"
                }`}
                style={i === 0 ? { y } : undefined}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                data-cursor="view"
              >
                <div className="overflow-hidden rounded-sm">
                  <motion.div
                    className={`aspect-[4/5] bg-gradient-to-br ${p.bg} relative flex items-center justify-center`}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      className="font-display text-[5rem] md:text-[7rem] italic text-bone/95 leading-none text-center px-6"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 5 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {p.accent}
                    </motion.div>
                  </motion.div>
                </div>

                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-ink">
                      {p.title}
                    </h3>
                    <p className="text-mute mt-1 text-sm md:text-base">
                      {p.tagline}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] uppercase tracking-widest text-mute">
                      {p.cat}
                    </div>
                    <div className="font-mono text-sm text-flame mt-1">
                      {p.year}
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
