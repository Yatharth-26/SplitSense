// src/components/ShameWall.jsx
import { useMemo, useState, useEffect } from "react";
import { assignPersonality, PERSONALITIES } from "../utils/personality.js";
import { calculateBalances, generateDebts, formatCurrency, getTotalSpending } from "../utils/helpers.js";

// Fun roast messages for the shame wall (fetched from a mock "API")
const ROASTS = {
  saint: ["Lowkey carrying the whole group. Has receipts for receipts.", "Pays before the bill even arrives. Legend.", "The only one Venmo-requests the group and actually follows up."],
  chronic_delayer: ["Owes since the Jurassic period. Still pending.", "Has 'will pay you back' as a personality trait.", "Invented time — specifically the concept of 'later.'"],
  penny_pincher: ["Calculates tip to 4 decimal places. Brought a calculator to dinner.", "Pays exactly ₹0.50 less every time. Intentionally.", "The kind of person who divides the Uber by kilometer."],
  ghost: ["Active on Insta 5 mins ago. Has not seen the payment message.", "Responds instantly to memes. Zero response to payment requests.", "Manifests abundance for others. Keeps their own wallet in hiding."],
  gambler: ["Mood-based payment system. No one knows the pattern.", "Sometimes Zelle-d before you even asked. Other times... nothing.", "The group's unpredictable wildcard. Chaos merchant."],
  overdue_king: ["Current balance: national debt level.", "Their Splitwise balance has its own Splitwise balance.", "Still owes from that trip in 2023. The one no one mentions."],
};

