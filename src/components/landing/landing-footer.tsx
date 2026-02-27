import Link from "next/link";
import { Shield } from "lucide-react";

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

export function LandingFooter() {
  return (
    <footer className="bg-[#1A1A1A] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span style={{ color: "#f35c1d" }}>
            <Shield size={20} strokeWidth={1.5} />
          </span>
          <span className="font-bold text-lg">Sentinel</span>
          <span className="text-sm text-gray-400">
            AI-Powered KYC/AML Operations
          </span>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {footerColumns.map((column) => (
            <div key={column.heading}>
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
            </div>
          ))}
        </div>

        {/* Divider + bottom row */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">
              Built for Wealthsimple AI Builders 2026
            </span>
            <span className="text-xs text-gray-500">
              &copy; 2026 Sentinel. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
