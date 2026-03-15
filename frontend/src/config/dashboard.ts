// =============================================================================
// VRIKSHAM Frontend - Dashboard Navigation Configuration
// Role-based sidebar navigation for admin, client, and technician dashboards
// =============================================================================

import type { SidebarLink } from '../types';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface DashboardConfig {
  role: string;
  label: string;
  description: string;
  defaultPath: string;
  navigation: SidebarLink[];
}

// -----------------------------------------------------------------------------
// Admin Dashboard Navigation
// -----------------------------------------------------------------------------

export const adminNavigation: SidebarLink[] = [
  {
    title: 'Overview',
    href: '/dashboard/admin',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Clients',
    href: '/dashboard/admin/clients',
    icon: 'Users',
  },
  {
    title: 'Plants',
    href: '/dashboard/admin/plants',
    icon: 'Leaf',
    children: [
      {
        title: 'All Plants',
        href: '/dashboard/admin/plants',
        icon: 'Leaf',
      },
      {
        title: 'Species Library',
        href: '/dashboard/admin/species',
        icon: 'BookOpen',
      },
      {
        title: 'Health Alerts',
        href: '/dashboard/admin/plants/alerts',
        icon: 'AlertTriangle',
        badge: 5,
        badgeVariant: 'destructive',
      },
    ],
  },
  {
    title: 'Locations',
    href: '/dashboard/admin/locations',
    icon: 'MapPin',
  },
  {
    title: 'Service Visits',
    href: '/dashboard/admin/service-visits',
    icon: 'CalendarCheck',
    badge: 12,
    badgeVariant: 'default',
  },
  {
    title: 'Technicians',
    href: '/dashboard/admin/technicians',
    icon: 'Wrench',
    children: [
      {
        title: 'All Technicians',
        href: '/dashboard/admin/technicians',
        icon: 'Wrench',
      },
      {
        title: 'Teams',
        href: '/dashboard/admin/teams',
        icon: 'UsersRound',
      },
      {
        title: 'Schedule',
        href: '/dashboard/admin/schedule',
        icon: 'Calendar',
      },
    ],
  },
  {
    title: 'Subscriptions',
    href: '/dashboard/admin/subscriptions',
    icon: 'CreditCard',
  },
  {
    title: 'Invoices',
    href: '/dashboard/admin/invoices',
    icon: 'FileText',
    children: [
      {
        title: 'All Invoices',
        href: '/dashboard/admin/invoices',
        icon: 'FileText',
      },
      {
        title: 'Payments',
        href: '/dashboard/admin/payments',
        icon: 'Banknote',
      },
    ],
  },
  {
    title: 'Inventory',
    href: '/dashboard/admin/inventory',
    icon: 'Package',
  },
  {
    title: 'ESG Reports',
    href: '/dashboard/admin/esg-reports',
    icon: 'BarChart3',
    isNew: true,
  },
  {
    title: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: 'TrendingUp',
    children: [
      {
        title: 'Plant Analytics',
        href: '/dashboard/admin/analytics/plants',
        icon: 'Leaf',
      },
      {
        title: 'Revenue',
        href: '/dashboard/admin/analytics/revenue',
        icon: 'IndianRupee',
      },
      {
        title: 'Team Performance',
        href: '/dashboard/admin/analytics/team',
        icon: 'Award',
      },
    ],
  },
  {
    title: 'Users',
    href: '/dashboard/admin/users',
    icon: 'UserCog',
  },
  {
    title: 'Notifications',
    href: '/dashboard/admin/notifications',
    icon: 'Bell',
    badge: 3,
    badgeVariant: 'warning',
  },
  {
    title: 'Settings',
    href: '/dashboard/admin/settings',
    icon: 'Settings',
  },
];

// -----------------------------------------------------------------------------
// Client Dashboard Navigation
// -----------------------------------------------------------------------------

