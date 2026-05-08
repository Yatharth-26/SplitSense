// src/utils/personality.js
// Assigns a "debt personality" to each person based on their payment behaviour

const PERSONALITIES = [
  {
    id: "saint",
    name: "The Saint",
    emoji: "👑",
    color: "#FFD700",
    bg: "#FFF9E6",
    description: "Always pays first. Often pays more than their share. The group's MVP.",
    condition: (stats) => stats.avgDaysToSettle <= 1 && stats.timesPayedFirst >= 2,
  },
  {
    id: "chronic_delayer",
    name: "The Chronic Delayer",
    emoji: "🦥",
    color: "#FF6B6B",
    bg: "#FFF0F0",
    description: "Owes money for weeks. Not broke — just conveniently forgets every time.",
    condition: (stats) => stats.avgDaysToSettle > 14 && stats.totalOwed > 500,
  },
  {
    id: "penny_pincher",
    name: "The Penny Pincher",
    emoji: "🧮",
    color: "#4ECDC4",
    bg: "#F0FFFE",
    description: "Pays exactly their share. Not a rupee more. Splits the delivery fee too.",
    condition: (stats) => stats.roundingOffset < 10 && stats.totalPaid > 0,
  },
  {
    id: "ghost",
    name: "The Ghost",
    emoji: "👻",
    color: "#9B59B6",
    bg: "#F8F0FF",
    description: "Disappears from the group chat when a bill is raised. Resurfaces when food arrives.",
    condition: (stats) => stats.timesPayedFirst === 0 && stats.totalOwed > 300,
  },
  {
    id: "gambler",
    name: "The Gambler",
    emoji: "🎲",
    color: "#F39C12",
    bg: "#FFFBF0",
    description: "Sometimes pays instantly, sometimes ghosts for a month. Totally unpredictable.",
    condition: (stats) => stats.paymentVariance > 7,
  },
  {
    id: "overdue_king",
    name: "The Overdue King",
    emoji: "😈",
    color: "#E74C3C",
    bg: "#FFF5F5",
    description: "Has the highest outstanding balance in group history. Wears it as a badge of honour.",
    condition: (stats) => stats.totalOwed > 1500,
  },
];

// Calculate stats for a member from expenses and settlements
export function getMemberStats(member, expenses, settlements) {
  let totalPaid = 0;
  let totalOwed = 0;
  let timesPayedFirst = 0;

  expenses.forEach((expense) => {
    if (expense.paidBy === member) {
      totalPaid += expense.amount;
      timesPayedFirst++;
    }
    if (expense.splitAmong.includes(member)) {
      totalOwed += expense.amount / expense.splitAmong.length;
    }
  });

  // Net owed (how much they still need to pay others)
  const settled = settlements
    .filter((s) => s.from === member)
    .reduce((sum, s) => sum + s.amount, 0);

  const netOwed = Math.max(0, totalOwed - totalPaid - settled);

  // Variance in payment timing (simulated for demo)
  const paymentVariance = member.length % 3 === 0 ? 9 : 3;
  const avgDaysToSettle = member.length % 2 === 0 ? 2 : 12;
  const roundingOffset = (totalPaid % 100) < 10 ? 5 : 50;

  return {
    totalPaid: Math.round(totalPaid),
    totalOwed: Math.round(netOwed),
    timesPayedFirst,
    avgDaysToSettle,
    paymentVariance,
    roundingOffset,
  };
}

// Assign personality to a member
export function assignPersonality(member, expenses, settlements) {
  const stats = getMemberStats(member, expenses, settlements);

  // Find matching personality
  for (const p of PERSONALITIES) {
    if (p.condition(stats)) return { ...p, stats };
  }

  // Default
  return { ...PERSONALITIES[0], stats };
}

export { PERSONALITIES };
