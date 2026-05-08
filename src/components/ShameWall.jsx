// src/components/ShameWall.jsx
import { useMemo } from "react";
import { calculateBalances, formatCurrency } from "../utils/helpers.js";

export default function ShameWall({ groups, expenses, settlements }) {
  const people = useMemo(() => {
    const names = new Set();

    groups.forEach((group) => {
      group.members.forEach((member) => names.add(member));
    });

    return [...names]
      .map((member) => {
        let totalOwed = 0;
        let totalPaid = 0;

        expenses.forEach((expense) => {
          if (expense.paidBy === member) {
            totalPaid += expense.amount;
          }
        });

        groups.forEach((group) => {
          if (!group.members.includes(member)) return;

          const groupExpenses = expenses.filter((expense) => expense.groupId === group.id);
          const groupSettlements = settlements.filter((settlement) => settlement.groupId === group.id);
          const balances = calculateBalances(groupExpenses, groupSettlements, group.members);
          const balance = balances[member] || 0;

          if (balance < 0) {
            totalOwed += Math.abs(balance);
          }
        });

        return {
          member,
          totalPaid: Math.round(totalPaid),
          totalOwed: Math.round(totalOwed),
        };
      })
      .sort((a, b) => b.totalOwed - a.totalOwed);
  }, [groups, expenses, settlements]);

  const topPerson = people[0];

  return (
    <div className="page">
      <section className="card hero-card">
        <div>
          <h1>Shame Wall</h1>
          <p className="muted">
            This page simply sorts members by how much they currently owe.
          </p>
        </div>

        {topPerson && (
          <div className="summary-box">
            <div className="summary-label">Highest Due</div>
            <div className="summary-value red">{topPerson.member}</div>
            <p className="tiny">{formatCurrency(topPerson.totalOwed)}</p>
          </div>
        )}
      </section>

      <section className="shame-grid">
        {people.map((person, index) => (
          <div className="person-card" key={person.member}>
            <p className="rank">Rank #{index + 1}</p>
            <div className="member-info">
              <div className="avatar">{person.member[0]}</div>
              <div>
                <h2>{person.member}</h2>
                <p className="tiny">Total paid: {formatCurrency(person.totalPaid)}</p>
              </div>
            </div>

            <p className="muted">Current pending amount</p>
            <h2 className={person.totalOwed > 0 ? "red" : "green"}>
              {formatCurrency(person.totalOwed)}
            </h2>
          </div>
        ))}
      </section>
    </div>
  );
}
