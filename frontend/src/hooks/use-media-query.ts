// =============================================================================
// VRIKSHAM - Media Query Hooks
// =============================================================================
// Responsive design hooks for matching CSS media queries and
// convenient breakpoint helpers.
// =============================================================================

import { useState, useEffect, useCallback } from 'react';

// -----------------------------------------------------------------------------
// Breakpoints (matching Tailwind CSS defaults)
// -----------------------------------------------------------------------------

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// -----------------------------------------------------------------------------
// useMediaQuery
// -----------------------------------------------------------------------------

/**
 * Subscribe to a CSS media query and return whether it currently matches.
 *
 * @param query - A valid CSS media query string, e.g. "(min-width: 768px)"
 * @returns `true` if the query matches, `false` otherwise. Returns `false` during SSR.
 *
 * @example
 * const isWide = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState<boolean>(getMatches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    // Set initial value (handles hydration mismatch)
    setMatches(mediaQueryList.matches);

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    // Modern API (addEventListener) with fallback (addListener)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
      return () => mediaQueryList.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(handleChange);
      return () => mediaQueryList.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

// -----------------------------------------------------------------------------
// Convenience Breakpoint Hooks
// -----------------------------------------------------------------------------

/**
 * Returns `true` when the viewport is narrower than the `md` breakpoint (768px).
 * Equivalent to Tailwind's `max-md:` prefix.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

/**
 * Returns `true` when the viewport is between `md` (768px) and `lg` (1024px).
 * Equivalent to Tailwind's `md:` up to `lg:`.
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
  );
}

/**
 * Returns `true` when the viewport is at or above the `lg` breakpoint (1024px).
 * Equivalent to Tailwind's `lg:` prefix.
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

/**
 * Returns `true` when the user prefers reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Returns `true` when the user prefers dark color scheme.
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}
