"use client";

import { motion } from "framer-motion";
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

export function TrustBar() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="bg-[#F3F3F1]/50 py-8"
    >
      <p className="text-sm text-[#6B7280] text-center mb-4">
        Screening against global regulatory databases
      </p>
      <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
        {databases.map((db) => (
          <div
            key={db.name}
            className="flex items-center gap-2 text-sm text-[#6B7280]"
          >
            <db.icon size={16} />
            <span>{db.name}</span>
            {db.detail && (
              <span className="text-xs text-[#9CA3AF]">{db.detail}</span>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
