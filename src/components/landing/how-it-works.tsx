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
    <section id="how-it-works" className="bg-[#F3F3F1]/30 py-24 overflow-visible">
      <div className="max-w-7xl mx-auto px-6 overflow-visible">
        <h2
          className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] text-center mb-16 whitespace-normal break-words"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How Sentinel works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative overflow-visible">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHumanStep = step.number === 4;

            return (
              <motion.div
                key={step.number}
                className="relative flex flex-col items-center text-center overflow-visible"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-60px" }}
              >
                {/* Connecting dashed line between steps (desktop only) */}
                {/* Circle is 36px (w-9), so radius = 18px. Line starts 18px right of center, spans gap minus both radii */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-[17px] left-[calc(50%+20px)] w-[calc(100%-40px)] h-[2.5px] z-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, #D1D5DB 0px, #D1D5DB 8px, transparent 8px, transparent 14px)",
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Step number circle */}
                <div className="relative z-10 w-9 h-9 rounded-full bg-[#2563EB] text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm shadow-[#2563EB]/25">
                  {step.number}
                </div>

                {/* Card content — highlighted for human step */}
                <div
                  className={`relative z-10 flex flex-col items-center mt-4 ${
                    isHumanStep
                      ? "bg-[#2563EB]/5 border border-[#2563EB]/30 rounded-xl px-4 py-4 shadow-sm shadow-[#2563EB]/10"
                      : ""
                  }`}
                >
                  {/* Icon */}
                  <div style={{ color: "#9CA3AF" }}>
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
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
