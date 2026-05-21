"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, lazy, Suspense } from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";

// Code-split the Three.js scene so initial JS stays slim.
const ParticleScene = lazy(() => import("./ParticleScene"));

const articles = [
  { n: "01", title: "On building brands that feel alive", date: "May 18" },
  { n: "02", title: "Why motion is the new typography", date: "May 04" },
  { n: "03", title: "The case for slow, premium websites", date: "Apr 21" },
  { n: "04", title: "Notes from a year of indie practice", date: "Apr 02" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 1.4 } },
};

const lineVariants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Scroll progress within the hero — drives the particle morph.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Slow down content fade on scroll so 3D stays visible longer.
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[140vh] pt-28 md:pt-32 px-6 md:px-12 overflow-hidden"
    >
      {/* 3D particle morph — pinned background */}
      <div className="sticky top-0 h-screen w-full -mx-6 md:-mx-12 px-6 md:px-12 flex items-center justify-center">
        <Suspense fallback={null}>
          <ParticleScene progress={scrollYProgress} />
        </Suspense>

        {/* Foreground content over the 3D */}
        <motion.div
          className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-12 gap-6 pointer-events-none"
          style={{ opacity: contentOpacity }}
        >
          {/* Left column — headline */}
          <div className="col-span-12 md:col-span-4">
            <motion.div
              className="text-[11px] uppercase tracking-[0.28em] text-mute mb-6 flex items-center gap-3 pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              <span className="w-6 h-px bg-ink/30" />
              The 3D Moment
            </motion.div>

            <motion.h1
              className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight text-ink pointer-events-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="block overflow-hidden">
                <motion.span className="inline-block" variants={lineVariants}>
                  Designing brands
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="inline-block italic gradient-text"
                  variants={lineVariants}
                >
                  that move.
                </motion.span>
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 text-base md:text-lg leading-relaxed text-mute max-w-sm pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.7 }}
            >
              A notebook from{" "}
              <span className="text-ink font-medium">Linh Tran</span> — creative
              director crafting kinetic identities for founders who refuse to
              be forgettable.
            </motion.p>

            <motion.div
              className="mt-8 flex items-center gap-3 pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.7 }}
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-bone text-sm font-medium hover:bg-flame transition-colors"
              >
                Subscribe
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#portfolio"
                className="text-sm uppercase tracking-widest text-mute hover:text-ink transition-colors"
              >
                Browse work
              </a>
            </motion.div>
          </div>

          {/* Right column — articles list */}
          <motion.div
            className="hidden md:block col-span-3 col-start-10 pointer-events-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.4, duration: 0.7 }}
          >
            <div className="text-[11px] uppercase tracking-[0.28em] text-mute mb-5 flex items-center justify-end gap-3">
              Latest
              <span className="w-6 h-px bg-ink/30" />
            </div>
            <ul className="space-y-4">
              {articles.map((a) => (
                <li
                  key={a.n}
                  className="group flex items-start gap-3 cursor-pointer"
                >
                  <span className="font-mono text-[10px] text-mute pt-1">
                    {a.n}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm text-ink leading-snug group-hover:text-flame transition-colors">
                      {a.title}
                    </div>
                    <div className="text-[11px] uppercase tracking-wider text-mute mt-1">
                      {a.date}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-mute pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.8 }}
        >
          <span>Scroll to morph</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
