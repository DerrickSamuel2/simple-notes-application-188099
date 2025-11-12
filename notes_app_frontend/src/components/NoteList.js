import React from 'react';
import NoteCard from './NoteCard';

// PUBLIC_INTERFACE
export default function NoteList({ notes, onEdit, onDelete }) {
  return (
    <>
      {notes.map((note) => (
        <div key={note.id} className="card grid-col">
          <NoteCard note={note} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </>
  );
}
