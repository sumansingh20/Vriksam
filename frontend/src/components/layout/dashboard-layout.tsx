"use client";

import { useState, useCallback, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";

// --- Types ---

type UserRole = "admin" | "client" | "technician" | "partner";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
  userRole?: string;
  notificationCount?: number;
  breadcrumbs?: Breadcrumb[];
}

// --- Helpers ---

function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Breadcrumb[] = [];

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    crumbs.push({
      label,
      href: index < segments.length - 1 ? href : undefined,
    });
  });

  return crumbs;
}

// --- Component ---

export function DashboardLayout({
  children,
  role,
  userName = "John Doe",
  userAvatar,
  userEmail = "john@vriksham.com",
  userRole = "Admin",
  notificationCount = 0,
  breadcrumbs: breadcrumbsProp,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const breadcrumbs = breadcrumbsProp || generateBreadcrumbs(pathname);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#fafafa]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          role={role}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          userName={userName}
          userAvatar={userAvatar}
          userEmail={userEmail}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar
                role={role}
                collapsed={false}
                userName={userName}
                userAvatar={userAvatar}
                userEmail={userEmail}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <motion.div
        initial={false}
        animate={{
          paddingLeft: sidebarCollapsed ? 72 : 260,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "relative z-10 flex flex-1 flex-col overflow-hidden",
          "max-lg:!pl-0" // No padding on mobile
        )}
      >
        <DashboardHeader
          breadcrumbs={breadcrumbs}
          notificationCount={notificationCount}
          userName={userName}
          userAvatar={userAvatar}
          userRole={userRole}
          onMobileMenuToggle={toggleMobileMenu}
          isMobileMenuOpen={mobileMenuOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}

export default DashboardLayout;
