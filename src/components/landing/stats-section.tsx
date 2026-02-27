"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayValue = useMotionValue(`0${suffix}`);

  useEffect(() => {
    if (isInView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, count, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      displayValue.set(`${latest}${suffix}`);
    });
    return unsubscribe;
  }, [rounded, displayValue, suffix]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

interface StatItem {
  id: string;
  renderValue: React.ReactNode;
  label: string;
}

const statVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function StatsSection() {
  const stats: StatItem[] = [
    {
      id: "processing-time",
      renderValue: (
        <span>
          <span className="text-5xl lg:text-6xl">
            <AnimatedNumber value={5} />
          </span>
          <span className="text-2xl lg:text-3xl font-normal text-[#4B5563]">
            {" "}
            days{" "}
          </span>
          <span
            className="text-3xl lg:text-4xl text-[#2563EB]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            &rarr;
          </span>
          <span className="text-5xl lg:text-6xl">
            {" "}
            <AnimatedNumber value={3} />
          </span>
          <span className="text-2xl lg:text-3xl font-normal text-[#4B5563]">
            {" "}
            min
          </span>
        </span>
      ),
      label: "Processing time",
    },
    {
      id: "agents",
      renderValue: (
        <span>
          <span className="text-5xl lg:text-6xl">
            <AnimatedNumber value={5} />
          </span>
          <span className="text-2xl lg:text-3xl font-normal text-[#4B5563]">
            {" "}
            Agents
          </span>
        </span>
      ),
      label: "Working in parallel",
    },
    {
      id: "lists",
      renderValue: (
        <span>
          <span className="text-5xl lg:text-6xl">
            <AnimatedNumber value={3} />
          </span>
          <span className="text-2xl lg:text-3xl font-normal text-[#4B5563]">
            {" "}
            Lists
          </span>
        </span>
      ),
      label: "OFAC + UN + PEP",
    },
    {
      id: "auditable",
      renderValue: (
        <span className="text-5xl lg:text-6xl">
          <AnimatedNumber value={100} suffix="%" />
        </span>
      ),
      label: "Auditable decisions",
    },
  ];

  return (
    <section className="bg-white py-24 border-t border-[#E2E8F0]">
      <motion.div
        className="max-w-7xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={statVariants}
              className="flex flex-col items-center"
            >
              <div
                className="text-5xl lg:text-6xl font-semibold tracking-tight text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {stat.renderValue}
              </div>
              <p className="text-base text-[#6B7280] mt-3">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
