"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "What used to take our team an entire week of manual document review now happens in minutes. The AI agents catch things we'd miss on page 200 of a sanctions filing.",
    name: "Sarah Chen",
    title: "Head of Compliance",
    company: "Pacific Digital Bank",
  },
  {
    quote:
      "The parallel agent architecture is brilliant. Identity verification and sanctions screening happening simultaneously means we're not just faster — we're more thorough.",
    name: "Marcus Thompson",
    title: "Chief Risk Officer",
    company: "Meridian Financial",
  },
  {
    quote:
      "Finally, a system that understands the human must make the final call. Sentinel gives me everything I need to decide in one screen instead of hunting through twelve systems.",
    name: "Priya Sharma",
    title: "KYC Analyst",
    company: "Atlas Payments",
  },
  {
    quote:
      "We evaluated six compliance platforms. Sentinel was the only one that could screen against OFAC, UN, and PEP databases simultaneously with fuzzy matching for Arabic name variants.",
    name: "James Okafor",
    title: "AML Operations Lead",
    company: "NorthStar Neobank",
  },
  {
    quote:
      "The audit trail alone is worth it. Every decision is linked to evidence, every agent's reasoning is transparent. Regulators love it.",
    name: "Elena Rodriguez",
    title: "VP Compliance",
    company: "Catalyst Credit Union",
  },
  {
    quote:
      "Onboarding went from our biggest bottleneck to our competitive advantage. Three minutes to a complete risk profile with confidence scores on every data point.",
    name: "David Kim",
    title: "COO",
    company: "Horizon Fintech",
  },
];

export function Testimonials() {
  return (
    <section className="bg-[#F3F3F1]/50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Trusted by compliance professionals
        </motion.h2>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="break-inside-avoid bg-white rounded-xl p-6 border border-[#E5E5E3]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
            >
              <span className="block text-4xl font-serif text-[#f35c1d]/20 leading-none select-none">
                &ldquo;
              </span>

              <p className="text-[#1A1A1A] text-sm leading-relaxed mt-1">
                {testimonial.quote}
              </p>

              <div className="mt-5 pt-4 border-t border-[#E5E5E3]">
                <p className="font-semibold text-[#1A1A1A] text-sm">
                  {testimonial.name}
                </p>
                <p className="text-[#6B7280] text-xs mt-0.5">
                  {testimonial.title}, {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
