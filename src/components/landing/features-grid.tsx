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

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={cardVariants}
      className="bg-white border border-[#E5E5E3] rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
    >
      <div className="w-10 h-10 rounded-lg bg-[#f35c1d]/10 flex items-center justify-center mb-4">
        <Icon size={20} className="text-[#f35c1d]" />
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

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] text-center">
            Built for modern compliance teams
          </h2>
          <p className="text-lg text-[#6B7280] text-center mt-4 max-w-2xl mx-auto">
            Five specialized AI agents work in parallel to deliver comprehensive
            risk assessments.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {topFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto"
        >
          {bottomFeatures.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
