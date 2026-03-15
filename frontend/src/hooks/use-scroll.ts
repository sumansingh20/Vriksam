// =============================================================================
// VRIKSHAM - Scroll Utility Hooks
// =============================================================================
// Hooks for tracking scroll position, direction, and element visibility.
// =============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';

// -----------------------------------------------------------------------------
// useScrollPosition
// -----------------------------------------------------------------------------

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Track the current scroll position of the window.
 */
export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setPosition({
            x: window.scrollX,
            y: window.scrollY,
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    // Set initial position
    setPosition({ x: window.scrollX, y: window.scrollY });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return position;
}

// -----------------------------------------------------------------------------
// useScrollDirection
// -----------------------------------------------------------------------------

type ScrollDirection = 'up' | 'down' | null;

/**
 * Track the current scroll direction (up or down).
 * Useful for showing/hiding sticky headers.
 *
 * @param threshold - Minimum scroll delta before direction is registered (default 10px)
 */
export function useScrollDirection(threshold = 10): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const lastScrollY = useRef(0);
  const lastDirection = useRef<ScrollDirection>(null);

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastScrollY.current;

          if (Math.abs(delta) >= threshold) {
            const newDirection: ScrollDirection = delta > 0 ? 'down' : 'up';
            if (newDirection !== lastDirection.current) {
              lastDirection.current = newDirection;
              setDirection(newDirection);
            }
          }

          lastScrollY.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    }

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return direction;
}

// -----------------------------------------------------------------------------
// useInView
// -----------------------------------------------------------------------------

interface UseInViewOptions {
  /** The root element for intersection. Defaults to the viewport. */
  root?: Element | null;
  /** Margin around the root (CSS-style, e.g. "0px 0px -100px 0px"). */
  rootMargin?: string;
  /** Visibility threshold (0-1). 0 = any pixel visible, 1 = fully visible. */
  threshold?: number | number[];
  /** If true, the observer disconnects after the first intersection. */
  triggerOnce?: boolean;
}

interface UseInViewReturn {
  ref: (node: Element | null) => void;
  inView: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Track whether an element is visible within the viewport.
 * Returns a callback ref to attach to the target element.
 */
export function useInView(options: UseInViewOptions = {}): UseInViewReturn {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
  } = options;

  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<Element | null>(null);
  const triggeredRef = useRef(false);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      // Cleanup previous observer
      cleanup();

      if (triggerOnce && triggeredRef.current) {
        return;
      }

      elementRef.current = node;

      if (!node || typeof IntersectionObserver === 'undefined') {
        return;
      }

      observerRef.current = new IntersectionObserver(
        ([observerEntry]) => {
          if (observerEntry) {
            const isIntersecting = observerEntry.isIntersecting;
            setInView(isIntersecting);
            setEntry(observerEntry);

            if (isIntersecting && triggerOnce) {
              triggeredRef.current = true;
              cleanup();
            }
          }
        },
        { root, rootMargin, threshold }
      );

      observerRef.current.observe(node);
    },
    [root, rootMargin, threshold, triggerOnce, cleanup]
  );

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { ref, inView, entry };
}
