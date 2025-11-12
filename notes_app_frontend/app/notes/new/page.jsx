'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import NoteEditor from '../../components/NoteEditor';
import * as notesApi from '../../../src/services/notesApi';

// PUBLIC_INTERFACE
export default function NewNotePage() {
  /**
   * New note page ("/notes/new"): opens editor and saves a new note.
   */
  const [open, setOpen] = useState(true);

  const handleSave = async (payload) => {
    await notesApi.createNote(payload);
    window.location.href = '/';
  };

  useEffect(() => {
    // ensure dark/light theme attribute is honored from saved preference on this page load too
    const saved = window.localStorage.getItem('APP_THEME') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return (
    <main className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
        <h2>New Note</h2>
        <Link className="btn" href="/">Back</Link>
      </div>
      <NoteEditor
        isOpen={open}
        note={{ id: null, title: '', content: '', tags: [] }}
        onClose={() => { setOpen(false); window.location.href = '/'; }}
        onSave={handleSave}
      />
    </main>
  );
}
