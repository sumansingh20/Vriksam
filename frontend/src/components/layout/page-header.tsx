"use client";

import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  className?: string;
  showAccent?: boolean;
}

// --- Component ---

export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="mb-3 flex items-center gap-1" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 text-gray-300" />
                )}
                {isLast || !crumb.href ? (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isLast ? "text-gray-900" : "text-gray-400"
                    )}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
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
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
