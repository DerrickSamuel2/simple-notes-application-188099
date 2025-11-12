'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import './globals.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import ConfirmDialog from './components/ConfirmDialog';
import * as notesApi from '../src/services/notesApi';

// PUBLIC_INTERFACE
export default function HomePage() {
  /**
   * Notes list page ("/"): shows notes with search, creates via modal and allows edit/delete.
   * Uses localStorage-based services to persist data.
   */
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem('APP_THEME');
    return saved || 'light';
  });
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const noteToDeleteRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('APP_THEME', theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        let list = await notesApi.listNotes();
        if (list.length === 0) {
          const sample = await notesApi.createNote({
            title: 'Welcome to Simple Notes',
            content:
              'This is a sample note. Create, edit, delete and search your notes. Tags are comma-separated.',
            tags: ['welcome', 'tips'],
          });
          list = [sample];
        }
        if (mounted) setNotes(list);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed loading notes', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter((n) => {
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [notes, searchQuery]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleCreateNew = () => {
    setSelectedNote({
      id: null,
      title: '',
      content: '',
      tags: [],
    });
    setIsEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteRequest = (note) => {
    noteToDeleteRef.current = note;
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const note = noteToDeleteRef.current;
    if (!note) return;
    try {
      await notesApi.deleteNote(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Delete failed', e);
    } finally {
      setIsConfirmOpen(false);
      noteToDeleteRef.current = null;
    }
  };

  const handleSaveNote = async (payload) => {
    try {
      if (payload.id) {
        const updated = await notesApi.updateNote(payload.id, payload);
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      } else {
        const created = await notesApi.createNote(payload);
        setNotes((prev) => [created, ...prev]);
      }
      setIsEditorOpen(false);
      setSelectedNote(null);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Save failed', e);
    }
  };

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} onNew={handleCreateNew} />
      <main className="container" role="main">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          totalCount={notes.length}
          filteredCount={filteredNotes.length}
        />

        {loading ? (
          <div className="empty" role="status" aria-live="polite">Loading...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty" role="status" aria-live="polite">
            {notes.length === 0
              ? 'No notes yet. Create your first note!'
              : 'No results. Try a different search.'}
          </div>
        ) : (
          <div className="grid note-grid" aria-live="polite">
            <NoteList
              notes={filteredNotes}
              onEdit={handleEditNote}
              onDelete={handleDeleteRequest}
            />
          </div>
        )}
      </main>

      <footer className="footer" role="contentinfo">
        <div className="container">Made with Ocean Professional theme</div>
      </footer>

      <NoteEditor
        isOpen={isEditorOpen}
        note={selectedNote}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedNote(null);
        }}
        onSave={handleSaveNote}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete note?"
        message={
          noteToDeleteRef.current
            ? `Are you sure you want to delete "${noteToDeleteRef.current.title || 'Untitled'}"?`
            : ''
        }
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
