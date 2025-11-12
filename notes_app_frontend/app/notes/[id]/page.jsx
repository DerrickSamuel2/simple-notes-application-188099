'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as notesApi from '../../../src/services/notesApi';
import ConfirmDialog from '../../components/ConfirmDialog';
import NoteEditor from '../../components/NoteEditor';

// PUBLIC_INTERFACE
export default function NoteDetailPage({ params }) {
  /**
   * Note detail and editor page. Fetches by ID from local storage and allows edit/delete.
   */
  const { id } = params;
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const n = await notesApi.getNote(id);
      setNote(n);
      setLoading(false);
    })();
  }, [id]);

  const onSave = async (payload) => {
    if (!payload.id) return;
    const updated = await notesApi.updateNote(payload.id, payload);
    setNote(updated);
    setEditOpen(false);
  };

  const onDelete = async () => {
    await notesApi.deleteNote(id);
    window.location.href = '/';
  };

  if (loading) {
    return <main className="container"><div className="empty">Loading...</div></main>;
  }

  if (!note) {
    return (
      <main className="container">
        <div className="empty">Note not found.</div>
        <Link className="btn" href="/">Back to notes</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-title" style={{ fontSize: '1.2rem' }}>{note.title || 'Untitled'}</div>
        <div className="card-content" style={{ maxHeight: 'none' }}>{note.content || ''}</div>
        <div className="tags" aria-label="Tags" style={{ marginTop: 8 }}>
          {(note.tags || []).map((t) => <span className="tag" key={t}>{t}</span>)}
        </div>
        <div className="card-actions" style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => setEditOpen(true)}>Edit</button>
          <button className="btn btn-danger" onClick={() => setConfirmOpen(true)}>Delete</button>
          <Link className="btn" href="/">Back</Link>
        </div>
      </div>

      <NoteEditor
        isOpen={editOpen}
        note={note}
        onClose={() => setEditOpen(false)}
        onSave={onSave}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete note?"
        message={`Are you sure you want to delete "${note.title || 'Untitled'}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onDelete}
      />
    </main>
  );
}
