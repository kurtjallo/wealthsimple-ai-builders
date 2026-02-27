"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroPipelineAnimation } from "./hero-pipeline-animation";

export function LandingHero() {
  return (
    <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div>
            <motion.h1
              className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#1A1A1A]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Compliance in minutes, not days.
            </motion.h1>

            <motion.p
              className="text-lg text-[#6B7280] mt-6 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI-powered KYC/AML orchestration that processes documents, screens
              sanctions, verifies identities, and generates risk narratives
              &mdash; so compliance officers can focus on decisions, not
              paperwork.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
          </div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <HeroPipelineAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
