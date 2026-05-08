// src/data/demoData.js
// Initial demo data for the app

export const initialGroups = [
  {
    id: "g1",
    name: "Goa Trip 🏖️",
    emoji: "🏖️",
    members: ["Yatharth", "Riya", "Aman", "Priya"],
    createdAt: "2025-03-10",
  },
  {
    id: "g2",
    name: "PG Flatmates 🏠",
    emoji: "🏠",
    members: ["Yatharth", "Rohan", "Dev"],
    createdAt: "2025-01-05",
  },
  {
    id: "g3",
    name: "College Gang 🎓",
    emoji: "🎓",
    members: ["Yatharth", "Aman", "Sneha", "Karan", "Dev"],
    createdAt: "2024-09-01",
  },
];

export const initialExpenses = [
  // Goa Trip
  { id: "e1", groupId: "g1", description: "Hotel booking", amount: 8000, paidBy: "Yatharth", splitAmong: ["Yatharth", "Riya", "Aman", "Priya"], date: "2025-03-11", category: "Stay" },
  { id: "e2", groupId: "g1", description: "Beach shack dinner", amount: 3200, paidBy: "Riya", splitAmong: ["Yatharth", "Riya", "Aman", "Priya"], date: "2025-03-12", category: "Food" },
  { id: "e3", groupId: "g1", description: "Scooter rental", amount: 1500, paidBy: "Aman", splitAmong: ["Yatharth", "Aman"], date: "2025-03-12", category: "Transport" },
  { id: "e4", groupId: "g1", description: "Parasailing", amount: 4000, paidBy: "Yatharth", splitAmong: ["Yatharth", "Riya", "Aman", "Priya"], date: "2025-03-13", category: "Activity" },
  { id: "e5", groupId: "g1", description: "Cab to airport", amount: 1200, paidBy: "Priya", splitAmong: ["Yatharth", "Riya", "Aman", "Priya"], date: "2025-03-14", category: "Transport" },

  // PG Flatmates
  { id: "e6", groupId: "g2", description: "Monthly groceries", amount: 4500, paidBy: "Yatharth", splitAmong: ["Yatharth", "Rohan", "Dev"], date: "2025-04-01", category: "Groceries" },
  { id: "e7", groupId: "g2", description: "Netflix subscription", amount: 649, paidBy: "Rohan", splitAmong: ["Yatharth", "Rohan", "Dev"], date: "2025-04-02", category: "Entertainment" },
  { id: "e8", groupId: "g2", description: "Electricity bill", amount: 2800, paidBy: "Dev", splitAmong: ["Yatharth", "Rohan", "Dev"], date: "2025-04-05", category: "Utilities" },
  { id: "e9", groupId: "g2", description: "Cleaning supplies", amount: 560, paidBy: "Yatharth", splitAmong: ["Yatharth", "Rohan", "Dev"], date: "2025-04-10", category: "Groceries" },

  // College Gang
  { id: "e10", groupId: "g3", description: "Fest tickets", amount: 2500, paidBy: "Sneha", splitAmong: ["Yatharth", "Aman", "Sneha", "Karan", "Dev"], date: "2025-02-14", category: "Entertainment" },
  { id: "e11", groupId: "g3", description: "Midnight pizza", amount: 1800, paidBy: "Karan", splitAmong: ["Yatharth", "Aman", "Sneha", "Karan", "Dev"], date: "2025-02-15", category: "Food" },
  { id: "e12", groupId: "g3", description: "Chai & snacks", amount: 450, paidBy: "Aman", splitAmong: ["Yatharth", "Aman", "Karan"], date: "2025-03-01", category: "Food" },
];

export const initialSettlements = [
  { id: "s1", groupId: "g1", from: "Priya", to: "Yatharth", amount: 1200, date: "2025-03-15" },
  { id: "s2", groupId: "g2", from: "Rohan", to: "Yatharth", amount: 500, date: "2025-04-08" },
];
