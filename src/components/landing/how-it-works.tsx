"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, BarChart3, UserCheck } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Upload Documents",
    description:
      "Drop in passport, ID, and proof of address. Drag-and-drop or click to upload.",
    icon: Upload,
  },
  {
    number: 2,
    title: "AI Agents Process",
    description:
      "Five specialized agents analyze documents, verify identity, and screen sanctions in parallel.",
    icon: Cpu,
  },
  {
    number: 3,
    title: "Risk Profile Generated",
    description:
      "Composite risk score with linked evidence, full audit trail, and explainable factors.",
    icon: BarChart3,
  },
  {
    number: 4,
    title: "Human Decides",
    description:
      "Compliance officer reviews the synthesized profile and approves, denies, or escalates.",
    icon: UserCheck,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F3F3F1]/30 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] text-center mb-16">
          How Sentinel works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHumanStep = step.number === 4;

            return (
              <div key={step.number} className="relative flex flex-col items-center">
                {/* Connecting dashed line between steps (desktop only) */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-4 left-[calc(50%+20px)] w-[calc(100%-40px)]
                      border-t-2 border-dashed border-[#E5E5E3] z-0"
                    aria-hidden="true"
                  />
                )}

                <motion.div
                  className={`relative z-10 flex flex-col items-center text-center ${
                    isHumanStep
                      ? "bg-[#f35c1d]/5 border border-[#f35c1d]/30 rounded-xl p-4"
                      : ""
                  }`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true, margin: "-60px" }}
                >
                  {/* Step number circle */}
                  <div className="w-8 h-8 rounded-full bg-[#f35c1d] text-white text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mt-4" style={{ color: "#9CA3AF" }}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mt-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#6B7280] mt-2 leading-relaxed max-w-[220px]">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
