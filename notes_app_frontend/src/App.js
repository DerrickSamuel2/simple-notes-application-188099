import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import ConfirmDialog from './components/ConfirmDialog';

// Services
import * as notesApi from './services/notesApi';

// PUBLIC_INTERFACE
function App() {
  /** App Theme */
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem('APP_THEME');
    return saved || 'light';
  });

  /** Notes state */
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  /** UI state */
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const noteToDeleteRef = useRef(null);

  // Persist and apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('APP_THEME', theme);
  }, [theme]);

  // Initial load and seed
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
      console.error('Save failed', e);
    }
  };

  return (
    <div className="app">
      <header className="header" role="banner">
        <div className="container header-inner">
          <div className="brand" aria-label="Application brand">
            <h1 className="brand-title" aria-label="Simple Notes title">Simple Notes</h1>
            <span className="brand-badge" aria-hidden="true">Ocean</span>
          </div>

          <button
            className="btn btn-ghost"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
          >
            <span className="icon" aria-hidden="true">
              {theme === 'light' ? '🌙' : '☀️'}
            </span>
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
          <button className="btn btn-primary" onClick={handleCreateNew} aria-label="Create new note">
            + New Note
          </button>
        </div>
      </header>

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
    </div>
  );
}

export default App;
