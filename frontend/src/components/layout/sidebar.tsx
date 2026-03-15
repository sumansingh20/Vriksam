"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  LayoutDashboard,
  Users,
  Building2,
  Flower2,
  Wrench,
  CreditCard,
  Receipt,
  BarChart3,
  Package,
  UsersRound,
  Settings,
  Eye,
  TreePine,
  ClipboardList,
  FileText,
  Globe,
  Calendar,
  Route,
  HeartPulse,
  BookOpen,
  ChevronLeft,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

type UserRole = "admin" | "client" | "technician" | "partner";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  role: UserRole;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  userName?: string;
  userAvatar?: string;
  userEmail?: string;
}

// --- Navigation Config ---

const adminNavigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Clients", href: "/admin/clients", icon: Building2 },
      { label: "Plants", href: "/admin/plants", icon: Flower2 },
      { label: "Technicians", href: "/admin/technicians", icon: Wrench },
      { label: "Teams", href: "/admin/teams", icon: UsersRound },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
      { label: "Payments", href: "/admin/payments", icon: Receipt },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Inventory", href: "/admin/inventory", icon: Package },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const clientNavigation: NavGroup[] = [
  {
    title: "Dashboard",
    items: [
      { label: "Overview", href: "/client/overview", icon: Eye },
      { label: "My Plants", href: "/client/plants", icon: TreePine },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Maintenance", href: "/client/maintenance", icon: ClipboardList },
      { label: "Reports", href: "/client/reports", icon: FileText },
      { label: "Subscriptions", href: "/client/subscriptions", icon: CreditCard },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "ESG Impact", href: "/client/esg", icon: Globe },
      { label: "Settings", href: "/client/settings", icon: Settings },
    ],
  },
];

const techNavigation: NavGroup[] = [
  {
    title: "Work",
    items: [
      { label: "Schedule", href: "/tech/schedule", icon: Calendar },
      { label: "Routes", href: "/tech/routes", icon: Route },
    ],
  },
  {
    title: "Plant Care",
    items: [
      { label: "Plant Health", href: "/tech/plant-health", icon: HeartPulse },
      { label: "Maintenance Log", href: "/tech/maintenance-log", icon: BookOpen },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/tech/settings", icon: Settings },
    ],
  },
];

const partnerNavigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/partner/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Clients", href: "/partner/clients", icon: Users },
      { label: "Plants", href: "/partner/plants", icon: Flower2 },
      { label: "Maintenance", href: "/partner/maintenance", icon: ClipboardList },
      { label: "Technicians", href: "/partner/technicians", icon: Wrench },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Reports", href: "/partner/reports", icon: BarChart3 },
      { label: "Settings", href: "/partner/settings", icon: Settings },
    ],
  },
];

const navigationMap: Record<UserRole, NavGroup[]> = {
  admin: adminNavigation,
  client: clientNavigation,
  technician: techNavigation,
  partner: partnerNavigation,
};

// --- Component ---

export function Sidebar({
  role,
  collapsed = false,
  onCollapsedChange,
  userName = "John Doe",
  userAvatar,
  userEmail = "john@vriksham.com",
}: SidebarProps) {
  const pathname = usePathname();
  const navigation = useMemo(() => navigationMap[role], [role]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 left-0 z-30 flex h-screen flex-col border-r border-gray-200",
        "bg-white"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-4">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gray-900" />
            <Leaf className="h-5 w-5 relative z-10 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-lg font-bold tracking-tight text-gray-900"
              >
                VRIKSHAM
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <div className="flex flex-col gap-6">
          {navigation.map((group) => (
            <div key={group.title}>
              <AnimatePresence>
                {!collapsed && (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400"
                  >
                    {group.title}
                  </motion.h3>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                  const Icon = item.icon;

                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                          collapsed && "justify-center px-0",
                          isActive
                            ? "text-gray-900"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Active Background */}
                        {isActive && (
                          <motion.div
                            layoutId={`sidebar-active-${role}`}
                            className="absolute inset-0 rounded-xl bg-gray-100"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}

                        {/* Active indicator bar */}
                        {isActive && (
                          <motion.div
                            layoutId={`sidebar-indicator-${role}`}
                            className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-gray-900"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}

                        <Icon
                          className={cn(
                            "relative z-10 h-[18px] w-[18px] shrink-0 transition-colors",
                            isActive
                              ? "text-gray-900"
                              : "text-gray-400 group-hover:text-gray-600"
                          )}
                        />

                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.15 }}
                              className="relative z-10 overflow-hidden whitespace-nowrap"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                          <div className="pointer-events-none absolute left-full ml-2 hidden rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 lg:block">
                            {item.label}
                            <div className="absolute top-1/2 -left-1 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900" />
                          </div>
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-gray-200 px-3 py-2">
        <motion.button
          onClick={() => onCollapsedChange?.(!collapsed)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600",
            collapsed && "justify-center px-0"
          )}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* User Section */}
      <div className="border-t border-gray-200 px-3 py-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2",
            collapsed && "justify-center px-0"
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 overflow-hidden"
              >
                <p className="truncate text-sm font-medium text-gray-900">
                  {userName}
                </p>
                <p className="truncate text-xs text-gray-500">{userEmail}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
