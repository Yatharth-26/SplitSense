// src/App.jsx
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import GroupView from "./components/GroupView.jsx";
import ShameWall from "./components/ShameWall.jsx";
import AddExpenseModal from "./components/AddExpenseModal.jsx";
import AddGroupModal from "./components/AddGroupModal.jsx";
import { initialGroups, initialExpenses, initialSettlements } from "./data/demoData.js";

// Load from localStorage or use demo data
function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Core state
  const [groups, setGroups] = useState(() => loadState("ss_groups", initialGroups));
  const [expenses, setExpenses] = useState(() => loadState("ss_expenses", initialExpenses));
  const [settlements, setSettlements] = useState(() => loadState("ss_settlements", initialSettlements));

  // UI state
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | group | shame
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [toast, setToast] = useState(null);

  // Persist to localStorage whenever state changes
  useEffect(() => { localStorage.setItem("ss_groups", JSON.stringify(groups)); }, [groups]);
  useEffect(() => { localStorage.setItem("ss_expenses", JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem("ss_settlements", JSON.stringify(settlements)); }, [settlements]);

  // Show toast notification
  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Add a new group
  function addGroup(groupData) {
    const newGroup = {
      id: "g" + Date.now(),
      ...groupData,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setGroups((prev) => [...prev, newGroup]);
    showToast(`Group "${groupData.name}" created! 🎉`);
    setShowAddGroup(false);
  }

  // Add a new expense
  function addExpense(expenseData) {
    const newExpense = {
      id: "e" + Date.now(),
      ...expenseData,
      date: new Date().toISOString().split("T")[0],
    };
    setExpenses((prev) => [...prev, newExpense]);
    showToast(`Expense added! 💸`);
    setShowAddExpense(false);
  }

  // Settle a debt
  function settleDebt(settlement) {
    const newSettlement = {
      id: "s" + Date.now(),
      ...settlement,
      date: new Date().toISOString().split("T")[0],
    };
    setSettlements((prev) => [...prev, newSettlement]);
    showToast(`₹${settlement.amount} settled! 🎊`);
  }

  // Delete an expense
  function deleteExpense(expenseId) {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
    showToast("Expense removed", "info");
  }

  // Navigate to a group
  function openGroup(groupId) {
    setSelectedGroupId(groupId);
    setActiveTab("group");
  }

  // Get the currently selected group
  const selectedGroup = groups.find((g) => g.id === selectedGroupId);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddGroup={() => setShowAddGroup(true)}
        onAddExpense={() => setShowAddExpense(true)}
        groups={groups}
        openGroup={openGroup}
      />

      <main style={{ flex: 1, padding: "24px 20px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <Dashboard
            groups={groups}
            expenses={expenses}
            settlements={settlements}
            openGroup={openGroup}
            onAddGroup={() => setShowAddGroup(true)}
            onAddExpense={() => setShowAddExpense(true)}
          />
        )}

        {/* GROUP VIEW */}
        {activeTab === "group" && selectedGroup && (
          <GroupView
            group={selectedGroup}
            expenses={expenses.filter((e) => e.groupId === selectedGroup.id)}
            settlements={settlements.filter((s) => s.groupId === selectedGroup.id)}
            onAddExpense={() => setShowAddExpense(true)}
            onSettle={settleDebt}
            onDeleteExpense={deleteExpense}
            onBack={() => setActiveTab("dashboard")}
          />
        )}

        {/* SHAME WALL */}
        {activeTab === "shame" && (
          <ShameWall
            groups={groups}
            expenses={expenses}
            settlements={settlements}
          />
        )}
      </main>

      {/* MODALS */}
      {showAddExpense && (
        <AddExpenseModal
          groups={groups}
          defaultGroupId={selectedGroupId}
          onAdd={addExpense}
          onClose={() => setShowAddExpense(false)}
        />
      )}

      {showAddGroup && (
        <AddGroupModal
          onAdd={addGroup}
          onClose={() => setShowAddGroup(false)}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            background: toast.type === "success" ? "var(--green)" : toast.type === "info" ? "var(--accent4)" : "var(--red)",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "var(--radius-sm)",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: "var(--shadow)",
            zIndex: 9999,
            animation: "slideUp 0.2s ease",
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
