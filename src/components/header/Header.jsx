import { NavLink } from "react-router-dom";
import "./Header.css";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

export default function Header() {
  const [isHistoyMenuOpen, setIsHistoryMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button
            className="menu-btn"
            onClick={() => setIsHistoryMenuOpen(true)}
          >
            <GiHamburgerMenu size={24} />
          </button>
        </div>

        <nav className="nav">
          <NavLink to="/chat" className="nav-link">
            Assistant
          </NavLink>
          <NavLink to="/files" className="nav-link">
            Files
          </NavLink>
        </nav>
      </div>

      <div className={`side-menu ${isHistoyMenuOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setIsHistoryMenuOpen(false)}
        >
          x
        </button>
        <h3>Chat history</h3>
        <ul>
          <li>Chat 1</li>
          <li>Chat 2</li>
          <li>Chat 3</li>
        </ul>
      </div>

      {isHistoyMenuOpen && (
        <div
          className="overlay"
          onClick={() => setIsHistoryMenuOpen(false)}
        ></div>
      )}
    </header>
  );
}
