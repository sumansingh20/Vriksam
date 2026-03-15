// =============================================================================
// VRIKSHAM Frontend - Site Configuration
// Central configuration for site metadata, navigation, and links
// =============================================================================

import type { NavItem } from '../types';

// -----------------------------------------------------------------------------
// Site Metadata
// -----------------------------------------------------------------------------

export const siteConfig = {
  name: 'VRIKSHAM',
  fullName: 'VRIKSHAM Green Solutions',
  description:
    'India\'s leading green infrastructure SaaS platform. We help businesses nurture indoor and outdoor plant ecosystems, track environmental impact, and achieve ESG goals through technology-driven plant care management.',
  tagline: 'Nurturing Nature, Enriching Spaces',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://vriksham.com',
  appUrl: process.env.NEXT_PUBLIC_DASHBOARD_URL ?? 'https://app.vriksham.com',
  ogImage: '/images/og-image.png',
  favicon: '/favicon.ico',
  keywords: [
    'green infrastructure',
    'plant management',
    'ESG reporting',
    'indoor plants',
    'corporate greenery',
    'plant health monitoring',
    'sustainability',
    'carbon offset',
    'oxygen production',
    'workplace wellness',
  ],
  author: {
    name: 'VRIKSHAM Green Solutions Pvt. Ltd.',
    url: 'https://vriksham.com',
    email: 'hello@vriksham.com',
  },
  support: {
    email: 'support@vriksham.com',
    phone: '+91-9876543210',
    hours: 'Mon-Sat, 9:00 AM - 6:00 PM IST',
  },
  social: {
    twitter: 'https://twitter.com/vriksham',
    linkedin: 'https://linkedin.com/company/vriksham',
    instagram: 'https://instagram.com/vriksham.green',
    facebook: 'https://facebook.com/vriksham',
    youtube: 'https://youtube.com/@vriksham',
  },
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID ?? '',
    mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '',
  },
} as const;

// -----------------------------------------------------------------------------
// Main Navigation Links (Marketing Site)
// -----------------------------------------------------------------------------

export const navLinks: NavItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Solutions',
    href: '/solutions',
    children: [
      {
        title: 'Corporate Offices',
        href: '/solutions/corporate',
        description: 'Transform your workspace with curated indoor greenery and data-driven plant care.',
        icon: 'Building2',
      },
      {
        title: 'Residential Complexes',
        href: '/solutions/residential',
        description: 'Bring nature into homes with managed landscaping and balcony gardens.',
        icon: 'Home',
      },
      {
        title: 'Commercial Spaces',
        href: '/solutions/commercial',
        description: 'Create inviting green environments for malls, hotels, and retail spaces.',
        icon: 'Store',
      },
      {
        title: 'IT Parks & Campuses',
        href: '/solutions/campuses',
        description: 'Large-scale green infrastructure management for tech parks and educational campuses.',
        icon: 'GraduationCap',
      },
    ],
  },
  {
    title: 'Services',
    href: '/services',
    children: [
      {
        title: 'Plant Installation',
        href: '/services/installation',
        description: 'Expert selection and installation of plants tailored to your space.',
        icon: 'Sprout',
      },
      {
        title: 'Maintenance & Care',
        href: '/services/maintenance',
        description: 'Regular professional care including watering, pruning, and health monitoring.',
        icon: 'HeartPulse',
      },
      {
        title: 'ESG Reporting',
        href: '/services/esg-reporting',
        description: 'Automated ESG impact tracking with CO2 absorption and oxygen production metrics.',
        icon: 'BarChart3',
      },
      {
        title: 'Plant Health AI',
        href: '/services/plant-ai',
        description: 'AI-powered plant health diagnostics and predictive care recommendations.',
        icon: 'Brain',
      },
    ],
  },
  {
    title: 'Pricing',
    href: '/pricing',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
];

// -----------------------------------------------------------------------------
// Footer Links
// -----------------------------------------------------------------------------

export const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { title: 'Features', href: '/features' },
      { title: 'Pricing', href: '/pricing' },
      { title: 'ESG Dashboard', href: '/features/esg-dashboard' },
      { title: 'Plant Health AI', href: '/features/plant-ai' },
      { title: 'Mobile App', href: '/mobile' },
      { title: 'API Docs', href: '/docs/api', external: true },
    ],
  },
  solutions: {
    title: 'Solutions',
    links: [
      { title: 'Corporate Offices', href: '/solutions/corporate' },
      { title: 'Residential', href: '/solutions/residential' },
      { title: 'Commercial Spaces', href: '/solutions/commercial' },
      { title: 'IT Parks & Campuses', href: '/solutions/campuses' },
      { title: 'Healthcare', href: '/solutions/healthcare' },
      { title: 'Hospitality', href: '/solutions/hospitality' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { title: 'About Us', href: '/about' },
      { title: 'Our Team', href: '/about/team' },
      { title: 'Careers', href: '/careers' },
      { title: 'Blog', href: '/blog' },
      { title: 'Press Kit', href: '/press' },
      { title: 'Contact', href: '/contact' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Cookie Policy', href: '/cookies' },
      { title: 'Refund Policy', href: '/refund-policy' },
      { title: 'SLA', href: '/sla' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { title: 'Help Center', href: '/help' },
      { title: 'Plant Care Guides', href: '/guides' },
      { title: 'ESG Knowledge Base', href: '/knowledge/esg' },
      { title: 'Case Studies', href: '/case-studies' },
      { title: 'Webinars', href: '/webinars' },
      { title: 'Partner Program', href: '/partners' },
    ],
  },
} as const;

// -----------------------------------------------------------------------------
// Social Links (Structured for components)
// -----------------------------------------------------------------------------

export const socialLinks = [
  {
    name: 'Twitter',
    href: siteConfig.social.twitter,
    icon: 'Twitter',
    ariaLabel: 'Follow VRIKSHAM on Twitter',
  },
  {
    name: 'LinkedIn',
    href: siteConfig.social.linkedin,
    icon: 'Linkedin',
    ariaLabel: 'Follow VRIKSHAM on LinkedIn',
  },
  {
    name: 'Instagram',
    href: siteConfig.social.instagram,
    icon: 'Instagram',
    ariaLabel: 'Follow VRIKSHAM on Instagram',
  },
  {
    name: 'Facebook',
    href: siteConfig.social.facebook,
    icon: 'Facebook',
    ariaLabel: 'Follow VRIKSHAM on Facebook',
  },
  {
    name: 'YouTube',
    href: siteConfig.social.youtube,
    icon: 'Youtube',
    ariaLabel: 'Subscribe to VRIKSHAM on YouTube',
  },
] as const;

// -----------------------------------------------------------------------------
// Call-to-Action Configuration
// -----------------------------------------------------------------------------

export const ctaConfig = {
  primary: {
    label: 'Get Started Free',
    href: '/register',
  },
  secondary: {
    label: 'Book a Demo',
    href: '/contact?type=demo',
  },
  login: {
    label: 'Sign In',
    href: '/login',
  },
} as const;

// -----------------------------------------------------------------------------
// SEO Defaults
// -----------------------------------------------------------------------------

export const seoDefaults = {
  titleTemplate: '%s | VRIKSHAM - Green Infrastructure Platform',
  defaultTitle: 'VRIKSHAM - India\'s Leading Green Infrastructure SaaS Platform',
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'VRIKSHAM - Nurturing Nature, Enriching Spaces',
      },
    ],
  },
  twitter: {
    handle: '@vriksham',
    site: '@vriksham',
    cardType: 'summary_large_image',
  },
} as const;
