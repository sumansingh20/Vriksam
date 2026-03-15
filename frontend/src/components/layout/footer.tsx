"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Leaf,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  ArrowRight,
  Mail,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const footerLinks = {
  Platform: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "AI Health Check", href: "#" },
    { label: "Analytics", href: "#" },
  ],
  Solutions: [
    { label: "Corporate", href: "/solutions/corporate" },
    { label: "Residential", href: "/solutions/residential" },
    { label: "Public Spaces", href: "/solutions/public" },
    { label: "Custom", href: "/contact" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Support: [
    { label: "Documentation", href: "#" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "X (Twitter)" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "GitHub" },
];

function FadeInSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gray-950">
      {/* Botanical SVG Background Pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Leaf pattern - top right cluster */}
        <svg
          className="absolute -top-20 -right-20 h-[500px] w-[500px] text-emerald-500/[0.03]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path
            d="M200 50c0 0-100 80-100 180s100 120 100 120 100-20 100-120S200 50 200 50z"
            fill="currentColor"
          />
          <path
            d="M200 50c0 0 0 150 0 300"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <path
            d="M200 120c-30 20-60 30-80 35"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d="M200 170c-35 25-70 35-90 40"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d="M200 220c-30 20-65 30-85 35"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d="M200 120c30 20 60 30 80 35"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d="M200 170c35 25 70 35 90 40"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <path
            d="M200 220c30 20 65 30 85 35"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
          />
        </svg>

        {/* Leaf pattern - bottom left cluster */}
        <svg
          className="absolute -bottom-16 -left-16 h-[400px] w-[400px] rotate-[135deg] text-emerald-500/[0.025]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <path
            d="M200 60c0 0-80 70-80 160s80 100 80 100 80-10 80-100S200 60 200 60z"
            fill="currentColor"
          />
          <path
            d="M200 60c0 0 0 130 0 260"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>

        {/* Subtle emerald glow */}
        <div className="absolute top-0 left-1/4 h-[300px] w-[500px] rounded-full bg-emerald-500/[0.02] blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[200px] w-[400px] rounded-full bg-emerald-600/[0.015] blur-3xl" />
      </div>

      {/* Top Section - Brand + Newsletter */}
      <div className="relative border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
              {/* Brand */}
              <div className="max-w-md">
                <Link href="/" className="group inline-flex items-center gap-2.5">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                    VRIKSHAM
                  </span>
                </Link>
                <p className="mt-4 text-base leading-relaxed text-gray-400">
                  Making cities greener, one plant at a time.
                </p>
                <a
                  href="mailto:hello@vriksham.com"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors duration-200 hover:text-emerald-400"
                >
                  <Mail className="h-3.5 w-3.5" />
                  hello@vriksham.com
                </a>
              </div>

              {/* Newsletter */}
              <div className="w-full max-w-md">
                <h3 className="text-sm font-semibold text-white">
                  Stay in the loop
                </h3>
                <p className="mt-1.5 text-sm text-gray-500">
                  Green insights and product updates, delivered monthly.
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="mt-4 flex gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="you@company.com"
                      className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white placeholder:text-gray-600 transition-all duration-200 focus:border-emerald-500/40 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 hover:shadow-xl"
                  >
                    Subscribe
                    <Send className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </form>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>

      {/* Link Columns */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4">
            {Object.entries(footerLinks).map(([title, links], colIdx) => (
              <FadeInSection key={title} delay={0.05 * colIdx}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-gray-500 transition-colors duration-200 hover:text-white"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      {/* Bottom Bar */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
              <p className="text-sm text-gray-600">
                &copy; 2026 Vriksham. All rights reserved.
              </p>
              <div className="flex items-center gap-1">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-all duration-200",
                      "hover:bg-white/[0.06] hover:text-white"
                    )}
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </footer>
  );
}
