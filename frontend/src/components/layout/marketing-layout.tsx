"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

// --- Types ---

interface MarketingLayoutProps {
  children: ReactNode;
  /** Hide the navbar (e.g. for standalone landing pages) */
  hideNavbar?: boolean;
  /** Hide the footer */
  hideFooter?: boolean;
}

// --- Floating Particle ---

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.15 + 0.05,
  }));
}

function FloatingParticles() {
  const [particles] = useState(() => generateParticles(20));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-emerald-500"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle gradient orbs */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-200/20 blur-[120px] dark:bg-emerald-800/10" />
      <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-teal-200/15 blur-[100px] dark:bg-teal-800/10" />
      <div className="absolute bottom-20 left-1/4 h-72 w-72 rounded-full bg-green-200/15 blur-[100px] dark:bg-green-800/10" />
    </div>
  );
}

// --- Scroll to Top Button ---

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setVisible(latest > 400);
    });
    return unsubscribe;
  }, [scrollY]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full",
            "bg-white/80 text-gray-700 shadow-lg shadow-black/5 ring-1 ring-black/5 backdrop-blur-xl",
            "transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-700",
            "dark:bg-gray-900/80 dark:text-gray-300 dark:ring-white/10 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// --- Layout Component ---

export function MarketingLayout({
  children,
  hideNavbar = false,
  hideFooter = false,
}: MarketingLayoutProps) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950">
      {/* Background Effects */}
      <FloatingParticles />

      {/* Subtle grid background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Navbar */}
      {!hideNavbar && <Navbar />}

      {/* Main Content */}
      <main className={cn("relative z-10", !hideNavbar && "pt-16")}>
        {children}
      </main>

      {/* Footer */}
      {!hideFooter && <Footer />}

      {/* Scroll to Top */}
      <ScrollToTopButton />
    </div>
  );
}
