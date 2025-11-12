import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from '../utils/debounce';

// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange, totalCount, filteredCount }) {
  const [input, setInput] = useState(value || '');

  useEffect(() => {
    setInput(value || '');
  }, [value]);

  const debounced = useMemo(() => debounce(onChange, 250), [onChange]);

  const onInputChange = (e) => {
    const v = e.target.value;
    setInput(v);
    debounced(v);
  };

  return (
    <div className="searchbar" role="search">
      <input
        type="search"
        className="input"
        placeholder="Search notes by title, content, or tags..."
        value={input}
        onChange={onInputChange}
        aria-label="Search notes"
      />
      <button
        className="btn"
        onClick={() => {
          setInput('');
          onChange('');
        }}
        aria-label="Clear search"
      >
        Clear
      </button>
      <div aria-live="polite" style={{ gridColumn: '1 / -1', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
        {typeof filteredCount === 'number' && typeof totalCount === 'number'
          ? `Showing ${filteredCount} of ${totalCount}`
          : null}
      </div>
    </div>
  );
}
