// src/utils/helpers.js

// Calculate how much each person owes/is owed within a group
export function calculateBalances(expenses, settlements, members) {
  // Initialize balance map: positive = owed to them, negative = they owe
  const balances = {};
  members.forEach((m) => (balances[m] = 0));

  // Process each expense
  expenses.forEach((expense) => {
    const share = expense.amount / expense.splitAmong.length;

    // Person who paid gets credit
    if (balances[expense.paidBy] !== undefined) {
      balances[expense.paidBy] += expense.amount;
    }

    // Each person in splitAmong owes their share
    expense.splitAmong.forEach((person) => {
      if (balances[person] !== undefined) {
        balances[person] -= share;
      }
    });
  });

  // Apply settlements
  settlements.forEach((s) => {
    if (balances[s.from] !== undefined) balances[s.from] += s.amount;
    if (balances[s.to] !== undefined) balances[s.to] -= s.amount;
  });

  return balances;
}

// Generate who owes whom (simplified debt map)
export function generateDebts(balances) {
  const debts = [];
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([person, balance]) => {
    if (balance > 0.5) creditors.push({ person, amount: balance });
    else if (balance < -0.5) debtors.push({ person, amount: -balance });
  });

  // Greedy matching
  let i = 0, j = 0;
  const creds = [...creditors];
  const debs = [...debtors];

  while (i < creds.length && j < debs.length) {
    const settle = Math.min(creds[i].amount, debs[j].amount);
    debts.push({ from: debs[j].person, to: creds[i].person, amount: Math.round(settle) });
    creds[i].amount -= settle;
    debs[j].amount -= settle;
    if (creds[i].amount < 0.5) i++;
    if (debs[j].amount < 0.5) j++;
  }

  return debts;
}

// Format currency in INR
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date nicely
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// Get total group spending
export function getTotalSpending(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

// Get spending by category
export function getSpendingByCategory(expenses) {
  const map = {};
  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount;
  });
  return map;
}

// Get who paid most
export function getTopPayer(expenses) {
  const map = {};
  expenses.forEach((e) => {
    map[e.paidBy] = (map[e.paidBy] || 0) + e.amount;
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1])[0];
}
