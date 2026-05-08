// src/components/Dashboard.jsx
import { useMemo } from "react";
import { calculateBalances, formatCurrency, getTotalSpending, getSpendingByCategory } from "../utils/helpers.js";

// Category colors
const CAT_COLORS = {
  Food: "#ff6b6b",
  Transport: "#4d96ff",
  Stay: "#ffd93d",
  Activity: "#c77dff",
  Groceries: "#6bcb77",
  Entertainment: "#ff9f43",
  Utilities: "#4ecdc4",
};

export default function Dashboard({ groups, expenses, settlements, openGroup, onAddGroup, onAddExpense }) {
  // Calculate overall stats
  const totalSpent = useMemo(() => getTotalSpending(expenses), [expenses]);

  // Total owed across all groups (what the logged-in "you" owes)
  const myName = "Yatharth"; // simulated current user
  const myBalance = useMemo(() => {
    let owe = 0;
    let owed = 0;

    groups.forEach((group) => {
      if (!group.members.includes(myName)) return;
      const groupExpenses = expenses.filter((e) => e.groupId === group.id);
      const groupSettlements = settlements.filter((s) => s.groupId === group.id);
      const balances = calculateBalances(groupExpenses, groupSettlements, group.members);

      const bal = balances[myName] || 0;
      if (bal < 0) owe += Math.abs(bal);
      else if (bal > 0) owed += bal;
    });

    return { owe: Math.round(owe), owed: Math.round(owed) };
  }, [groups, expenses, settlements]);

  // Spending by category (all groups)
  const categoryData = useMemo(() => getSpendingByCategory(expenses), [expenses]);

  // Recent expenses (last 5)
  const recentExpenses = useMemo(() =>
    [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [expenses]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Hero greeting */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,107,107,0.12), rgba(255,217,61,0.08))",
        border: "1px solid rgba(255,107,107,0.2)",
        borderRadius: "var(--radius)",
        padding: "28px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div>
          <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 4 }}>Welcome back,</p>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: 32, fontWeight: 800, letterSpacing: "-1px" }}>
            {myName} 👋
          </h1>
          <p style={{ color: "var(--text2)", marginTop: 6, fontSize: 14 }}>
            Splitwise, but it remembers who never pays back.
          </p>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>You owe</div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "var(--red)" }}>
              {formatCurrency(myBalance.owe)}
            </div>
          </div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Owed to you</div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "var(--green)" }}>
              {formatCurrency(myBalance.owed)}
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        {[
          { label: "Total Spent", value: formatCurrency(totalSpent), icon: "💰", color: "var(--yellow)" },
          { label: "Groups", value: groups.length, icon: "🧑‍🤝‍🧑", color: "var(--accent4)" },
          { label: "Expenses", value: expenses.length, icon: "🧾", color: "var(--purple)" },
          { label: "Settled", value: settlements.length, icon: "✅", color: "var(--green)" },
        ].map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span style={{ fontSize: 22 }}>{stat.icon}</span>
            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Groups + Category chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Groups */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700 }}>Your Groups</h2>
            <button className="btn btn-ghost" style={{ fontSize: 12, padding: "4px 10px" }} onClick={onAddGroup}>+ New</button>
          </div>
          <div>
            {groups.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--text2)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🤷</div>
                No groups yet!
              </div>
            ) : (
              groups.map((group) => {
                const groupExpenses = expenses.filter((e) => e.groupId === group.id);
                const total = getTotalSpending(groupExpenses);
                return (
                  <div
                    key={group.id}
                    onClick={() => openGroup(group.id)}
                    style={{
                      padding: "14px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg3)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, border: "1px solid var(--border)",
                      }}>{group.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{group.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text2)" }}>{group.members.length} members · {groupExpenses.length} expenses</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 14 }}>{formatCurrency(total)}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>total</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Spending by category */}
        <div className="card">
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Spending by Category</h2>
          {Object.keys(categoryData).length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text2)", padding: 32 }}>No expenses yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(categoryData)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amount]) => {
                  const maxAmount = Math.max(...Object.values(categoryData));
                  const pct = (amount / maxAmount) * 100;
                  const color = CAT_COLORS[cat] || "#888";
                  return (
                    <div key={cat}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                        <span style={{ color: "var(--text2)" }}>{cat}</span>
                        <span style={{ fontWeight: 600 }}>{formatCurrency(amount)}</span>
                      </div>
                      <div style={{ background: "var(--bg3)", borderRadius: 6, height: 8, overflow: "hidden" }}>
                        <div style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: color,
                          borderRadius: 6,
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700 }}>Recent Activity</h2>
          <button className="btn btn-primary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={onAddExpense}>+ Add Expense</button>
        </div>
        {recentExpenses.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--text2)" }}>No expenses yet</div>
        ) : (
          recentExpenses.map((exp) => {
            const group = groups.find((g) => g.id === exp.groupId);
            const color = CAT_COLORS[exp.category] || "#888";
            return (
              <div key={exp.id} style={{
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{exp.description}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>
                      {group?.name} · paid by {exp.paidBy} · {exp.date}
                    </div>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 15 }}>
                  {formatCurrency(exp.amount)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