export default function ShameWall({ groups, expenses, settlements }) {
  const [roasts, setRoasts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | personality id

  // Collect all unique members across all groups
  const allMembers = useMemo(() => {
    const set = new Set();
    groups.forEach((g) => g.members.forEach((m) => set.add(m)));
    return [...set];
  }, [groups]);

  // Assign personality and stats for each member (across all groups)
  const memberProfiles = useMemo(() =>
    allMembers.map((member) => {
      const personality = assignPersonality(member, expenses, settlements);
      // Total owed across all groups
      let totalOwed = 0;
      groups.forEach((group) => {
        if (!group.members.includes(member)) return;
        const gExp = expenses.filter((e) => e.groupId === group.id);
        const gSet = settlements.filter((s) => s.groupId === group.id);
        const balances = calculateBalances(gExp, gSet, group.members);
        const bal = balances[member] || 0;
        if (bal < 0) totalOwed += Math.abs(bal);
      });
      return { member, personality, totalOwed: Math.round(totalOwed) };
    }).sort((a, b) => b.totalOwed - a.totalOwed),
    [allMembers, groups, expenses, settlements]
  );

  // Simulate fetching roasts (async/await + fetch-style pattern)
  useEffect(() => {
    async function loadRoasts() {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const result = {};
      memberProfiles.forEach(({ member, personality }) => {
        const msgs = ROASTS[personality.id] || ROASTS.saint;
        result[member] = msgs[member.length % msgs.length];
      });
      setRoasts(result);
      setLoading(false);
    }

    loadRoasts();
  }, [memberProfiles.length]);

  // Leaderboard: highest debt
  const topDebtor = memberProfiles[0];

  // Filtered members
  const filteredProfiles = filter === "all"
    ? memberProfiles
    : memberProfiles.filter((p) => p.personality.id === filter);

  // Global stats
  const totalSpent = getTotalSpending(expenses);
  const totalDebts = memberProfiles.reduce((s, p) => s + p.totalOwed, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,107,107,0.15), rgba(199,125,255,0.1))",
        border: "1px solid rgba(255,107,107,0.25)",
        borderRadius: "var(--radius)",
        padding: "28px 28px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 48 }}>🔥</div>
        <h1 style={{ fontFamily: "var(--font-head)", fontSize: 32, fontWeight: 800, letterSpacing: "-1px", marginTop: 8 }}>
          The Shame Wall
        </h1>
        <p style={{ color: "var(--text2)", marginTop: 6, maxWidth: 480, margin: "8px auto 0" }}>
          Where deadbeats are exposed, legends are celebrated, and everyone's payment personality is on display.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "var(--yellow)" }}>
              {formatCurrency(totalSpent)}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>Total group spending</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "var(--red)" }}>
              {formatCurrency(totalDebts)}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>Outstanding debts</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "var(--purple)" }}>
              {allMembers.length}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)" }}>Members tracked</div>
          </div>
        </div>
      </div>

      {/* Top debtor spotlight */}
      {topDebtor && topDebtor.totalOwed > 0 && (
        <div style={{
          background: "linear-gradient(135deg, rgba(255,107,107,0.12), rgba(255,107,107,0.04))",
          border: "1px solid rgba(255,107,107,0.3)",
          borderRadius: "var(--radius)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}>
          <div style={{ fontSize: 42 }}>👑</div>
          <div>
            <div style={{ fontSize: 11, color: "var(--red)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
              🔴 Most Wanted Debtor
            </div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 800 }}>{topDebtor.member}</div>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>
              {topDebtor.personality.name} · Owes{" "}
              <span style={{ color: "var(--red)", fontWeight: 700 }}>{formatCurrency(topDebtor.totalOwed)}</span> across all groups
            </div>
          </div>
        </div>
      )}

      {/* Filter by personality */}
      <div>
        <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 10 }}>Filter by personality:</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setFilter("all")}
            className="btn"
            style={{
              fontSize: 12, padding: "6px 14px",
              background: filter === "all" ? "rgba(255,107,107,0.15)" : "var(--card)",
              color: filter === "all" ? "var(--accent)" : "var(--text2)",
              border: filter === "all" ? "1px solid rgba(255,107,107,0.3)" : "1px solid var(--border)",
            }}
          >
            All
          </button>
          {PERSONALITIES.map((p) => (
            <button
              key={p.id}
              onClick={() => setFilter(p.id)}
              className="btn"
              style={{
                fontSize: 12, padding: "6px 14px",
                background: filter === p.id ? p.color + "22" : "var(--card)",
                color: filter === p.id ? p.color : "var(--text2)",
                border: filter === p.id ? `1px solid ${p.color}55` : "1px solid var(--border)",
              }}
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Member cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "var(--text2)" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }} className="animate-spin">⚙️</div>
          <div>Calculating personalities...</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {filteredProfiles.map(({ member, personality, totalOwed }, index) => (
            <div
              key={member}
              className="card"
              style={{
                border: `1px solid ${personality.color}33`,
                background: `linear-gradient(135deg, var(--card) 60%, ${personality.color}0a)`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Rank badge */}
              {index < 3 && totalOwed > 0 && (
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  fontSize: 11, fontWeight: 700, background: personality.color + "22",
                  color: personality.color, padding: "3px 8px", borderRadius: 100,
                }}>
                  #{index + 1} debtor
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: personality.color + "22",
                  border: `2px solid ${personality.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-head)", fontWeight: 800, fontSize: 18, color: personality.color,
                }}>
                  {member[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 16 }}>{member}</div>
                  <div style={{ fontSize: 12, color: personality.color }}>{personality.emoji} {personality.name}</div>
                </div>
              </div>

              <div style={{
                background: "var(--bg3)", borderRadius: "var(--radius-sm)",
                padding: "10px 12px", marginBottom: 12, fontSize: 13, color: "var(--text2)",
                fontStyle: "italic", lineHeight: 1.5,
              }}>
                "{roasts[member] || '...'}"
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Outstanding</div>
                  <div style={{
                    fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 17,
                    color: totalOwed > 0 ? "var(--red)" : "var(--green)",
                  }}>
                    {totalOwed > 0 ? formatCurrency(totalOwed) : "All clear ✓"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Personality</div>
                  <div style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 100,
                    background: personality.color + "22", color: personality.color,
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {personality.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProfiles.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text2)" }}>
          No members with this personality type yet.
        </div>
      )}
    </div>
  );
}
