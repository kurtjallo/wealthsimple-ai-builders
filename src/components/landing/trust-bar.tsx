"use client";

import { motion, type Variants } from "framer-motion";
import { Shield, Globe, ShieldAlert } from "lucide-react";

const databases = [
  {
    icon: Shield,
    name: "OFAC SDN",
    detail: "(US Treasury)",
  },
  {
    icon: Globe,
    name: "UN Consolidated List",
    detail: null,
  },
  {
    icon: ShieldAlert,
    name: "PEP Database",
    detail: null,
  },
  {
    icon: Shield,
    name: "FINTRAC",
    detail: "(Canada)",
  },
];

const badgeContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function TrustBar() {
  return (
    <section className="bg-[#F3F3F1]/50 py-8">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, margin: "-60px" }}
        className="text-sm text-[#6B7280] text-center mb-4"
      >
        Screening against global regulatory databases
      </motion.p>
      <motion.div
        variants={badgeContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="flex flex-wrap justify-center items-center gap-6 lg:gap-10"
      >
        {databases.map((db) => (
          <motion.div
            key={db.name}
            variants={badgeVariants}
            className="flex items-center gap-2 text-sm text-[#6B7280]"
          >
            <db.icon size={16} strokeWidth={1.5} />
            <span>{db.name}</span>
            {db.detail && (
              <span className="text-xs text-[#9CA3AF]">{db.detail}</span>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
