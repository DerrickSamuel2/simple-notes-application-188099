/**
 * PUBLIC_INTERFACE
 * Returns a debounced version of fn. Safe for SSR by avoiding direct window references.
 */
export function debounce(fn, delay = 300) {
  // Use globalThis to support both browser and Node/SSR environments
  const g = typeof globalThis !== 'undefined' ? globalThis : {};
  let timer = null;

  return (...args) => {
    // In SSR there is no timer API; no-op the debounce wrapper
    if (typeof g.clearTimeout !== 'function' || typeof g.setTimeout !== 'function') {
      return fn(...args);
    }
    try {
      g.clearTimeout(timer);
    } catch {
      // ignore clearing errors
    }
    timer = g.setTimeout(() => {
      try {
        fn(...args);
      } catch {
        // swallow to keep debounce robust
      }
    }, delay);
  };
}
