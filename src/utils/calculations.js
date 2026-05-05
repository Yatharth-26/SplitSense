import { CATEGORIES } from './constants'

export function calculateMemberBalances(group) {
  const balances = {}

  // Pehle har member ka balance zero se start
  for (const member of group.members) {
    balances[member] = 0
  }

  // Har expense ko sab members me split karte hai
  for (const expense of group.expenses) {
    const share = expense.amount / group.members.length

    for (const member of group.members) {
      if (member === expense.paidBy) {
        balances[member] = balances[member] + expense.amount - share
      } else if (!expense.settled[member]) {
        balances[member] = balances[member] - share
      }
    }
  }

  return balances
}

export function calculateTotalPendingAmount(group) {
  const balances = calculateMemberBalances(group)
  let total = 0

  // Negative balance matlab kisi ko pay karna hai
  for (const balance of Object.values(balances)) {
    if (balance < 0) {
      total = total + Math.abs(balance)
    }
  }

  return total
}

export function countPendingPayments(group) {
  let count = 0

  // False settled value ka matlab payment pending hai
  for (const expense of group.expenses) {
    for (const settled of Object.values(expense.settled)) {
      if (!settled) {
        count = count + 1
      }
    }
  }

  return count
}

export function showRupees(amount) {
  return `₹${Math.abs(Math.round(amount)).toLocaleString('en-IN')}`
}

export function findCategoryEmoji(id) {
  // Category id se matching emoji dhundte hai
  const category = CATEGORIES.find(c => c.id === id)

  if (category) {
    return category.emoji
  }

  return '📦'
}
