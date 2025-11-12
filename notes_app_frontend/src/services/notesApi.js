/**
 * Notes API abstraction.
 * Currently uses localStorage for persistence.
 * For future backend:
 *  - Prefer using REACT_APP_API_BASE or REACT_APP_BACKEND_URL if present
 *  - Keep this module API-compatible.
 */
import { getItemJSON, setItemJSON } from './storage';

const STORAGE_KEY = 'NOTES_COLLECTION';
const ENABLE_DELAY = false; // set true to simulate latency for realism
const DELAY_MS = 100;

function delayIfEnabled() {
  if (!ENABLE_DELAY) return Promise.resolve();
  return new Promise((res) => setTimeout(res, DELAY_MS));
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowISO() {
  return new Date().toISOString();
}

function readAll() {
  const list = getItemJSON(STORAGE_KEY, []);
  return Array.isArray(list) ? list : [];
}

function writeAll(list) {
  setItemJSON(STORAGE_KEY, list);
}

// PUBLIC_INTERFACE
export async function listNotes() {
  /** Return all notes sorted by updatedAt desc. */
  await delayIfEnabled();
  const list = readAll();
  return list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  /** Get a single note by id. */
  await delayIfEnabled();
  const list = readAll();
  return list.find((n) => n.id === id) || null;
}

// PUBLIC_INTERFACE
export async function createNote(payload) {
  /** Create a new note. payload: {title, content, tags[]} */
  await delayIfEnabled();
  const id = generateId();
  const note = {
    id,
    title: (payload.title || '').trim() || 'Untitled',
    content: payload.content || '',
    tags: Array.isArray(payload.tags)
      ? payload.tags
      : typeof payload.tags === 'string' && payload.tags.trim()
      ? payload.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    updatedAt: nowISO(),
  };
  const list = readAll();
  list.unshift(note);
  writeAll(list);
  return note;
}

// PUBLIC_INTERFACE
export async function updateNote(id, payload) {
  /** Update a note fields and refresh updatedAt. */
  await delayIfEnabled();
  const list = readAll();
  const idx = list.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error('Note not found');
  const updated = {
    ...list[idx],
    ...payload,
    title: (payload.title || '').trim() || 'Untitled',
    tags: Array.isArray(payload.tags)
      ? payload.tags
      : typeof payload.tags === 'string' && payload.tags.trim()
      ? payload.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    updatedAt: nowISO(),
  };
  list[idx] = updated;
  writeAll(list);
  return updated;
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Delete a note by id. */
  await delayIfEnabled();
  const list = readAll();
  const next = list.filter((n) => n.id !== id);
  writeAll(next);
  return { id };
}

// PUBLIC_INTERFACE
export async function searchNotes(query) {
  /** Search across title, content, and tags. */
  await delayIfEnabled();
  const q = (query || '').toLowerCase();
  if (!q) return listNotes();
  const list = readAll();
  return list.filter((n) => {
    return (
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q) ||
      (Array.isArray(n.tags) ? n.tags : []).some((t) => (t || '').toLowerCase().includes(q))
    );
  });
}
