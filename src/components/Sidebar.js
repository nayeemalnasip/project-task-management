import React, { useState, useEffect } from "react";

export default function Sidebar({ active, onSelect }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: "🏠" },
    { label: "Projects", icon: "📁" },
    { label: "Teams", icon: "👥" },
    { label: "Calendar", icon: "📅" },
    { label: "Reports", icon: "📊" },
    { label: "Settings", icon: "⚙️" },
  ];

  const handleSelect = (label) => {
    if (onSelect) onSelect(label);
    setMobileMenuOpen(false);
  };

  if (!isMobile) return null; // Desktop এ Sidebar দেখাবে না

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-btn ${mobileMenuOpen ? "open" : ""}`}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
        onClick={() => setMobileMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Sidebar (only mobile) */}
      <aside
        className={`sidebar mobile-sidebar ${mobileMenuOpen ? "open" : ""}`}
        aria-label="Mobile primary navigation"
      >
        <nav className="sidebar-nav" role="navigation" aria-label="Main menu">
          <ul>
            {menuItems.map(({ label, icon }) => (
              <li
                key={label}
                className={active === label ? "active" : ""}
                onClick={() => handleSelect(label)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(label);
                  }
                }}
                role="menuitem"
                aria-current={active === label ? "page" : undefined}
                title={label}
              >
                <span className="icon" aria-hidden="true">
                  {icon}
                </span>
                <span className="label">{label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </>
  );
}
