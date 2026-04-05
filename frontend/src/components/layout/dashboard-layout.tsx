"use client";

import { useState, useCallback, useMemo, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";
import { RouteTransition } from "@/components/motion/route-transition";

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

interface AuthUserShape {
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string;
  role?: string;
}

function resolveName(user: AuthUserShape | null, fallback: string): string {
  if (!user) return fallback;
  if (typeof user.name === "string" && user.name.trim().length > 0) {
    return user.name.trim();
  }
  if (typeof user.fullName === "string" && user.fullName.trim().length > 0) {
    return user.fullName.trim();
  }
  const first = typeof user.firstName === "string" ? user.firstName.trim() : "";
  const last = typeof user.lastName === "string" ? user.lastName.trim() : "";
  const combined = `${first} ${last}`.trim();
  return combined.length > 0 ? combined : fallback;
}

function resolveRoleLabel(roleValue: string | undefined, fallback: string): string {
  if (!roleValue) return fallback;
  const normalized = roleValue.toUpperCase();

  if (normalized === "SUPER_ADMIN" || normalized === "ADMIN") return "Administrator";
  if (normalized === "PARTNER") return "Partner";
  if (normalized === "TECHNICIAN") return "Technician";
  if (normalized === "CLIENT" || normalized === "USER") return "Client";

  return fallback;
}

function defaultRoleLabel(role: UserRole): string {
  if (role === "admin") return "Administrator";
  if (role === "partner") return "Partner";
  if (role === "technician") return "Technician";
  return "Client";
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
  userName,
  userAvatar,
  userEmail,
  userRole,
  notificationCount = 0,
  breadcrumbs: breadcrumbsProp,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authUser = (user ?? null) as AuthUserShape | null;

  const breadcrumbs = breadcrumbsProp || generateBreadcrumbs(pathname);

  const resolvedUserName = useMemo(
    () => userName || resolveName(authUser, "Vriksham User"),
    [authUser, userName],
  );

  const resolvedUserEmail = useMemo(() => {
    if (userEmail) return userEmail;
    if (typeof authUser?.email === "string" && authUser.email.length > 0) {
      return authUser.email;
    }
    return "account@vriksham.com";
  }, [authUser, userEmail]);

  const resolvedUserAvatar = useMemo(
    () => userAvatar || authUser?.avatar || authUser?.avatarUrl,
    [authUser, userAvatar],
  );

  const resolvedUserRole = useMemo(
    () =>
      userRole ||
      resolveRoleLabel(authUser?.role, defaultRoleLabel(role)),
    [authUser?.role, role, userRole],
  );

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleSignOut = useCallback(() => {
    void logout();
  }, [logout]);

  return (
    <div className="dashboard-shell-bg relative flex h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="dashboard-orb-one absolute -left-28 top-10 h-80 w-80 rounded-full blur-3xl" />
        <div className="dashboard-orb-two absolute -right-24 top-1/3 h-96 w-96 rounded-full blur-3xl" />
        <div className="dashboard-grid-overlay absolute inset-0" />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          role={role}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          userName={resolvedUserName}
          userAvatar={resolvedUserAvatar}
          userEmail={resolvedUserEmail}
          onSignOut={handleSignOut}
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
                userName={resolvedUserName}
                userAvatar={resolvedUserAvatar}
                userEmail={resolvedUserEmail}
                onSignOut={handleSignOut}
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
          role={role}
          breadcrumbs={breadcrumbs}
          notificationCount={notificationCount}
          userName={resolvedUserName}
          userAvatar={resolvedUserAvatar}
          userRole={resolvedUserRole}
          onMobileMenuToggle={toggleMobileMenu}
          isMobileMenuOpen={mobileMenuOpen}
          onSignOut={handleSignOut}
        />

        {/* Page Content */}
        <main className="relative flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <RouteTransition tone="dashboard" className="dashboard-content-frame">
            {children}
          </RouteTransition>
        </main>
      </motion.div>
    </div>
  );
}

export default DashboardLayout;
