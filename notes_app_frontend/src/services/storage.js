const NAMESPACE = 'NOTES_V1';

/**
 * INTERNAL: Safe accessors for localStorage in both browser and SSR.
 */
function getLS() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function getItemJSON(key, fallback = null) {
  /** Get a namespaced item from localStorage and parse JSON safely. */
  const ls = getLS();
  if (!ls) return fallback;
  try {
    const raw = ls.getItem(`${NAMESPACE}:${key}`);
    if (typeof raw !== 'string' || raw.length === 0) return fallback;
    // Only parse valid JSON strings
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function setItemJSON(key, value) {
  /** Set a namespaced JSON item into localStorage, safely stringified. */
  const ls = getLS();
  if (!ls) return false;
  try {
    const raw = JSON.stringify(value);
    ls.setItem(`${NAMESPACE}:${key}`, raw);
    return true;
  } catch {
    return false;
  }
}

// PUBLIC_INTERFACE
export function removeItem(key) {
  /** Remove a namespaced item from localStorage. */
  const ls = getLS();
  if (!ls) return false;
  try {
    ls.removeItem(`${NAMESPACE}:${key}`);
    return true;
  } catch {
    return false;
  }
}
