"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";

const links = [
  { label: "Work", href: "#portfolio" },
  { label: "Topics", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 200);
    setScrolled(latest > 40);
  });

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-4 md:py-5 flex items-center justify-between transition-colors duration-300 ${
        scrolled
          ? "bg-bone/85 backdrop-blur-md border-b border-ink/5"
          : "bg-transparent"
      }`}
      variants={{ visible: { y: 0 }, hidden: { y: "-110%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      initial={{ y: -100 }}
    >
      <motion.a
        href="#top"
        className="flex items-baseline gap-2 font-display text-xl text-ink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="italic">linh tran</span>
        <span className="text-[10px] uppercase tracking-widest text-mute font-sans not-italic hidden md:inline">
          — Notebook
        </span>
      </motion.a>

      <nav className="hidden md:flex items-center gap-1 text-sm">
        {links.map((l, i) => (
          <motion.a
            key={l.href}
            href={l.href}
            className="relative px-3 py-2 text-ink/80 hover:text-ink group"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + i * 0.07 }}
          >
            <span className="relative z-10">{l.label}</span>
            <span className="absolute inset-x-3 -bottom-px h-px bg-flame origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </motion.a>
        ))}
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
      >
        <MagneticButton>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-bone text-sm hover:bg-flame transition-colors"
          >
            Subscribe
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </MagneticButton>
      </motion.div>
    </motion.header>
  );
}
