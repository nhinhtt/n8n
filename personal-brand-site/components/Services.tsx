"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AnimatedText from "./AnimatedText";

const services = [
  {
    n: "01",
    title: "Brand Identity",
    desc: "Logo systems, typography, color, voice — the full visual & verbal language of your brand.",
    tags: ["Logo", "Type", "Guidelines", "Naming"],
    accent: "bg-flame text-bone",
  },
  {
    n: "02",
    title: "Motion & Direction",
    desc: "Kinetic identities, brand films, ad campaigns and storytelling that refuses to sit still.",
    tags: ["After Effects", "Cinema 4D", "Storyboarding"],
    accent: "bg-ink text-bone",
  },
  {
    n: "03",
    title: "Web Experience",
    desc: "High-fidelity, motion-driven websites that turn your brand into a destination.",
    tags: ["UX", "Prototype", "Framer", "Next.js"],
    accent: "bg-sky text-bone",
  },
  {
    n: "04",
    title: "Creative Strategy",
    desc: "Positioning, messaging, campaign concepts. Ideas with teeth, executions with taste.",
    tags: ["Workshops", "Research", "Concept"],
    accent: "bg-gold text-ink",
  },
];

export default function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="services" className="relative py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-mute mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="block w-10 h-px bg-ink/30" />
          <span>02 — Topics</span>
        </motion.div>

        <AnimatedText
          text="What I can do for you."
          className="font-display text-4xl md:text-6xl leading-[1.05] mb-16 max-w-4xl text-ink"
        />

        <div className="border-t border-ink/15">
          {services.map((s, i) => {
            const isHovered = hovered === i;
            return (
              <motion.div
                key={s.n}
                className="group relative border-b border-ink/15 py-8 md:py-10 cursor-pointer overflow-hidden"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                data-cursor="hover"
              >
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className={`absolute inset-0 ${s.accent}`}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10 grid grid-cols-12 gap-6 items-center">
                  <span
                    className={`col-span-2 md:col-span-1 font-mono text-sm transition-colors ${
                      isHovered ? "" : "text-mute"
                    }`}
                  >
                    {s.n}
                  </span>
                  <h3
                    className={`col-span-10 md:col-span-4 font-display text-2xl md:text-4xl transition-colors ${
                      isHovered ? "" : "text-ink"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`col-span-12 md:col-span-5 text-base leading-relaxed transition-colors ${
                      isHovered ? "" : "text-mute"
                    }`}
                  >
                    {s.desc}
                  </p>
                  <div className="col-span-12 md:col-span-2 flex flex-wrap gap-2 justify-start md:justify-end">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border transition-colors ${
                          isHovered
                            ? "border-current/40"
                            : "border-ink/25 text-mute"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
