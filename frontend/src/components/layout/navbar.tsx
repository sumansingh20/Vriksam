"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  Leaf,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Building2,
  Home,
  Trees,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
];

const solutionsItems = [
  {
    label: "Corporate Greenery",
    href: "/solutions/corporate",
    description: "Transform office spaces with biophilic design and managed plant ecosystems.",
    icon: Building2,
  },
  {
    label: "Residential Gardens",
    href: "/solutions/residential",
    description: "Curated garden plans and ongoing care for homes and communities.",
    icon: Home,
  },
  {
    label: "Public Spaces",
    href: "/solutions/public",
    description: "Large-scale urban greening for parks, campuses, and civic areas.",
    icon: Trees,
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const solutionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileSolutionsOpen(false);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close solutions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        solutionsRef.current &&
        !solutionsRef.current.contains(e.target as Node)
      ) {
        setSolutionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSolutionsEnter = useCallback(() => {
    if (solutionsTimeoutRef.current) {
      clearTimeout(solutionsTimeoutRef.current);
      solutionsTimeoutRef.current = null;
    }
    setSolutionsOpen(true);
  }, []);

  const handleSolutionsLeave = useCallback(() => {
    solutionsTimeoutRef.current = setTimeout(() => {
      setSolutionsOpen(false);
    }, 150);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/80 backdrop-blur-2xl border-b border-emerald-100/30 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group relative flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 opacity-20 transition-opacity duration-300 group-hover:opacity-30" />
              <Leaf className="h-5 w-5 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              VRIKSHAM
            </span>
            {/* Live pulse dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      isActive
                        ? "text-emerald-700"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-emerald-50/80 ring-1 ring-emerald-200/40"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Solutions Dropdown */}
            <div
              ref={solutionsRef}
              className="relative"
              onMouseEnter={handleSolutionsEnter}
              onMouseLeave={handleSolutionsLeave}
            >
              <button
                onClick={() => setSolutionsOpen((prev) => !prev)}
                className={cn(
                  "relative flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200",
                  solutionsOpen
                    ? "text-emerald-700"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <span className="relative z-10">Solutions</span>
                <motion.span
                  animate={{ rotate: solutionsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>

              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 w-[420px] origin-top-right rounded-2xl border border-gray-200/60 bg-white/95 p-2 shadow-xl shadow-gray-900/[0.08] backdrop-blur-2xl"
                  >
                    {/* Subtle top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />

                    <div className="space-y-0.5 pt-1">
                      {solutionsItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSolutionsOpen(false)}
                          className="group flex items-start gap-4 rounded-xl px-4 py-3.5 transition-colors duration-150 hover:bg-emerald-50/70"
                        >
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-colors duration-150 group-hover:bg-emerald-100 group-hover:ring-emerald-200">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors duration-150">
                                {item.label}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 text-gray-400 opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-emerald-600" />
                            </div>
                            <p className="mt-0.5 text-xs leading-relaxed text-gray-500 group-hover:text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom CTA strip */}
                    <div className="mt-1 border-t border-gray-100 pt-2 pb-1 px-4">
                      <Link
                        href="/solutions"
                        onClick={() => setSolutionsOpen(false)}
                        className="group inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                      >
                        View all solutions
                        <ArrowRight className="h-3 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="group relative px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900"
            >
              Login
              <span className="absolute bottom-1 left-4 right-4 h-px origin-left scale-x-0 bg-gray-900 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-xl transition-colors md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 text-gray-900" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            />

            {/* Slide Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-40 w-[min(85vw,360px)] border-l border-gray-200/40 bg-white/95 backdrop-blur-2xl md:hidden"
            >
              <div className="flex h-full flex-col px-6 pt-20 pb-8 overflow-y-auto">
                {/* Section: Navigate */}
                <div className="mb-2">
                  <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Navigate
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {navLinks.map((link, i) => {
                      const isActive = pathname === link.href;
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * i + 0.1 }}
                        >
                          <Link
                            href={link.href}
                            onClick={closeMobile}
                            className={cn(
                              "flex items-center rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200",
                              isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            {link.label}
                            {isActive && (
                              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Section: Solutions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-2"
                >
                  <p className="px-4 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                    Solutions
                  </p>
                  <button
                    onClick={() => setMobileSolutionsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <span>Explore Solutions</span>
                    <motion.span
                      animate={{ rotate: mobileSolutionsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {mobileSolutionsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1 pl-2 pt-1 pb-2">
                          {solutionsItems.map((item, i) => (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * i }}
                            >
                              <Link
                                href={item.href}
                                onClick={closeMobile}
                                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-emerald-50/70"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                                  <item.icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-800 group-hover:text-emerald-700">
                                    {item.label}
                                  </span>
                                  <p className="text-[11px] leading-snug text-gray-400">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Divider */}
                <div className="mx-4 mb-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-col gap-3"
                >
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
