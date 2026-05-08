// src/components/AddExpenseModal.jsx
import { useState, useEffect } from "react";

const CATEGORIES = ["Food", "Transport", "Stay", "Activity", "Groceries", "Entertainment", "Utilities", "Other"];

export default function AddExpenseModal({ groups, defaultGroupId, onAdd, onClose }) {
  // Controlled form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [groupId, setGroupId] = useState(defaultGroupId || (groups[0]?.id ?? ""));
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState([]);
  const [category, setCategory] = useState("Food");
  const [error, setError] = useState("");

  // When group changes, reset paidBy and splitAmong
  const currentGroup = groups.find((g) => g.id === groupId);

  useEffect(() => {
    if (currentGroup) {
      setPaidBy(currentGroup.members[0] || "");
      setSplitAmong([...currentGroup.members]);
    }
  }, [groupId]);

  // Toggle a member in splitAmong
  function toggleSplit(member) {
    setSplitAmong((prev) =>
      prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]
    );
  }

  // Select / deselect all
  function toggleAll() {
    if (splitAmong.length === currentGroup?.members.length) {
      setSplitAmong([]);
    } else {
      setSplitAmong([...currentGroup.members]);
    }
  }

  // Validate and submit
  function handleSubmit() {
    if (!description.trim()) return setError("Please enter a description.");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return setError("Enter a valid amount.");
    if (!groupId) return setError("Select a group.");
    if (!paidBy) return setError("Select who paid.");
    if (splitAmong.length === 0) return setError("Select at least one person to split with.");

    onAdd({
      groupId,
      description: description.trim(),
      amount: Number(amount),
      paidBy,
      splitAmong,
      category,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 20 }}>💸 Add Expense</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 18 }}>×</button>
        </div>

        {/* Group select */}
        <div className="input-group">
          <label>Group</label>
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="input-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="e.g. Dinner at Barbeque Nation"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div className="input-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />
        </div>

        {/* Category */}
        <div className="input-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Paid by */}
        <div className="input-group">
          <label>Paid by</label>
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            {currentGroup?.members.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Split among */}
        <div className="input-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ margin: 0 }}>Split among</label>
            <button
              className="btn btn-ghost"
              style={{ fontSize: 11, padding: "2px 8px" }}
              onClick={toggleAll}
            >
              {splitAmong.length === currentGroup?.members.length ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="checkbox-group" style={{ marginTop: 6 }}>
            {currentGroup?.members.map((m) => (
              <span
                key={m}
                className={`checkbox-chip ${splitAmong.includes(m) ? "selected" : ""}`}
                onClick={() => toggleSplit(m)}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Per person preview */}
        {splitAmong.length > 0 && amount && (
          <div style={{
            background: "var(--bg3)", borderRadius: "var(--radius-sm)",
            padding: "10px 14px", fontSize: 13, color: "var(--text2)",
            marginBottom: 16,
          }}>
            Each person pays:{" "}
            <b style={{ color: "var(--yellow)" }}>
              ₹{(Number(amount) / splitAmong.length).toFixed(0)}
            </b>
            {" "}({splitAmong.length} people)
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ color: "var(--red)", fontSize: 13, marginBottom: 12 }}>
            ⚠ {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Expense 💸</button>
        </div>
      </div>
    </div>
  );
}
