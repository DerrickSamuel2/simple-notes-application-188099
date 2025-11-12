'use client';
import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditor({ isOpen, note, onClose, onSave }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState((note?.tags || []).join(', '));
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(note?.title || '');
      setContent(note?.content || '');
      setTags((note?.tags || []).join(', '));
      setError('');
      setTimeout(() => {
        titleRef.current?.focus();
      }, 0);
    }
  }, [isOpen, note]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      titleRef.current?.focus();
      return;
    }
    const payload = {
      id: note?.id || null,
      title: title.trim(),
      content: content,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSave(payload);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="editor-title">
      <div className="modal">
        <div className="modal-header">
          <h2 id="editor-title">{note?.id ? 'Edit Note' : 'New Note'}</h2>
          <button className="btn" onClick={onClose} aria-label="Close editor">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label" htmlFor="title">Title</label>
            <input
              id="title"
              className="input"
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-invalid={!!error}
              aria-describedby={error ? 'title-error' : undefined}
            />
            {error ? <div id="title-error" className="error">{error}</div> : null}
          </div>

          <div className="form-group">
            <label className="label" htmlFor="content">Content</label>
            <textarea
              id="content"
              className="input textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="tags">Tags (comma separated)</label>
            <input
              id="tags"
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <div className="helper">Example: work, personal, ideas</div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button type="button" className="btn" onClick={onClose} aria-label="Cancel editing">Cancel</button>
            <button type="submit" className="btn btn-primary" aria-label="Save note">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
