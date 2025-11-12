const NAMESPACE = 'NOTES_V1';

// PUBLIC_INTERFACE
export function getItemJSON(key, fallback = null) {
  /** Get a namespaced item from localStorage and parse JSON safely. */
  try {
    const raw = window.localStorage.getItem(`${NAMESPACE}:${key}`);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function setItemJSON(key, value) {
  /** Set a namespaced JSON item into localStorage, safely stringified. */
  try {
    const raw = JSON.stringify(value);
    window.localStorage.setItem(`${NAMESPACE}:${key}`, raw);
    return true;
  } catch {
    return false;
  }
}

// PUBLIC_INTERFACE
export function removeItem(key) {
  /** Remove a namespaced item from localStorage. */
  try {
    window.localStorage.removeItem(`${NAMESPACE}:${key}`);
    return true;
  } catch {
    return false;
  }
}
