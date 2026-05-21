"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsMobile } from "./useMediaQuery";

export default function PageTransition() {
  const [show, setShow] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const t = setTimeout(() => setShow(false), isMobile ? 1100 : 1800);
    return () => clearTimeout(t);
  }, [isMobile]);

  if (!show) return null;

  if (isMobile) {
    // Lightweight mobile intro — single fade, no column curtain
    return (
      <motion.div
        className="fixed inset-0 z-[80] pointer-events-none bg-ink flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          className="font-display text-[18vw] leading-none text-cream"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="gradient-text italic">linh</span>
          <span className="text-cream">.</span>
        </motion.span>
      </motion.div>
    );
  }

  const cols = 6;

  return (
    <div className="fixed inset-0 z-[80] pointer-events-none flex">
      {Array.from({ length: cols }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-ink origin-bottom"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.7 + i * 0.06,
            ease: [0.85, 0, 0.15, 1],
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <motion.span
          className="font-display text-[10vw] leading-none text-cream"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="gradient-text italic">linh</span>
          <span className="text-cream">.</span>
        </motion.span>
      </motion.div>
    </div>
  );
}
