// src/components/GroupView.jsx
import { useMemo, useState } from "react";
import {
  calculateBalances,
  formatCurrency,
  formatDate,
  generateDebts,
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

export default function GroupView({
  group,
  expenses,
  settlements,
  onAddExpense,
  onSettle,
  onDeleteExpense,
  onBack,
}) {
  const [activeSection, setActiveSection] = useState("balances");
  const [settlingDebt, setSettlingDebt] = useState(null);

  const balances = useMemo(
    () => calculateBalances(expenses, settlements, group.members),
    [expenses, settlements, group.members]
  );

  const debts = useMemo(() => generateDebts(balances), [balances]);
  const totalSpent = getTotalSpending(expenses);

  const sections = ["balances", "expenses"];

  function confirmSettlement(debt) {
    onSettle({
      groupId: group.id,
      from: debt.from,
      to: debt.to,
      amount: debt.amount,
    });
    setSettlingDebt(null);
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <div className="page-header-main">
          <h1 className="page-title">{group.emoji} {group.name}</h1>
          <p className="muted">
            {group.members.length} members, {expenses.length} expenses, created {formatDate(group.createdAt)}
          </p>
        </div>
        <button className="btn btn-primary" onClick={onAddExpense}>Add Expense</button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-value yellow">{formatCurrency(totalSpent)}</div>
          <div className="stat-label">Total Spent</div>
        </div>
        <div className="stat-card">
          <div className="stat-value blue">{group.members.length}</div>
          <div className="stat-label">Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-value purple">{expenses.length}</div>
          <div className="stat-label">Expenses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value green">{settlements.length}</div>
          <div className="stat-label">Settlements</div>
        </div>
      </section>

      <div className="tabs">
        {sections.map((section) => (
          <button
            key={section}
            className={`btn ${activeSection === section ? "active" : ""}`}
            onClick={() => setActiveSection(section)}
          >
            {section === "balances" ? "Balances" : "Expenses"}
          </button>
        ))}
      </div>

      {activeSection === "balances" && (
        <section className="two-column">
          <div className="card no-padding">
            <div className="card-header">
              <h2 className="section-title">Member Balances</h2>
            </div>

            {group.members.map((member) => {
              const balance = balances[member] || 0;
              const balanceClass = balance > 0 ? "green" : balance < 0 ? "red" : "muted";

              return (
                <div className="list-row" key={member}>
                  <div className="member-info">
                    <div className="avatar">{member[0]}</div>
                    <strong>{member}</strong>
                  </div>
                  <strong className={balanceClass}>
                    {balance > 0 ? "+" : ""}{formatCurrency(Math.round(balance))}
                  </strong>
                </div>
              );
            })}
          </div>

          <div className="card no-padding">
            <div className="card-header">
              <h2 className="section-title">Settle Up</h2>
            </div>

            {debts.length === 0 ? (
              <div className="empty-state">
                <strong className="green">All settled up!</strong>
                <p>No pending debts.</p>
              </div>
            ) : (
              debts.map((debt, index) => (
                <div className="debt-row" key={index}>
                  <div>
                    <p>
                      <strong className="red">{debt.from}</strong> owes{" "}
                      <strong className="green">{debt.to}</strong>
                    </p>
                    <strong className="yellow">{formatCurrency(debt.amount)}</strong>
                  </div>
                  <button className="btn btn-small" onClick={() => setSettlingDebt(debt)}>
                    Settle
                  </button>
                </div>
              ))
            )}

            {settlements.length > 0 && (
              <>
                <div className="card-header">
                  <h3 className="tiny">Recent settlements</h3>
                </div>
                {settlements.slice(-3).map((settlement) => (
                  <div className="settlement-row tiny" key={settlement.id}>
                    {settlement.from} paid {settlement.to}{" "}
                    {formatCurrency(settlement.amount)} on {formatDate(settlement.date)}
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      )}

      {activeSection === "expenses" && (
        <section className="card no-padding">
          <div className="card-header">
            <h2 className="section-title">All Expenses</h2>
            <button className="btn btn-primary btn-small" onClick={onAddExpense}>Add</button>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-state">No expenses added yet.</div>
          ) : (
            [...expenses]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((expense) => {
                const color = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;
                const perPerson = expense.amount / expense.splitAmong.length;

                return (
                  <div className="expense-row" key={expense.id}>
                    <div className="expense-main">
                      <div className="category-strip" style={{ backgroundColor: color }} />
                      <div>
                        <h3>{expense.description}</h3>
                        <p className="tiny">Paid by {expense.paidBy} on {formatDate(expense.date)}</p>
                        <p className="tiny">
                          Split among {expense.splitAmong.join(", ")}.{" "}
                          {formatCurrency(Math.round(perPerson))} each
                        </p>
                      </div>
                    </div>

                    <div className="right-text">
                      <strong>{formatCurrency(expense.amount)}</strong>
                      <br />
                      <span
                        className="badge"
                        style={{ color, backgroundColor: `${color}22` }}
                      >
                        {expense.category}
                      </span>
                    </div>

                    <button className="delete-btn" onClick={() => onDeleteExpense(expense.id)}>
                      ×
                    </button>
                  </div>
                );
              })
          )}
        </section>
      )}

      {settlingDebt && (
        <div className="modal-overlay" onClick={() => setSettlingDebt(null)}>
          <div className="modal modal-small" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Settlement</h2>
              <button className="btn btn-ghost btn-small" onClick={() => setSettlingDebt(null)}>×</button>
            </div>
            <p className="muted">
              {settlingDebt.from} is paying {settlingDebt.to}{" "}
              <strong className="yellow">{formatCurrency(settlingDebt.amount)}</strong>
            </p>
            <div className="button-row">
              <button className="btn" onClick={() => setSettlingDebt(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => confirmSettlement(settlingDebt)}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
