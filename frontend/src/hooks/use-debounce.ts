// =============================================================================
// VRIKSHAM - Debounce Hook
// =============================================================================
// Debounces a rapidly-changing value (e.g. search input) so that downstream
// effects (API calls, filters) only fire after the user stops typing.
// =============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';

// -----------------------------------------------------------------------------
// useDebounce (value-based)
// -----------------------------------------------------------------------------

/**
 * Returns a debounced version of the provided value.
 * The debounced value only updates after the specified delay
 * has elapsed since the last change.
 *
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default 300ms)
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 500);
 *
 * // Use debouncedSearch in your query
 * const { data } = usePlants({ search: debouncedSearch });
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// -----------------------------------------------------------------------------
// useDebouncedCallback (function-based)
// -----------------------------------------------------------------------------

/**
 * Returns a debounced version of the provided callback function.
 * The callback only executes after the specified delay has elapsed
 * since its last invocation.
 *
 * @param callback - The function to debounce
 * @param delay - Debounce delay in milliseconds (default 300ms)
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query);
 * }, 500);
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = 300
): (...args: Args) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref up-to-date without resetting the timer
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedFn = useCallback(
    (...args: Args) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timerRef.current = null;
      }, delay);
    },
    [delay]
  );

  return debouncedFn;
}

export default useDebounce;
