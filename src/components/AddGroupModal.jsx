// src/components/AddGroupModal.jsx
import { useState } from "react";

const EMOJIS = ["🏖️", "🏠", "🎓", "🚀", "🎉", "🍕", "✈️", "🏔️", "🎮", "💼", "🎸", "🌍", "🏕️", "🛒", "🎯"];

export default function AddGroupModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState(["Yatharth"]); // current user always added
  const [error, setError] = useState("");

  // Add a member from input
  function addMember() {
    const trimmed = memberInput.trim();
    if (!trimmed) return;
    if (members.includes(trimmed)) return setError("Member already added.");
    setMembers((prev) => [...prev, trimmed]);
    setMemberInput("");
    setError("");
  }

  // Remove a member (except current user)
  function removeMember(m) {
    if (m === "Yatharth") return; // can't remove yourself
    setMembers((prev) => prev.filter((x) => x !== m));
  }

  // Handle Enter key in member input
  function handleKeyDown(e) {
    if (e.key === "Enter") addMember();
  }

  // Submit
  function handleSubmit() {
    if (!name.trim()) return setError("Please enter a group name.");
    if (members.length < 2) return setError("Add at least one other member.");

    onAdd({ name: name.trim(), emoji, members });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 20 }}>🧑‍🤝‍🧑 Create Group</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 18 }}>×</button>
        </div>

        {/* Emoji picker */}
        <div className="input-group">
          <label>Group Emoji</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  fontSize: 22, background: emoji === e ? "rgba(255,107,107,0.15)" : "var(--bg3)",
                  border: emoji === e ? "2px solid var(--accent)" : "1px solid var(--border)",
                  borderRadius: 10, width: 44, height: 44, cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Group name */}
        <div className="input-group">
          <label>Group Name</label>
          <input
            type="text"
            placeholder="e.g. Goa Trip, PG Flatmates..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Members */}
        <div className="input-group">
          <label>Add Members</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Type name and press Enter..."
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ flex: 1 }}
            />
            <button className="btn btn-secondary" onClick={addMember} style={{ flexShrink: 0, padding: "10px 14px" }}>
              Add
            </button>
          </div>
        </div>

        {/* Member chips */}
        {members.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {members.map((m) => (
              <div
                key={m}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", background: "var(--bg3)",
                  border: "1px solid var(--border)", borderRadius: 100,
                  fontSize: 13,
                }}
              >
                {m === "Yatharth" && <span style={{ fontSize: 11, color: "var(--accent)" }}>you</span>}
                {m}
                {m !== "Yatharth" && (
                  <button
                    onClick={() => removeMember(m)}
                    style={{
                      background: "none", border: "none", color: "var(--text3)",
                      cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ color: "var(--red)", fontSize: 13, marginBottom: 12 }}>
            ⚠ {error}
          </div>
        )}

        {/* Preview */}
        <div style={{
          background: "var(--bg3)", borderRadius: "var(--radius-sm)",
          padding: "10px 14px", fontSize: 13, color: "var(--text2)", marginBottom: 16,
        }}>
          {emoji} <b style={{ color: "var(--text)" }}>{name || "Group Name"}</b> · {members.length} members
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Create Group 🎉</button>
        </div>
      </div>
    </div>
  );
}
