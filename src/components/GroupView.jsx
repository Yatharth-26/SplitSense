// src/components/GroupView.jsx
import { useState, useMemo } from "react";
import { calculateBalances, generateDebts, formatCurrency, formatDate, getTotalSpending } from "../utils/helpers.js";
import { assignPersonality } from "../utils/personality.js";

const CAT_COLORS = {
  Food: "#ff6b6b", Transport: "#4d96ff", Stay: "#ffd93d",
  Activity: "#c77dff", Groceries: "#6bcb77", Entertainment: "#ff9f43", Utilities: "#4ecdc4",
};

export default function GroupView({ group, expenses, settlements, onAddExpense, onSettle, onDeleteExpense, onBack }) {
  const [activeSection, setActiveSection] = useState("balances"); // balances | expenses | personalities
  const [settlingDebt, setSettlingDebt] = useState(null);

  // Calculate balances
  const balances = useMemo(
    () => calculateBalances(expenses, settlements, group.members),
    [expenses, settlements, group.members]
  );

  // Generate debts (who pays whom)
  const debts = useMemo(() => generateDebts(balances), [balances]);

  const totalSpent = getTotalSpending(expenses);

  // Personality for each member
  const personalities = useMemo(
    () => group.members.map((m) => ({ member: m, personality: assignPersonality(m, expenses, settlements) })),
    [group.members, expenses, settlements]
  );

  function handleSettle(debt) {
    setSettlingDebt(null);
    onSettle({ groupId: group.id, from: debt.from, to: debt.to, amount: debt.amount });
  }

  const sections = [
    { id: "balances", label: "💳 Balances" },
    { id: "expenses", label: "🧾 Expenses" },
    { id: "personalities", label: "🎭 Personalities" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ padding: "7px 12px" }}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>
            {group.emoji} {group.name}
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 13 }}>
            {group.members.length} members · {expenses.length} expenses · Created {formatDate(group.createdAt)}
          </p>
        </div>
        <button className="btn btn-primary" onClick={onAddExpense}>+ Add Expense</button>
      </div>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        {[
          { label: "Total Spent", value: formatCurrency(totalSpent), color: "var(--yellow)" },
          { label: "Members", value: group.members.length, color: "var(--accent4)" },
          { label: "Expenses", value: expenses.length, color: "var(--purple)" },
          { label: "Settled", value: settlements.length, color: "var(--green)" },
        ].map((s) => (
          <div className="stat-card" key={s.label} style={{ padding: "14px 16px" }}>
            <div className="stat-value" style={{ color: s.color, fontSize: 22 }}>{s.value}</div>
            <div className="stat-label" style={{ fontSize: 11 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", gap: 6 }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className="btn"
            style={{
              padding: "8px 16px",
              fontSize: 13,
              background: activeSection === s.id ? "rgba(255,107,107,0.15)" : "var(--card)",
              color: activeSection === s.id ? "var(--accent)" : "var(--text2)",
              border: activeSection === s.id ? "1px solid rgba(255,107,107,0.3)" : "1px solid var(--border)",
              fontWeight: activeSection === s.id ? 600 : 400,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* BALANCES SECTION */}
      {activeSection === "balances" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Member balances */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 15, fontWeight: 700 }}>Member Balances</h3>
            </div>
            {group.members.map((member) => {
              const bal = balances[member] || 0;
              const isPos = bal > 0;
              const isNeg = bal < 0;
              return (
                <div key={member} style={{
                  padding: "12px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: isPos ? "rgba(107,203,119,0.15)" : isNeg ? "rgba(255,107,107,0.15)" : "var(--bg3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: isPos ? "var(--green)" : isNeg ? "var(--red)" : "var(--text2)",
                    }}>
                      {member[0]}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{member}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: isPos ? "var(--green)" : isNeg ? "var(--red)" : "var(--text2)" }}>
                    {isPos ? "+" : ""}{formatCurrency(Math.round(bal))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Settle up */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "var(--font-head)", fontSize: 15, fontWeight: 700 }}>Settle Up</h3>
            </div>
            {debts.length === 0 ? (
              <div style={{ padding: 28, textAlign: "center", color: "var(--green)" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                <div style={{ fontWeight: 600 }}>All settled up!</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>No pending debts</div>
              </div>
            ) : (
              debts.map((debt, i) => (
                <div key={i} style={{
                  padding: "12px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div>
                    <div style={{ fontSize: 14 }}>
                      <span style={{ fontWeight: 600, color: "var(--red)" }}>{debt.from}</span>
                      <span style={{ color: "var(--text2)" }}> owes </span>
                      <span style={{ fontWeight: 600, color: "var(--green)" }}>{debt.to}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--yellow)", fontSize: 15 }}>
                      {formatCurrency(debt.amount)}
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: 12, padding: "6px 12px" }}
                    onClick={() => setSettlingDebt(debt)}
                  >
                    Settle ✓
                  </button>
                </div>
              ))
            )}

            {/* Recent settlements */}
            {settlements.length > 0 && (
              <>
                <div style={{ padding: "10px 18px 6px", fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Recent settlements
                </div>
                {settlements.slice(-3).map((s) => (
                  <div key={s.id} style={{ padding: "8px 18px", fontSize: 12, color: "var(--text2)", borderBottom: "1px solid var(--border)" }}>
                    ✅ {s.from} paid {s.to} {formatCurrency(s.amount)} · {formatDate(s.date)}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* EXPENSES SECTION */}
      {activeSection === "expenses" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "var(--font-head)", fontSize: 15, fontWeight: 700 }}>All Expenses</h3>
            <button className="btn btn-primary" style={{ fontSize: 12, padding: "6px 12px" }} onClick={onAddExpense}>+ Add</button>
          </div>
          {expenses.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text2)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🧾</div>
              No expenses yet. Add one!
            </div>
          ) : (
            [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).map((exp) => {
              const color = CAT_COLORS[exp.category] || "#888";
              const perPerson = exp.amount / exp.splitAmong.length;
              return (
                <div key={exp.id} style={{
                  padding: "14px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{ display: "flex", gap: 12, flex: 1 }}>
                    <div style={{
                      width: 8, borderRadius: 4, background: color,
                      flexShrink: 0, marginTop: 4,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{exp.description}</div>
                      <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                        Paid by <b>{exp.paidBy}</b> · {formatDate(exp.date)}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text2)" }}>
                        Split among: {exp.splitAmong.join(", ")} · {formatCurrency(Math.round(perPerson))} each
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15 }}>{formatCurrency(exp.amount)}</div>
                      <span style={{ ...badgeStyle, background: color + "22", color }}>
                        {exp.category}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      style={{
                        background: "none", border: "none", color: "var(--text3)",
                        cursor: "pointer", fontSize: 16, padding: "2px 6px",
                        borderRadius: 6, transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--red)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--text3)"}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* PERSONALITIES SECTION */}
      {activeSection === "personalities" && (
        <div>
          <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 16 }}>
            Based on payment behaviour in this group 🧠
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {personalities.map(({ member, personality }) => (
              <div key={member} className="card" style={{
                border: `1px solid ${personality.color}44`,
                background: `linear-gradient(135deg, var(--card), ${personality.color}11)`,
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{personality.emoji}</div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15, color: personality.color }}>
                  {personality.name}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginTop: 2 }}>{member}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 6, lineHeight: 1.5 }}>
                  {personality.description}
                </div>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    Total paid: <b style={{ color: "var(--text2)" }}>{formatCurrency(personality.stats.totalPaid)}</b>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    Still owes: <b style={{ color: personality.stats.totalOwed > 0 ? "var(--red)" : "var(--green)" }}>
                      {formatCurrency(personality.stats.totalOwed)}
                    </b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settle confirm mini-modal */}
      {settlingDebt && (
        <div className="modal-overlay" onClick={() => setSettlingDebt(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: 12 }}>Confirm Settlement</h3>
            <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 16 }}>
              <b>{settlingDebt.from}</b> is paying <b>{settlingDebt.to}</b> <b style={{ color: "var(--yellow)" }}>{formatCurrency(settlingDebt.amount)}</b>
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setSettlingDebt(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSettle(settlingDebt)}>Confirm ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const badgeStyle = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: 100,
  fontSize: 11,
  fontWeight: 600,
  marginTop: 3,
};
