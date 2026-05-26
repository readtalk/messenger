// src/App.tsx - settings.readtalk.workers.dev //
import { useState, useEffect } from "react";

import MenuDotsVertical from "./assets/menu-dots-vertical.svg";
import SearchIcon from "./assets/search.svg";
import EnvelopeIcon from "./assets/envelope.svg";
import UserAddIcon from "./assets/plus-small.svg";
import BubbleDiscussionIcon from "./assets/bubble-discussion.svg";
import CameraIcon from "./assets/at.svg";
import UsersIcon from "./assets/users.svg";
import PhoneCallIcon from "./assets/phone-call.svg";

import "./App.css";

function App() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // default light

  // Fetch user params from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("userId") || "");
    setEmail(params.get("email") || "");
  }, []);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('readtalk_theme') as 'light' | 'dark' | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('readtalk_theme', newTheme);
  };

  const handleLogout = () => {
    window.parent.postMessage({ type: "LOGOUT" }, "https://readtalk.pages.dev");
    setShowMenu(false);
  };

  return (
    <div className={`app-layout ${theme}`}>
      <header className="app-header">
        <div className="app-header-left">         
          <h1 className="app-header-title">READTalk</h1>
        </div>

        <div className="app-header-right">
          {userId && email && (
            <span className="app-user-info">
              {userId.slice(0, 8)}... | {email.split("@")[0]}
            </span>
          )}

          <button className="app-menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <img src={MenuDotsVertical} alt="Menu" />
          </button>

          {showMenu && (
            <div className="app-dropdown">
              <button className="app-mode-toggle" onClick={toggleTheme}>
                {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              </button>
              <button className="app-dropdown-item app-logout-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* SEARCH */}
      <div className="app-search-container">
        <div className="app-search-box">
          <img src={SearchIcon} alt="Search" className="app-search-icon" />
          <input
            type="text"
            placeholder="Search name or message..."
            className="app-search-input"
          />
        </div>
      </div>

      {/* MAIN + SIDEBAR */}
      <div className="app-main">
        <aside className="app-sidebar">
          <div className="app-empty">
            <img src={EnvelopeIcon} alt="Empty" className="app-empty-icon" />
            <p className="app-empty-text">No items to resend</p>
          </div>
        </aside>

        <main className="app-content">
          <p>Select an item from sidebar to view details</p>
        </main>
      </div>

      {/* BOTTOM NAV */}
      <nav className="app-bottom-nav">
        <button
          className={`app-bottom-tab ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          <img src={BubbleDiscussionIcon} alt="Chat" className="app-bottom-icon" />
          <span>Chat</span>
        </button>
        <button
          className={`app-bottom-tab ${activeTab === "updates" ? "active" : ""}`}
          onClick={() => setActiveTab("updates")}
        >
          <img src={CameraIcon} alt="Updates" className="app-bottom-icon" />
          <span>Updates</span>
        </button>
        <button
          className={`app-bottom-tab ${activeTab === "communities" ? "active" : ""}`}
          onClick={() => setActiveTab("communities")}
        >
          <img src={UsersIcon} alt="Communities" className="app-bottom-icon" />
          <span>Communities</span>
        </button>
        <button
          className={`app-bottom-tab ${activeTab === "calls" ? "active" : ""}`}
          onClick={() => setActiveTab("calls")}
        >
          <img src={PhoneCallIcon} alt="Calls" className="app-bottom-icon" />
          <span>Calls</span>
        </button>
      </nav>

      {/* FAB */}
      <button className="app-fab">
        <img src={UserAddIcon} alt="Add" />
      </button>
    </div>
  );
}

export default App;