export const clientNavigation: SidebarLink[] = [
  {
    title: 'Dashboard',
    href: '/dashboard/client',
    icon: 'LayoutDashboard',
  },
  {
    title: 'My Plants',
    href: '/dashboard/client/plants',
    icon: 'Leaf',
  },
  {
    title: 'My Locations',
    href: '/dashboard/client/locations',
    icon: 'MapPin',
  },
  {
    title: 'Service History',
    href: '/dashboard/client/service-history',
    icon: 'CalendarCheck',
    children: [
      {
        title: 'Upcoming Visits',
        href: '/dashboard/client/service-history/upcoming',
        icon: 'CalendarClock',
      },
      {
        title: 'Past Visits',
        href: '/dashboard/client/service-history/past',
        icon: 'History',
      },
    ],
  },
  {
    title: 'ESG Impact',
    href: '/dashboard/client/esg',
    icon: 'BarChart3',
    isNew: true,
  },
  {
    title: 'Subscription',
    href: '/dashboard/client/subscription',
    icon: 'CreditCard',
  },
  {
    title: 'Invoices',
    href: '/dashboard/client/invoices',
    icon: 'FileText',
    badge: 1,
    badgeVariant: 'warning',
  },
  {
    title: 'Reports',
    href: '/dashboard/client/reports',
    icon: 'FileBarChart',
    children: [
      {
        title: 'Plant Health Report',
        href: '/dashboard/client/reports/health',
        icon: 'HeartPulse',
      },
      {
        title: 'ESG Report',
        href: '/dashboard/client/reports/esg',
        icon: 'Leaf',
      },
      {
        title: 'Service Report',
        href: '/dashboard/client/reports/service',
        icon: 'ClipboardList',
      },
    ],
  },
  {
    title: 'Support',
    href: '/dashboard/client/support',
    icon: 'LifeBuoy',
  },
  {
    title: 'Feedback',
    href: '/dashboard/client/feedback',
    icon: 'MessageSquare',
  },
  {
    title: 'Notifications',
    href: '/dashboard/client/notifications',
    icon: 'Bell',
    badge: 2,
    badgeVariant: 'default',
  },
  {
    title: 'Settings',
    href: '/dashboard/client/settings',
    icon: 'Settings',
  },
];

// -----------------------------------------------------------------------------
// Technician Dashboard Navigation
// -----------------------------------------------------------------------------

export const technicianNavigation: SidebarLink[] = [
  {
    title: 'Dashboard',
    href: '/dashboard/technician',
    icon: 'LayoutDashboard',
  },
  {
    title: 'My Schedule',
    href: '/dashboard/technician/schedule',
    icon: 'CalendarCheck',
    badge: 4,
    badgeVariant: 'default',
  },
  {
    title: 'Today\'s Visits',
    href: '/dashboard/technician/today',
    icon: 'CalendarClock',
    badge: 3,
    badgeVariant: 'warning',
  },
  {
    title: 'My Locations',
    href: '/dashboard/technician/locations',
    icon: 'MapPin',
  },
  {
    title: 'Plant Checkup',
    href: '/dashboard/technician/plant-checkup',
    icon: 'HeartPulse',
    children: [
      {
        title: 'Health Assessment',
        href: '/dashboard/technician/plant-checkup/assess',
        icon: 'Stethoscope',
      },
      {
        title: 'QR Scan',
        href: '/dashboard/technician/plant-checkup/scan',
        icon: 'QrCode',
      },
      {
        title: 'Treatment Log',
        href: '/dashboard/technician/plant-checkup/treatments',
        icon: 'ClipboardList',
      },
    ],
  },
  {
    title: 'Inventory',
    href: '/dashboard/technician/inventory',
    icon: 'Package',
    children: [
      {
        title: 'My Stock',
        href: '/dashboard/technician/inventory/stock',
        icon: 'Box',
      },
      {
        title: 'Request Materials',
        href: '/dashboard/technician/inventory/request',
        icon: 'ShoppingCart',
      },
    ],
  },
  {
    title: 'Plant AI Assistant',
    href: '/dashboard/technician/ai-assistant',
    icon: 'Brain',
    isNew: true,
  },
  {
    title: 'My Performance',
    href: '/dashboard/technician/performance',
    icon: 'Award',
  },
  {
    title: 'Team',
    href: '/dashboard/technician/team',
    icon: 'UsersRound',
  },
  {
    title: 'Notifications',
    href: '/dashboard/technician/notifications',
    icon: 'Bell',
    badge: 2,
    badgeVariant: 'default',
  },
  {
    title: 'Settings',
    href: '/dashboard/technician/settings',
    icon: 'Settings',
  },
];

// -----------------------------------------------------------------------------
// Partner Dashboard Navigation
// -----------------------------------------------------------------------------

export const partnerNavigation: SidebarLink[] = [
  {
    title: 'Dashboard',
    href: '/dashboard/partner',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Clients',
    href: '/dashboard/partner/clients',
    icon: 'Users',
  },
  {
    title: 'Plants',
    href: '/dashboard/partner/plants',
    icon: 'Leaf',
  },
  {
    title: 'Maintenance',
    href: '/dashboard/partner/maintenance',
    icon: 'CalendarCheck',
    badge: 12,
    badgeVariant: 'default',
  },
  {
    title: 'Technicians',
    href: '/dashboard/partner/technicians',
    icon: 'Wrench',
  },
  {
    title: 'Reports',
    href: '/dashboard/partner/reports',
    icon: 'BarChart3',
  },
  {
    title: 'Notifications',
    href: '/dashboard/partner/notifications',
    icon: 'Bell',
    badge: 3,
    badgeVariant: 'warning',
  },
  {
    title: 'Settings',
    href: '/dashboard/partner/settings',
    icon: 'Settings',
  },
];

