// src/components/Dashboard.jsx
import { useMemo } from "react";
import {
  calculateBalances,
  formatCurrency,
  getSpendingByCategory,
  getTotalSpending,
} from "../utils/helpers.js";

const CATEGORY_COLORS = {
  Food: "#fb7185",
  Transport: "#38bdf8",
  Stay: "#facc15",
  Activity: "#c084fc",
  Groceries: "#4ade80",
  Entertainment: "#fb923c",
  Utilities: "#2dd4bf",
  Other: "#94a3b8",
};

export default function Dashboard({ groups, expenses, settlements, openGroup, onAddGroup }) {
  const myName = "Yatharth";

  const totalSpent = useMemo(() => getTotalSpending(expenses), [expenses]);
  const categoryData = useMemo(() => getSpendingByCategory(expenses), [expenses]);

  const myBalance = useMemo(() => {
    let owe = 0;
    let owed = 0;

    groups.forEach((group) => {
      if (!group.members.includes(myName)) return;

      const groupExpenses = expenses.filter((expense) => expense.groupId === group.id);
      const groupSettlements = settlements.filter((settlement) => settlement.groupId === group.id);
      const balances = calculateBalances(groupExpenses, groupSettlements, group.members);
      const balance = balances[myName] || 0;

      if (balance < 0) owe += Math.abs(balance);
      if (balance > 0) owed += balance;
    });

    return {
      owe: Math.round(owe),
      owed: Math.round(owed),
    };
  }, [groups, expenses, settlements]);

  const stats = [
    { label: "Total Spent", value: formatCurrency(totalSpent), className: "yellow" },
    { label: "Groups", value: groups.length, className: "blue" },
    { label: "Expenses", value: expenses.length, className: "purple" },
    { label: "Settlements", value: settlements.length, className: "green" },
  ];

  return (
    <div className="page">
      <section className="card hero-card">
        <div>
          <h1>Expense Splitter</h1>
          <p className="muted">Welcome, {myName}. Add groups and split expenses with friends.</p>
        </div>

        <div className="balance-summary">
          <div className="summary-box">
            <div className="summary-label">You owe</div>
            <div className="summary-value red">{formatCurrency(myBalance.owe)}</div>
          </div>
          <div className="divider" />
          <div className="summary-box">
            <div className="summary-label">Owed to you</div>
            <div className="summary-value green">{formatCurrency(myBalance.owed)}</div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className={`stat-value ${stat.className}`}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="two-column">
        <div className="card no-padding">
          <div className="card-header">
            <h2 className="section-title">Your Groups</h2>
            <button className="btn btn-small" onClick={onAddGroup}>New</button>
          </div>

          {groups.length === 0 ? (
            <div className="empty-state">No groups added yet.</div>
          ) : (
            groups.map((group) => {
              const groupExpenses = expenses.filter((expense) => expense.groupId === group.id);
              const total = getTotalSpending(groupExpenses);

              return (
                <div className="list-row clickable" key={group.id} onClick={() => openGroup(group.id)}>
                  <div className="group-info">
                    <div className="group-icon">{group.emoji}</div>
                    <div>
                      <h3>{group.name}</h3>
                      <p className="tiny">{group.members.length} members, {groupExpenses.length} expenses</p>
                    </div>
                  </div>

                  <div className="right-text">
                    <strong>{formatCurrency(total)}</strong>
                    <p className="tiny">total</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="card">
          <h2 className="section-title">Spending by Category</h2>

          {Object.keys(categoryData).length === 0 ? (
            <div className="empty-state">No expenses added yet.</div>
          ) : (
            <div className="category-list">
              {Object.entries(categoryData)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => {
                  const maxAmount = Math.max(...Object.values(categoryData));
                  const percent = (amount / maxAmount) * 100;
                  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

                  return (
                    <div key={category}>
                      <div className="category-top">
                        <span className="muted">{category}</span>
                        <strong>{formatCurrency(amount)}</strong>
                      </div>
                      <div className="bar">
                        <div
                          className="bar-fill"
                          style={{ width: `${percent}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
