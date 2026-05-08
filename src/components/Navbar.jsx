// src/components/Navbar.jsx
import { useState } from "react";

export default function Navbar({
  activeTab,
  setActiveTab,
  groups,
  openGroup,
  onAddGroup,
  onAddExpense,
  theme,
  onToggleTheme,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "shame", label: "Shame Wall" },
  ];

  function goToTab(tabId) {
    setActiveTab(tabId);
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <button className="brand" onClick={() => goToTab("dashboard")}>
          <span className="brand-mark">₹</span>
          <span>SplitSense</span>
        </button>

        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`btn btn-ghost ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => goToTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}

          <div className="nav-menu">
            <button
              className={`btn btn-ghost ${activeTab === "group" ? "active" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              Groups
            </button>

            {menuOpen && (
              <div className="dropdown">
                {groups.map((group) => (
                  <button
                    className="dropdown-item"
                    key={group.id}
                    onClick={() => {
                      openGroup(group.id);
                      setMenuOpen(false);
                    }}
                  >
                    {group.emoji} {group.name}
                  </button>
                ))}

                <hr className="dropdown-line" />

                <button
                  className="dropdown-item blue"
                  onClick={() => {
                    onAddGroup();
                    setMenuOpen(false);
                  }}
                >
                  New Group
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="nav-actions">
          <button className="btn" onClick={onToggleTheme}>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="btn" onClick={onAddGroup}>+ Group</button>
          <button className="btn btn-primary" onClick={onAddExpense}>+ Expense</button>
        </div>
      </div>

      {menuOpen && <div className="click-layer" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}
