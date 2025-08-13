import React, { useState, useRef } from 'react';
import '../styles/Header.css';

export default function Header() {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);

  const clearSearch = () => {
    setSearchText('');
    inputRef.current.focus();
  };

  return (
    <header className="header-container" role="banner">
      {/* Logo */}
      <div className="logo" tabIndex={0}>
        TaskManager
      </div>

      {/* Navigation */}
      <nav className="nav" role="navigation" aria-label="Primary navigation">
        <button className="nav-button active" aria-current="page">
          Dashboard
        </button>
        <button className="nav-button">Projects</button>
        <button className="nav-button">Team</button>
        <button className="nav-button">Reports</button>
      </nav>

      {/* Search */}
      <div className={`search-wrapper ${searchText ? 'active' : ''}`}>
        <input
          type="search"
          placeholder="Search tasks, projects..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          ref={inputRef}
          className="search-input"
          aria-label="Search tasks"
          spellCheck="false"
          autoComplete="off"
        />
        {searchText && (
          <button
            className="clear-btn"
            onClick={clearSearch}
            aria-label="Clear search input"
            title="Clear"
          >
            &times;
          </button>
        )}
      </div>
    </header>
  );
}
