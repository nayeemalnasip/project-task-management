import React, { useState, useRef } from "react";
import { Sun, Moon, Search, Bell, User } from "lucide-react";
import "../styles/Header.css";

export default function Header() {
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);

  const clearSearch = () => {
    setSearchText("");
    inputRef.current.focus();
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <header className="header-container" role="banner">
      {/* Logo */}
      <div className="logo" tabIndex={0}>
        Task<span>Manager</span>
      </div>

      {/* Navigation */}
      <nav
        className={`nav ${menuOpen ? "open" : ""}`}
        role="navigation"
        aria-label="Primary navigation"
      >
        <button className="nav-button active" aria-current="page">
          Dashboard
        </button>
        <button className="nav-button">Projects</button>
        <button className="nav-button">Team</button>
        <button className="nav-button">Reports</button>
      </nav>

      {/* Search */}
      <div className={`search-wrapper ${searchText ? "active" : ""}`}>
        <Search size={18} className="search-icon" />
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

      {/* Actions */}
      <div className="header-actions">
        <button
          className="icon-btn"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        <button className="icon-btn avatar-btn" aria-label="User menu">
          <User size={18} />
        </button>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
