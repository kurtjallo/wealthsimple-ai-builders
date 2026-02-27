"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  ShieldAlert,
  BarChart3,
  UserCheck,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const mantleEase = [0.25, 0.1, 0.25, 1] as const;

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const topFeatures: Feature[] = [
  {
    icon: FileSearch,
    title: "Document Intelligence",
    description:
      "Mistral OCR extracts and validates passport, driver's license, and proof of address data with per-field confidence scoring.",
  },
  {
    icon: ShieldAlert,
    title: "Sanctions Screening",
    description:
      "Real-time screening against OFAC SDN, UN Consolidated List, and PEP databases with fuzzy name matching and Arabic variant support.",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring",
    description:
      "Deterministic risk engine combines document, identity, sanctions, and PEP signals into a weighted composite score with full explainability.",
  },
];

const bottomFeatures: Feature[] = [
  {
    icon: UserCheck,
    title: "Identity Verification",
    description:
      "Cross-references name, DOB, document validity, and watchlist presence with weighted confidence scoring.",
  },
  {
    icon: FileText,
    title: "Case Narrative",
    description:
      "Gemini-generated compliance narrative with key findings, recommended action, and linked evidence for audit trails.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function createCardVariants(index: number) {
  const isOdd = index % 2 === 0; // 0-indexed: first, third = left; second, fourth = right
  return {
    hidden: { opacity: 0, y: 20, x: isOdd ? -12 : 12, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: mantleEase },
    },
  };
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const variants = createCardVariants(index);

  return (
    <motion.div
      variants={variants}
      className="bg-white border border-[#E5E5E3] rounded-xl p-6 hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 ease-out"
    >
      <div
        className="w-8 h-8 rounded-lg bg-[#2563EB]/[0.06] flex items-center justify-center mb-4"
        style={{ color: "#2563EB" }}
      >
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
        {feature.title}
      </h3>
      <p className="text-sm text-[#6B7280] leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

const headingVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: mantleEase },
  },
};

const subtextVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: 0.12, ease: mantleEase },
  },
};

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div>
          <motion.h2
            className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] text-center"
            style={{ fontFamily: "var(--font-display)" }}
            initial="hidden"
            whileInView="visible"
            variants={headingVariants}
            viewport={{ once: true, margin: "-80px" }}
          >
            Built for modern compliance teams
          </motion.h2>
          <motion.p
            className="text-lg text-[#6B7280] text-center mt-4 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            variants={subtextVariants}
            viewport={{ once: true, margin: "-80px" }}
          >
            Five specialized AI agents work in parallel to deliver comprehensive
            risk assessments.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {topFeatures.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto"
        >
          {bottomFeatures.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
