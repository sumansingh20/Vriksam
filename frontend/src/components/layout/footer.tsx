"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Leaf,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
const footerLinks = {
  Product: [
    { label: "Plant Care", href: "/solutions/plant-care" },
    { label: "Maintenance", href: "/solutions/maintenance" },
    { label: "Analytics", href: "/solutions/analytics" },
    { label: "ESG Reporting", href: "/solutions/esg" },
    { label: "Integrations", href: "/integrations" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "Webinars", href: "/webinars" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Compliance", href: "/compliance" },
    { label: "Security", href: "/security" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/vriksham", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/vriksham", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/vriksham", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com/vriksham", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-emerald-950/90 to-gray-950" />

      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Large blurred leaf shape - top right */}
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
        {/* Smaller blurred shape - bottom left */}
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-green-500/5 blur-3xl" />
        {/* Decorative leaf outlines */}
        <svg
          className="absolute top-10 right-20 h-40 w-40 text-emerald-800/10"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <path d="M50 10 C30 30, 10 50, 50 90 C90 50, 70 30, 50 10 Z" />
          <path d="M50 10 C50 50, 50 50, 50 90" />
          <path d="M35 35 C45 40, 50 45, 50 50" />
          <path d="M65 35 C55 40, 50 45, 50 50" />
          <path d="M30 55 C40 55, 50 55, 50 60" />
          <path d="M70 55 C60 55, 50 55, 50 60" />
        </svg>
        <svg
          className="absolute bottom-32 left-10 h-24 w-24 rotate-45 text-emerald-800/8"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <path d="M50 10 C30 30, 10 50, 50 90 C90 50, 70 30, 50 10 Z" />
          <path d="M50 10 C50 50, 50 50, 50 90" />
        </svg>
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/5">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  Stay rooted in{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                    green innovation
                  </span>
                </h3>
                <p className="mt-2 max-w-md text-gray-400">
                  Get the latest updates on sustainable plant infrastructure, industry
                  insights, and product news.
                </p>
              </div>
              <div className="w-full max-w-md">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      placeholder="you@company.com"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 backdrop-blur-sm transition-all duration-200 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="group flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-shadow duration-300 hover:shadow-emerald-500/30"
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </motion.button>
                </form>
                <p className="mt-3 text-xs text-gray-500">
                  No spam. Unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {/* Company Info */}
            <div className="col-span-2">
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 opacity-25" />
                  <Leaf className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                  VRIKSHAM
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
                Transforming green infrastructure management with intelligent
                technology. Building a sustainable future, one plant at a time.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="mailto:hello@vriksham.com"
                  className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-emerald-400"
                >
                  <Mail className="h-4 w-4" />
                  hello@vriksham.com
                </a>
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-emerald-400"
                >
                  <Phone className="h-4 w-4" />
                  +91 123 456 7890
                </a>
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 shrink-0" />
                  Hyderabad, India
                </span>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white">{title}</h4>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 transition-colors duration-200 hover:text-emerald-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:px-6 md:flex-row lg:px-8">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} VRIKSHAM. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-gray-400 transition-colors duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
