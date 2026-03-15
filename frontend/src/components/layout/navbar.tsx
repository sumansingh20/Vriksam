"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { Leaf, Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const closeMobile = useCallback(() => setMobileOpen(false), []);

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

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-white/20 shadow-[0_1px_40px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group relative flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 opacity-20 transition-opacity duration-300 group-hover:opacity-30" />
              <Leaf className="h-5 w-5 text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              VRIKSHAM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
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
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    )}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full bg-emerald-50 dark:bg-emerald-950/40"
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
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Login
            </Link>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow duration-300 hover:shadow-emerald-500/40"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Get Started
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500"
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
                  <X className="h-5 w-5 text-gray-900 dark:text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
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
              className="fixed top-0 right-0 bottom-0 z-40 w-[min(80vw,320px)] border-l border-white/10 bg-white/90 backdrop-blur-2xl dark:bg-gray-950/90 md:hidden"
            >
              <div className="flex h-full flex-col px-6 pt-24 pb-8">
                {/* Nav Links */}
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i + 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMobile}
                          className={cn(
                            "flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-200",
                            isActive
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
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

                {/* Spacer */}
                <div className="flex-1" />

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-3"
                >
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobile}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25"
                  >
                    Get Started
                    <ChevronRight className="h-4 w-4" />
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
