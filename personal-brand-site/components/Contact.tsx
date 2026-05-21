"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { Instagram, Linkedin, Github, Mail, ArrowUpRight } from "lucide-react";

const socials = [
  { label: "Instagram", href: "#", icon: Instagram, handle: "@linh.designs" },
  { label: "LinkedIn", href: "#", icon: Linkedin, handle: "in/linhtran" },
  { label: "Behance", href: "#", icon: ArrowUpRight, handle: "be/linhtran" },
  { label: "GitHub", href: "#", icon: Github, handle: "@linhtran" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative py-28 md:py-36 px-6 md:px-12 overflow-hidden"
    >
      {/* Mobile static glow, desktop subtle conic halo */}
      <div
        aria-hidden
        className="md:hidden absolute -top-24 left-1/2 -translate-x-1/2 w-[26rem] h-[26rem] rounded-full opacity-30 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, #ff5a1f 0%, #f4a72f 50%, transparent 80%)",
        }}
      />
      <motion.div
        aria-hidden
        className="hidden md:block absolute -top-24 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full opacity-25 blur-3xl will-change-transform"
        style={{
          background:
            "conic-gradient(from 0deg, #ff5a1f, #f4a72f, #5a8bff, #ff5a1f)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-mute mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="block w-10 h-px bg-ink/30" />
          <span>04 — Subscribe</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <motion.h2
              className="font-display text-5xl md:text-[8vw] leading-[0.95] text-ink"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="block overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  Let&apos;s build
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="inline-block italic gradient-text"
                  initial={{ y: "110%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.9,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  something
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="inline-block text-stroke text-ink"
                  initial={{ y: "110%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.9,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  unforgettable.
                </motion.span>
              </span>
            </motion.h2>

            <motion.p
              className="mt-8 text-mute max-w-lg text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              One letter a month — practical notes on brand, motion and how
              design earns trust.
            </motion.p>

            <motion.form
              className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-lg"
              onSubmit={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <input
                type="email"
                placeholder="you@inbox.com"
                className="flex-1 px-5 py-4 rounded-full border border-ink/20 bg-bone text-ink placeholder:text-mute focus:outline-none focus:border-flame transition-colors"
              />
              <MagneticButton strength={0.4}>
                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 px-6 py-4 rounded-full bg-ink text-bone text-sm uppercase tracking-widest font-medium hover:bg-flame transition-colors w-full sm:w-auto justify-center"
                >
                  Subscribe
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </MagneticButton>
            </motion.form>

            <motion.div
              className="mt-6 text-sm text-mute"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              Or write me directly:{" "}
              <a
                href="mailto:hello@linhtran.studio"
                className="text-ink underline underline-offset-4 decoration-flame inline-flex items-center gap-1 hover:text-flame transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                hello@linhtran.studio
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-[11px] uppercase tracking-widest text-mute mb-3">
                Based in
              </div>
              <div className="font-display text-2xl text-ink">
                Hà Nội, Việt Nam — GMT+7
              </div>
              <div className="text-mute text-sm mt-2">
                Working remotely with teams across Asia, EU & US.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-[11px] uppercase tracking-widest text-mute mb-4">
                Elsewhere
              </div>
              <div className="grid grid-cols-2 gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      className="group flex items-center gap-3 px-4 py-3 rounded-full border border-ink/20 hover:border-flame hover:text-flame transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-sm truncate">{s.handle}</span>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
