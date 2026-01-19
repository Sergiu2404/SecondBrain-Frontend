import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats } from "../../state/chat/chatSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentChatId = useSelector((state) => state.chat.currentChatId);

  const chatsList = useSelector((state) => state.chat.chatsList || []);

  const [isHistoyMenuOpen, setIsHistoryMenuOpen] = useState(false);

  const handleNavigateToChat = async () => {
    if (!currentChatId) {
      console.warn("No active chat yet");
      return;
    }

    navigate(`/chat/${currentChatId}`);
  };

  const toggleSideMenu = () => {
    if (!isHistoyMenuOpen) {
      dispatch(fetchChats());
    }
    setIsHistoryMenuOpen(!isHistoyMenuOpen);
  };

  const sortedChats = [...chatsList].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button className="menu-btn" onClick={toggleSideMenu}>
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
        <h3 className="chat-history-side-menu-headline">Chat history</h3>
        <ul className="history-chats-list">
          {sortedChats.map((chat) => (
            <NavLink
              key={chat.id}
              to={`/chat/${chat.id}`}
              className={({ isActive }) =>
                `history-chat-link ${isActive ? "active" : ""}`
              }
              onClick={() => setIsHistoryMenuOpen(false)}
            >
              {chat.title || `Chat ${chat.id.substring(0, 5)}`}
              <span className="chat-date">
                {new Date(chat.created_at).toLocaleDateString()}
              </span>
            </NavLink>
          ))}
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
