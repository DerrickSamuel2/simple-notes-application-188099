import React from 'react';

// PUBLIC_INTERFACE
export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal" role="document">
        <div className="modal-header">
          <h2 id="confirm-title">{title || 'Confirm'}</h2>
          <button className="btn" onClick={onCancel} aria-label="Close dialog">✕</button>
        </div>
        <div style={{ margin: '8px 0 16px' }}>{message}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onCancel} aria-label="Cancel delete">Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} aria-label="Confirm delete">Delete</button>
        </div>
      </div>
    </div>
  );
}
