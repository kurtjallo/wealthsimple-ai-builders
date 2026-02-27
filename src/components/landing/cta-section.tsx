"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-white py-24">
      <motion.div
        className="max-w-3xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-80px" }}
      >
        <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A]">
          Ready to transform your compliance workflow?
        </h2>
        <p className="text-lg text-[#6B7280] mt-4">
          See how Sentinel processes a complete KYC case in under 3 minutes.
        </p>
        <Button variant="default" size="lg" asChild className="mt-8">
          <Link href="/cases/new">Try Live Demo</Link>
        </Button>
      </motion.div>
    </section>
  );
}
