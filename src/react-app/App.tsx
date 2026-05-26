// src/App.tsx
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
  const [activeTab, setActiveTab] = useState("all");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("userId") || "");
    setEmail(params.get("email") || "");
  }, []);

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
      <div className="app-main">
        {/* SIDEBAR KIRI */}
        <aside className="app-sidebar">
          <header className="app-header">
            <h1 className="app-header-title">READTalk</h1>
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

          {/* TAB FILTER - mirip WA Web desktop */}
          <div className="app-sidebar-tabs">
            <button 
              className={`app-tab-btn ${activeTab === "all" ? "active" : ""}`} 
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button 
              className={`app-tab-btn ${activeTab === "unread" ? "active" : ""}`} 
              onClick={() => setActiveTab("unread")}
            >
              Unread
            </button>
            <button 
              className={`app-tab-btn ${activeTab === "groups" ? "active" : ""}`} 
              onClick={() => setActiveTab("groups")}
            >
              Groups
            </button>
          </div>

          {/* SEARCH */}
          <div className="app-search-container">
            <div className="app-search-box">
              <img src={SearchIcon} alt="Search" className="app-search-icon" />
              <input 
                type="text" 
                placeholder="Search or start new chat" 
                className="app-search-input" 
              />
            </div>
          </div>

          {/* CHAT LIST */}
          <div className="app-chat-list">
            {/* Kosong dulu, nanti isi mapping chat di sini */}
          </div>
        </aside>

        {/* CHATROOM KAN */}
        <main className="app-content">
          <div className="app-empty">
            <p className="app-empty-text">Select a chat to start messaging</p>
          </div>
        </main>
      </div>

      {/* BOTTOM NAV - cuma muncul di mobile */}
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

      {/* FAB - cuma muncul di mobile */}
      <button className="app-fab">
        <img src={UserAddIcon} alt="Add" />
      </button>
    </div>
  );
}

export default App;
