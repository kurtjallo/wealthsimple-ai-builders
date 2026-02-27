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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const stats: StatItem[] = [
    {
      id: "processing-time",
      renderValue: (
        <span>
          <AnimatedNumber value={5} /> days{" "}
          <span className="text-[#f35c1d]">&rarr;</span>{" "}
          <AnimatedNumber value={3} /> min
        </span>
      ),
      label: "Processing time",
    },
    {
      id: "agents",
      renderValue: (
        <span>
          <AnimatedNumber value={5} /> Agents
        </span>
      ),
      label: "Working in parallel",
    },
    {
      id: "lists",
      renderValue: (
        <span>
          <AnimatedNumber value={3} /> Lists
        </span>
      ),
      label: "OFAC + UN + PEP",
    },
    {
      id: "auditable",
      renderValue: (
        <span>
          <AnimatedNumber value={100} suffix="%" />
        </span>
      ),
      label: "Auditable decisions",
    },
  ];

  return (
    <section ref={sectionRef} className="bg-white py-24">
      <motion.div
        className="max-w-7xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={cardVariants}
              className="flex flex-col items-center"
            >
              <div
                className="font-mono text-4xl lg:text-5xl font-bold text-[#1A1A1A]"
                style={{
                  animation: isInView
                    ? "count-pulse 0.4s ease-out 2s 1"
                    : "none",
                }}
              >
                {stat.renderValue}
              </div>
              <p className="text-sm text-[#6B7280] mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
