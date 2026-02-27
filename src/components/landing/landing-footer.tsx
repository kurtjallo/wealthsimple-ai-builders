"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Document Processing", href: "#" },
      { label: "Sanctions Screening", href: "#" },
      { label: "Risk Scoring", href: "#" },
      { label: "Identity Verification", href: "#" },
      { label: "Case Narrative", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function LandingFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, margin: "-40px" }}
      className="bg-[#1A1A1A] text-white py-16"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-40px" }}
          className="flex items-center gap-2"
        >
          <span style={{ color: "#2563EB" }}>
            <Shield size={20} strokeWidth={1.5} />
          </span>
          <span
            className="font-bold text-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >Sentinel</span>
          <span className="text-sm text-gray-400">
            AI-Powered KYC/AML Operations
          </span>
        </motion.div>

        {/* Link columns */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12"
        >
          {footerColumns.map((column) => (
            <motion.div key={column.heading} variants={columnVariants}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {column.heading}
              </h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider + bottom row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true, margin: "-40px" }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">
              Built for Wealthsimple AI Builders 2026
            </span>
            <span className="text-xs text-gray-500">
              &copy; 2026 Sentinel. All rights reserved.
            </span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
