'use client';
import React from 'react';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

// PUBLIC_INTERFACE
export default function NoteCard({ note, onEdit, onDelete }) {
  const snippet = (note.content || '').trim().slice(0, 220);
  const hasMore = (note.content || '').trim().length > 220;
  return (
    <article className="card" aria-label={`Note ${note.title || 'Untitled'}`}>
      <div className="card-title">{note.title || 'Untitled'}</div>
      <div className="card-content">
        {snippet}
        {hasMore ? '…' : ''}
      </div>
      <div className="tags" aria-label="Tags">
        {(note.tags || []).map((t) => (
          <span className="tag" key={t}>{t}</span>
        ))}
      </div>
      <div className="card-meta" aria-label="Last updated">
        Updated {formatDate(note.updatedAt)}
      </div>
      <div className="card-actions">
        <button className="btn" onClick={() => onEdit(note)} aria-label={`Edit note ${note.title || 'Untitled'}`}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(note)} aria-label={`Delete note ${note.title || 'Untitled'}`}>
          Delete
        </button>
      </div>
    </article>
  );
}
