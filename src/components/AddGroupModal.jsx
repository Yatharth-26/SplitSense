// src/components/AddGroupModal.jsx
import { useState } from "react";

const EMOJIS = ["🏖️", "🏠", "🎓", "🎉", "🍕", "✈️", "🛒"];

export default function AddGroupModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState(["Yatharth"]);
  const [error, setError] = useState("");

  function addMember() {
    const newMember = memberInput.trim();

    if (!newMember) return;
    if (members.includes(newMember)) {
      setError("Member already added.");
      return;
    }

    setMembers([...members, newMember]);
    setMemberInput("");
    setError("");
  }

  function removeMember(member) {
    if (member === "Yatharth") return;
    setMembers(members.filter((name) => name !== member));
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      addMember();
    }
  }

  function handleSubmit() {
    if (!name.trim()) return setError("Please enter group name.");
    if (members.length < 2) return setError("Add at least one more member.");

    onAdd({
      name: name.trim(),
      emoji,
      members,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Group</h2>
          <button className="btn btn-ghost btn-small" onClick={onClose}>×</button>
        </div>

        <div className="input-group">
          <label>Group Emoji</label>
          <div className="emoji-row">
            {EMOJIS.map((item) => (
              <button
                key={item}
                className={`emoji-btn ${emoji === item ? "selected" : ""}`}
                onClick={() => setEmoji(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Group Name</label>
          <input
            type="text"
            placeholder="Goa Trip"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Add Members</label>
          <div className="form-row">
            <input
              type="text"
              placeholder="Member name"
              value={memberInput}
              onChange={(event) => setMemberInput(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn" onClick={addMember}>Add</button>
          </div>
        </div>

        <div className="chip-row">
          {members.map((member) => (
            <span className="member-chip" key={member}>
              {member === "Yatharth" && <small className="blue">you</small>}
              {member}
              {member !== "Yatharth" && (
                <button className="delete-btn" onClick={() => removeMember(member)}>×</button>
              )}
            </span>
          ))}
        </div>

        <div className="preview-box">
          {emoji} <strong>{name || "Group Name"}</strong> · {members.length} members
        </div>

        {error && <p className="error">{error}</p>}

        <div className="button-row">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Create Group</button>
        </div>
      </div>
    </div>
  );
}
