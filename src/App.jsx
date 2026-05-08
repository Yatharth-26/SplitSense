// src/App.jsx
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import GroupView from "./components/GroupView.jsx";
import ShameWall from "./components/ShameWall.jsx";
import AddExpenseModal from "./components/AddExpenseModal.jsx";
import AddGroupModal from "./components/AddGroupModal.jsx";
import { initialExpenses, initialGroups, initialSettlements } from "./data/demoData.js";

function loadState(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [groups, setGroups] = useState(() => loadState("ss_groups", initialGroups));
  const [expenses, setExpenses] = useState(() => loadState("ss_expenses", initialExpenses));
  const [settlements, setSettlements] = useState(() => loadState("ss_settlements", initialSettlements));
  const [theme, setTheme] = useState(() => loadState("ss_theme", "dark"));

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("ss_groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem("ss_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("ss_settlements", JSON.stringify(settlements));
  }, [settlements]);

  useEffect(() => {
    localStorage.setItem("ss_theme", JSON.stringify(theme));
  }, [theme]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }

  function addGroup(groupData) {
    const newGroup = {
      id: "g" + Date.now(),
      ...groupData,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setGroups((prevGroups) => [...prevGroups, newGroup]);
    setShowAddGroup(false);
    showToast("Group created");
  }

  function addExpense(expenseData) {
    const newExpense = {
      id: "e" + Date.now(),
      ...expenseData,
      date: new Date().toISOString().split("T")[0],
    };

    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    setShowAddExpense(false);
    showToast("Expense added");
  }

  function settleDebt(settlement) {
    const newSettlement = {
      id: "s" + Date.now(),
      ...settlement,
      date: new Date().toISOString().split("T")[0],
    };

    setSettlements((prevSettlements) => [...prevSettlements, newSettlement]);
    showToast("Settlement added");
  }

  function deleteExpense(expenseId) {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseId));
    showToast("Expense deleted", "info");
  }

  function openGroup(groupId) {
    setSelectedGroupId(groupId);
    setActiveTab("group");
  }

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
  }

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const selectedExpenses = expenses.filter((expense) => expense.groupId === selectedGroupId);
  const selectedSettlements = settlements.filter((settlement) => settlement.groupId === selectedGroupId);

  return (
    <div className="app" data-theme={theme}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        groups={groups}
        openGroup={openGroup}
        onAddGroup={() => setShowAddGroup(true)}
        onAddExpense={() => setShowAddExpense(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main container">
        {activeTab === "dashboard" && (
          <Dashboard
            groups={groups}
            expenses={expenses}
            settlements={settlements}
            openGroup={openGroup}
            onAddGroup={() => setShowAddGroup(true)}
          />
        )}

        {activeTab === "group" && selectedGroup && (
          <GroupView
            group={selectedGroup}
            expenses={selectedExpenses}
            settlements={selectedSettlements}
            onAddExpense={() => setShowAddExpense(true)}
            onSettle={settleDebt}
            onDeleteExpense={deleteExpense}
            onBack={() => setActiveTab("dashboard")}
          />
        )}

        {activeTab === "shame" && (
          <ShameWall groups={groups} expenses={expenses} settlements={settlements} />
        )}
      </main>

      {showAddExpense && (
        <AddExpenseModal
          groups={groups}
          defaultGroupId={selectedGroupId}
          onAdd={addExpense}
          onClose={() => setShowAddExpense(false)}
        />
      )}

      {showAddGroup && (
        <AddGroupModal onAdd={addGroup} onClose={() => setShowAddGroup(false)} />
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
