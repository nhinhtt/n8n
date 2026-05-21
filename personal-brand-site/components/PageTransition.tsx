"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useIsMobile } from "./useMediaQuery";

export default function PageTransition() {
  const [show, setShow] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const t = setTimeout(() => setShow(false), isMobile ? 1000 : 1500);
    return () => clearTimeout(t);
  }, [isMobile]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[80] pointer-events-none bg-bone flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        duration: 0.6,
        delay: isMobile ? 0.4 : 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.span
        className="font-display text-[14vw] md:text-[8vw] leading-none text-ink"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="italic gradient-text">linh</span>
        <span className="text-ink">.</span>
      </motion.span>
    </motion.div>
  );
}
