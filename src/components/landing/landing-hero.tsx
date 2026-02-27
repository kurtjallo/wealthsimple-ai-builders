"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroPipelineAnimation } from "./hero-pipeline-animation";

const mantleEase = [0.25, 0.1, 0.25, 1] as const;

const heroTextContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const heroTextChild = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: mantleEase },
  },
};

export function LandingHero() {
  return (
    <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column — staggered text from left */}
          <motion.div
            variants={heroTextContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-display)" }}
              variants={heroTextChild}
            >
              Compliance in minutes, not days.
            </motion.h1>

            <motion.p
              className="text-lg text-[#6B7280] mt-6 max-w-lg leading-relaxed"
              variants={heroTextChild}
            >
              AI-powered KYC/AML orchestration that processes documents, screens
              sanctions, verifies identities, and generates risk narratives
              &mdash; so compliance officers can focus on decisions, not
              paperwork.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4"
              variants={heroTextChild}
            >
              <Button size="lg" asChild>
                <Link href="/cases/new">Try Live Demo</Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-[#E5E5E3] text-[#1A1A1A] hover:bg-[#F3F3F1]"
                asChild
              >
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column — scale + translate on mount, subtle drift on scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: mantleEase }}
          >
            <motion.div
              whileInView={{ y: -8 }}
              initial={{ y: 0 }}
              transition={{ duration: 0.6, ease: mantleEase }}
              viewport={{ once: false, margin: "-80px" }}
            >
              <HeroPipelineAnimation />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
