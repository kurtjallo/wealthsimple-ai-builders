"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const staggerDelay = 0.12;

export function CtaSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          Ready to transform your compliance workflow?
        </motion.h2>
        <motion.p
          className="text-lg text-[#6B7280] mt-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: staggerDelay,
            ease: "easeOut",
          }}
          viewport={{ once: true, margin: "-80px" }}
        >
          See how Sentinel processes a complete KYC case in under 3 minutes.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: staggerDelay * 2,
            ease: "easeOut",
          }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <Button variant="default" size="lg" asChild className="mt-8">
            <Link href="/cases/new">Try Live Demo</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
