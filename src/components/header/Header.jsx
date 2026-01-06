import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";

export default function Header() {
  const [isHistoyMenuOpen, setIsHistoryMenuOpen] = useState(false);

  const currentChatId = useSelector(
    (state) => state.chat.currentChatId
  );

  const navigate = useNavigate();

  const handleNavigateToChat = async () => {
    if (!currentChatId) {
      console.warn("No active chat yet");
      return;
    }

    navigate(`/chat/${currentChatId}`);
  }

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
          {/* navlink navigates instantly, button replaces it to navigate after chat creation fulfills */}
          <button className="nav-link" onClick={handleNavigateToChat}>
            Assistant
          </button>
          <NavLink to="/files" className="nav-link">
            Files
          </NavLink>
          <NavLink to="/test" className="nav-link">
            Test
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
