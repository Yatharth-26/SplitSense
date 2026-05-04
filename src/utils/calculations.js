import { CATEGORIES } from './constants'

export function calcBalances(group) {
  const balances = {}

  for (const member of group.members) {
    balances[member] = 0
  }

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

export function getTotalUnsettled(group) {
  const balances = calcBalances(group)
  let total = 0

  for (const balance of Object.values(balances)) {
    if (balance < 0) {
      total = total + Math.abs(balance)
    }
  }

  return total
}

export function getPendingCount(group) {
  let count = 0

  for (const expense of group.expenses) {
    for (const settled of Object.values(expense.settled)) {
      if (!settled) {
        count = count + 1
      }
    }
  }

  return count
}

export function formatCurrency(amount) {
  return `₹${Math.abs(Math.round(amount)).toLocaleString('en-IN')}`
}

export function getCatEmoji(id) {
  const category = CATEGORIES.find(c => c.id === id)

  if (category) {
    return category.emoji
  }

  return '📦'
}
