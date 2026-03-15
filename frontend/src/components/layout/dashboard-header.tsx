"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

interface Breadcrumb {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  breadcrumbs?: Breadcrumb[];
  notificationCount?: number;
  userName?: string;
  userAvatar?: string;
  userRole?: string;
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

// --- Component ---

export function DashboardHeader({
  breadcrumbs = [],
  notificationCount = 0,
  userName = "John Doe",
  userAvatar,
  userRole = "Admin",
  onMobileMenuToggle,
  isMobileMenuOpen = false,
}: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-100 px-4 sm:px-6 lg:px-8",
        "bg-white/70 backdrop-blur-2xl dark:border-white/5 dark:bg-gray-950/70"
      )}
    >
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMobileMenuToggle}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/5 dark:hover:text-gray-300 lg:hidden"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Breadcrumbs */}
      <nav className="hidden items-center gap-1 md:flex" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
              )}
              {isLast || !crumb.href ? (
                <span
                  className={cn(
                    "text-sm",
                    isLast
                      ? "font-medium text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {crumb.label}
                </Link>
              )}
            </Fragment>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative">
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ width: 40, opacity: 0.5 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="h-9 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-16 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                onBlur={() => {
                  if (!searchQuery) setSearchOpen(false);
                }}
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <kbd className="hidden rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-white/10 dark:bg-white/5 sm:inline-block">
                  ESC
                </kbd>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-500 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="ml-1 hidden rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium dark:border-white/10 dark:bg-white/5 sm:inline-block">
                {"\u2318"}K
              </kbd>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:text-gray-300"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {notificationCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/30"
          >
            {notificationCount > 99 ? "99+" : notificationCount}
          </motion.span>
        )}
      </motion.button>

      {/* User Dropdown */}
      <div ref={userMenuRef} className="relative">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors",
            userMenuOpen
              ? "bg-gray-100 dark:bg-white/5"
              : "hover:bg-gray-50 dark:hover:bg-white/5"
          )}
        >
          {/* Avatar */}
          <div className="relative h-8 w-8 shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 text-xs font-bold text-white">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 dark:border-gray-950" />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {userName}
            </p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {userMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl shadow-black/5 dark:border-white/10 dark:bg-gray-900"
            >
              <div className="border-b border-gray-100 px-4 py-3 dark:border-white/5">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userName}
                </p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>

              <div className="py-1.5">
                {[
                  { icon: User, label: "Profile", href: "/profile" },
                  { icon: Settings, label: "Settings", href: "/settings" },
                  { icon: HelpCircle, label: "Help & Support", href: "/help" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    <item.icon className="h-4 w-4 text-gray-400" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-100 py-1.5 dark:border-white/5">
                <button
                  onClick={() => setUserMenuOpen(false)}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/5"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