// -----------------------------------------------------------------------------
// Dashboard Config by Role
// -----------------------------------------------------------------------------

export const dashboardConfigs: Record<string, DashboardConfig> = {
  admin: {
    role: 'admin',
    label: 'Admin Dashboard',
    description: 'Full platform management and analytics.',
    defaultPath: '/dashboard/admin',
    navigation: adminNavigation,
  },
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin Dashboard',
    description: 'Full platform management with system settings.',
    defaultPath: '/dashboard/admin',
    navigation: adminNavigation,
  },
  manager: {
    role: 'manager',
    label: 'Manager Dashboard',
    description: 'Team and operations management.',
    defaultPath: '/dashboard/admin',
    navigation: adminNavigation,
  },
  client: {
    role: 'client',
    label: 'Client Dashboard',
    description: 'View your plants, locations, and ESG impact.',
    defaultPath: '/dashboard/client',
    navigation: clientNavigation,
  },
  technician: {
    role: 'technician',
    label: 'Technician Dashboard',
    description: 'Manage your schedule, visits, and plant care tasks.',
    defaultPath: '/dashboard/technician',
    navigation: technicianNavigation,
  },
  partner: {
    role: 'partner',
    label: 'Partner Dashboard',
    description: 'Manage service operations, clients, and technician teams.',
    defaultPath: '/dashboard/partner',
    navigation: partnerNavigation,
  },
  viewer: {
    role: 'viewer',
    label: 'Viewer Dashboard',
    description: 'Read-only access to plant and ESG data.',
    defaultPath: '/dashboard/client',
    navigation: clientNavigation.filter(
      (link) => !['Support', 'Feedback', 'Settings'].includes(link.title),
    ),
  },
};

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Returns the dashboard navigation configuration for a given user role.
 *
 * @param role - The user role string
 * @returns DashboardConfig for the role, defaults to client config
 */
export function getDashboardConfig(role: string): DashboardConfig {
  return dashboardConfigs[role.toLowerCase()] ?? dashboardConfigs['client']!;
}

/**
 * Returns the sidebar navigation links for a given user role.
 *
 * @param role - The user role string
 * @returns Array of SidebarLink items
 */
export function getNavigationForRole(role: string): SidebarLink[] {
  const config = getDashboardConfig(role);
  return config.navigation;
}

/**
 * Returns the default dashboard path for a given user role.
 *
 * @param role - The user role string
 * @returns Default dashboard URL path
 */
export function getDefaultDashboardPath(role: string): string {
  const config = getDashboardConfig(role);
  return config.defaultPath;
}

/**
 * Flattens the navigation tree into a single-level array.
 * Useful for route matching and breadcrumb generation.
 *
 * @param links - Nested SidebarLink array
 * @returns Flattened array of all links (including children)
 */
export function flattenNavigation(links: SidebarLink[]): SidebarLink[] {
  const result: SidebarLink[] = [];

  for (const link of links) {
    result.push(link);
    if (link.children) {
      result.push(...flattenNavigation(link.children));
    }
  }

  return result;
}

/**
 * Finds a navigation item by its href path.
 *
 * @param links - Navigation links to search
 * @param href - The href to find
 * @returns The matching SidebarLink or undefined
 */
export function findNavigationItem(
  links: SidebarLink[],
  href: string,
): SidebarLink | undefined {
  return flattenNavigation(links).find((link) => link.href === href);
}

/**
 * Generates breadcrumbs for a given path based on the navigation tree.
 *
 * @param links - Navigation links for the role
 * @param currentPath - The current URL path
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(
  links: SidebarLink[],
  currentPath: string,
): { label: string; href: string }[] {
  const breadcrumbs: { label: string; href: string }[] = [];
  const segments = currentPath.split('/').filter(Boolean);

  let builtPath = '';
  for (const segment of segments) {
    builtPath += `/${segment}`;
    const match = flattenNavigation(links).find(
      (link) => link.href === builtPath,
    );
    if (match) {
      breadcrumbs.push({ label: match.title, href: match.href });
    }
  }

  return breadcrumbs;
}

/**
 * Returns the total badge count across all navigation items (non-recursive top-level only).
 * Useful for showing a total unread/pending count in the UI.
 *
 * @param links - Navigation links
 * @returns Total badge count
 */
export function getTotalBadgeCount(links: SidebarLink[]): number {
  return links.reduce((total, link) => {
    const count = typeof link.badge === 'number' ? link.badge : 0;
    return total + count;
  }, 0);
}
