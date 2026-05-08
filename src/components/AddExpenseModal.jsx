// src/components/AddExpenseModal.jsx
import { useEffect, useState } from "react";

const CATEGORIES = [
  "Food",
  "Transport",
  "Stay",
  "Activity",
  "Groceries",
  "Entertainment",
  "Utilities",
  "Other",
];

export default function AddExpenseModal({ groups, defaultGroupId, onAdd, onClose }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [groupId, setGroupId] = useState(defaultGroupId || groups[0]?.id || "");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState([]);
  const [category, setCategory] = useState("Food");
  const [error, setError] = useState("");

  const currentGroup = groups.find((group) => group.id === groupId);

  useEffect(() => {
    if (currentGroup) {
      setPaidBy(currentGroup.members[0] || "");
      setSplitAmong([...currentGroup.members]);
    }
  }, [groupId]);

  function toggleMember(member) {
    if (splitAmong.includes(member)) {
      setSplitAmong(splitAmong.filter((name) => name !== member));
    } else {
      setSplitAmong([...splitAmong, member]);
    }
  }

  function toggleAll() {
    if (!currentGroup) return;

    if (splitAmong.length === currentGroup.members.length) {
      setSplitAmong([]);
    } else {
      setSplitAmong([...currentGroup.members]);
    }
  }

  function handleSubmit() {
    if (!description.trim()) return setError("Please enter a description.");
    if (!amount || Number(amount) <= 0) return setError("Please enter a valid amount.");
    if (!groupId) return setError("Please select a group.");
    if (!paidBy) return setError("Please select who paid.");
    if (splitAmong.length === 0) return setError("Select at least one member.");

    onAdd({
      groupId,
      description: description.trim(),
      amount: Number(amount),
      paidBy,
      splitAmong,
      category,
    });
  }

  const perPerson = splitAmong.length > 0 && amount
    ? Number(amount) / splitAmong.length
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Expense</h2>
          <button className="btn btn-ghost btn-small" onClick={onClose}>×</button>
        </div>

        <div className="input-group">
          <label>Group</label>
          <select value={groupId} onChange={(event) => setGroupId(event.target.value)}>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.emoji} {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="Dinner"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Amount</label>
          <input
            type="number"
            placeholder="0"
            min="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Category</label>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Paid by</label>
          <select value={paidBy} onChange={(event) => setPaidBy(event.target.value)}>
            {currentGroup?.members.map((member) => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Split among</label>
          <button className="btn btn-small" onClick={toggleAll}>
            {splitAmong.length === currentGroup?.members.length ? "Deselect all" : "Select all"}
          </button>
          <div className="checkbox-group">
            {currentGroup?.members.map((member) => (
              <button
                key={member}
                className={`checkbox-chip ${splitAmong.includes(member) ? "selected" : ""}`}
                onClick={() => toggleMember(member)}
              >
                {member}
              </button>
            ))}
          </div>
        </div>

        {perPerson > 0 && (
          <div className="preview-box">
            Each person pays <strong className="yellow">₹{perPerson.toFixed(0)}</strong>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <div className="button-row">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Add Expense</button>
        </div>
      </div>
    </div>
  );
}
