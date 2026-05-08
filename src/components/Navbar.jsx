// src/components/Navbar.jsx
import { useState } from "react";

// Navbar with tab navigation and quick actions
export default function Navbar({ activeTab, setActiveTab, onAddGroup, onAddExpense, groups, openGroup }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "⚡" },
    { id: "shame", label: "Shame Wall", icon: "🔥" },
  ];

  return (
    <nav style={{
      background: "var(--bg2)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        gap: 16,
      }}>
        {/* Logo */}
        <div
          onClick={() => setActiveTab("dashboard")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }}
        >
          <span style={{ fontSize: 22 }}>💸</span>
          <span style={{
            fontFamily: "var(--font-head)",
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg, #ff6b6b, #ffd93d)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            SplitSense
          </span>
        </div>

        {/* Tab buttons - desktop */}
        <div style={{ display: "flex", gap: 4, flex: 1, justifyContent: "center" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                padding: "7px 16px",
                fontSize: 13,
                background: activeTab === tab.id ? "rgba(255,107,107,0.15)" : "transparent",
                color: activeTab === tab.id ? "var(--accent)" : "var(--text2)",
                border: activeTab === tab.id ? "1px solid rgba(255,107,107,0.3)" : "1px solid transparent",
                borderRadius: "var(--radius-sm)",
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}

          {/* Groups dropdown */}
          <div style={{ position: "relative" }}>
            <button
              className="btn"
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                padding: "7px 16px",
                fontSize: 13,
                background: activeTab === "group" ? "rgba(255,107,107,0.15)" : "transparent",
                color: activeTab === "group" ? "var(--accent)" : "var(--text2)",
                border: activeTab === "group" ? "1px solid rgba(255,107,107,0.3)" : "1px solid transparent",
              }}
            >
              🧑‍🤝‍🧑 Groups ▾
            </button>
            {menuOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: 8,
                minWidth: 180,
                boxShadow: "var(--shadow)",
                zIndex: 200,
              }}>
                {groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { openGroup(g.id); setMenuOpen(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "9px 12px",
                      background: "none",
                      border: "none",
                      color: "var(--text)",
                      fontSize: 13,
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: 8,
                      fontFamily: "var(--font-body)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                  >
                    {g.emoji} {g.name}
                  </button>
                ))}
                <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "6px 0" }} />
                <button
                  onClick={() => { onAddGroup(); setMenuOpen(false); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "9px 12px",
                    background: "none",
                    border: "none",
                    color: "var(--accent)",
                    fontSize: 13,
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: 8,
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  + New Group
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button className="btn btn-secondary" onClick={onAddGroup} style={{ padding: "7px 14px", fontSize: 13 }}>
            + Group
          </button>
          <button className="btn btn-primary" onClick={onAddExpense} style={{ padding: "7px 14px", fontSize: 13 }}>
            + Expense
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      {menuOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 150 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}
