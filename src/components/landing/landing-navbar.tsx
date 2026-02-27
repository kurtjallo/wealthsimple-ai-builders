"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  FileSearch,
  UserCheck,
  AlertTriangle,
  BarChart3,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const PRODUCT_ITEMS = [
  {
    icon: FileSearch,
    title: "Document Processing",
    description: "Mistral OCR extracts and validates identity documents",
  },
  {
    icon: UserCheck,
    title: "Identity Verification",
    description: "Cross-reference name, DOB, and document validity",
  },
  {
    icon: AlertTriangle,
    title: "Sanctions Screening",
    description: "Screen against OFAC, UN, and PEP databases",
  },
  {
    icon: BarChart3,
    title: "Risk Scoring",
    description: "Weighted composite risk score with full explainability",
  },
  {
    icon: FileText,
    title: "Case Narrative",
    description: "AI-generated compliance narrative with evidence links",
  },
] as const;

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions" },
  { label: "Company", href: "#company" },
  { label: "Pricing", href: "#pricing" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Scroll shadow ---------------------------------------------------- */

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    onScroll(); // initialise on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- Mega dropdown open/close with grace period ----------------------- */

  const openMega = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 150);
  }, []);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  /* ---- Close mobile menu on route-like clicks --------------------------- */

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_6px_rgba(0,0,0,0.06)]" : ""
      }`}
      style={{
        backgroundColor: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #E5E5E3",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/*  Left — Logo                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span style={{ color: "#f35c1d" }}>
            <Shield
              size={20}
              strokeWidth={1.5}
            />
          </span>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "#1A1A1A" }}
          >
            Sentinel
          </span>
        </Link>

        {/* ---------------------------------------------------------------- */}
        {/*  Center — Desktop nav links                                      */}
        {/* ---------------------------------------------------------------- */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            if (link.label === "Product") {
              return (
                <li
                  key={link.label}
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#F3F3F1]"
                    style={{ color: "#1A1A1A" }}
                  >
                    {link.label}
                    <svg
                      className={`ml-0.5 size-3.5 transition-transform duration-200 ${
                        megaOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </a>

                  {/* ---- Mega dropdown ---------------------------------- */}
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-1/2 top-full pt-2"
                        style={{
                          transform: "translateX(-50%)",
                          width: "640px",
                          marginLeft: "0",
                        }}
                        onMouseEnter={openMega}
                        onMouseLeave={closeMega}
                      >
                        {/* We need to override framer-motion transform with our centering */}
                        <div
                          className="rounded-xl border bg-white p-6"
                          style={{
                            boxShadow:
                              "0 20px 60px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
                            borderColor: "#E5E5E3",
                          }}
                        >
                          <div className="grid grid-cols-[1fr_220px] gap-6">
                            {/* Left column — Agent items */}
                            <div className="space-y-1">
                              <p
                                className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider"
                                style={{ color: "#6B7280" }}
                              >
                                AI Agent Pipeline
                              </p>
                              {PRODUCT_ITEMS.map((item) => (
                                <a
                                  key={item.title}
                                  href="#features"
                                  className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F3F3F1]"
                                >
                                  <div
                                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg"
                                    style={{
                                      backgroundColor: "rgba(0,0,0,0.04)",
                                      color: "#6B7280",
                                    }}
                                  >
                                    <item.icon
                                      size={16}
                                      strokeWidth={1.5}
                                    />
                                  </div>
                                  <div>
                                    <p
                                      className="text-sm font-semibold leading-tight"
                                      style={{ color: "#1A1A1A" }}
                                    >
                                      {item.title}
                                    </p>
                                    <p
                                      className="mt-0.5 text-[13px] leading-snug"
                                      style={{ color: "#6B7280" }}
                                    >
                                      {item.description}
                                    </p>
                                  </div>
                                </a>
                              ))}
                            </div>

                            {/* Right column — CTA */}
                            <div
                              className="flex flex-col justify-between rounded-xl p-5"
                              style={{ backgroundColor: "#FAFAF8" }}
                            >
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#1A1A1A" }}
                                >
                                  See it in action
                                </p>
                                <p
                                  className="mt-1.5 text-[13px] leading-relaxed"
                                  style={{ color: "#6B7280" }}
                                >
                                  Watch five AI agents process a KYC case in
                                  under 3 minutes with full auditability.
                                </p>
                              </div>
                              <Link
                                href="/cases/new"
                                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                                style={{ color: "#f35c1d" }}
                              >
                                Try Demo
                                <span aria-hidden="true">&rarr;</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            }

            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#F3F3F1]"
                  style={{ color: "#1A1A1A" }}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* ---------------------------------------------------------------- */}
        {/*  Right — CTAs                                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            asChild
            className="text-sm font-medium hover:bg-[#F3F3F1]"
            style={{ color: "#1A1A1A" }}
          >
            <Link href="/dashboard">Log In</Link>
          </Button>
          <Button
            asChild
            className="rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow-md"
            style={{
              backgroundColor: "#f35c1d",
              color: "#ffffff",
            }}
          >
            <Link href="/cases/new">Try Live Demo</Link>
          </Button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  Mobile hamburger                                                */}
        {/* ---------------------------------------------------------------- */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-[#F3F3F1] md:hidden"
          style={{ color: "#1A1A1A" }}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? (
            <X size={20} strokeWidth={1.5} />
          ) : (
            <Menu size={20} strokeWidth={1.5} />
          )}
        </button>
      </nav>

      {/* ================================================================== */}
      {/*  Mobile menu                                                       */}
      {/* ================================================================== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t md:hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.97)",
              borderColor: "#E5E5E3",
            }}
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 pb-6 pt-3 sm:px-6">
              {/* Nav links */}
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#F3F3F1]"
                  style={{ color: "#1A1A1A" }}
                >
                  {link.label}
                </a>
              ))}

              {/* Agent sub-items under a subtle heading */}
              <div className="pt-2">
                <p
                  className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#6B7280" }}
                >
                  AI Agent Pipeline
                </p>
                {PRODUCT_ITEMS.map((item) => (
                  <a
                    key={item.title}
                    href="#features"
                    onClick={closeMobile}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#F3F3F1]"
                    style={{ color: "#6B7280" }}
                  >
                    <item.icon
                      size={16}
                      strokeWidth={1.5}
                    />
                    <span style={{ color: "#1A1A1A" }}>{item.title}</span>
                  </a>
                ))}
              </div>

              {/* CTAs */}
              <div
                className="flex flex-col gap-2 pt-4"
                style={{ borderTop: "1px solid #E5E5E3" }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-center text-sm font-medium hover:bg-[#F3F3F1]"
                  style={{ color: "#1A1A1A" }}
                >
                  <Link href="/dashboard" onClick={closeMobile}>
                    Log In
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-center rounded-lg text-sm font-semibold shadow-sm"
                  style={{
                    backgroundColor: "#f35c1d",
                    color: "#ffffff",
                  }}
                >
                  <Link href="/cases/new" onClick={closeMobile}>
                    Try Live Demo
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
