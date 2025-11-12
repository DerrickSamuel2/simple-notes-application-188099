import React from 'react';

// PUBLIC_INTERFACE
export default function Header({ theme, onToggleTheme, onNew }) {
  /** App header: title, theme toggle, new note action. */
  return (
    <header className="header" role="banner">
      <div className="container header-inner">
        <div className="brand" aria-label="Application brand">
          <h1 className="brand-title">Simple Notes</h1>
          <span className="brand-badge" aria-hidden="true">Ocean</span>
        </div>
        <button
          className="btn btn-ghost"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="icon" aria-hidden="true">
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        <button className="btn btn-primary" onClick={onNew} aria-label="Create new note">
          + New Note
        </button>
      </div>
    </header>
  );
}
