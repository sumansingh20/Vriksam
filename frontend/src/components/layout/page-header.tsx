"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional description below title */
  description?: string;
  /** Breadcrumb trail */
  breadcrumbs?: Breadcrumb[];
  /** Action buttons rendered on the right side */
  actions?: ReactNode;
  /** Additional class names */
  className?: string;
  /** Show gradient accent line */
  showAccent?: boolean;
}

// --- Component ---

export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  className,
  showAccent = true,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("relative mb-8", className)}
    >
      {/* Gradient Accent Line */}
      {showAccent && (
        <div className="absolute top-0 left-0 h-px w-full overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="h-full w-full bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
          />
        </div>
      )}

      <div className={cn("pt-4", showAccent && "pt-6")}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-3 flex items-center gap-1" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <Fragment key={`${crumb.label}-${index}`}>
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                  )}
                  {isLast || !crumb.href ? (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isLast
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-gray-400 dark:text-gray-500"
                      )}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-xs font-medium text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </Fragment>
              );
            })}
          </nav>
        )}

        {/* Title Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <motion.h1
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl"
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-1.5 max-w-2xl text-sm text-gray-500 dark:text-gray-400"
              >
                {description}
              </motion.p>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex shrink-0 items-center gap-2"
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom separator with subtle gradient */}
      <div className="mt-6 h-px bg-gradient-to-r from-gray-200 via-gray-200 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent" />
    </motion.div>
  );
}
