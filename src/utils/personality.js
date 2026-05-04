import { COLORS } from './constants'

function makePersonality(pName, emoji, color, score, tagline) {
  return { pName, emoji, color, score, tagline }
}

export function getPersonality(member, expenses) {
  let total = 0
  let settledCount = 0
  let paidCount = 0

  for (const expense of expenses) {
    const memberIsInExpense = Object.keys(expense.settled).includes(member)

    if (memberIsInExpense) {
      total = total + 1
    }

    if (expense.settled[member] === true) {
      settledCount = settledCount + 1
    }

    if (expense.paidBy === member) {
      paidCount = paidCount + 1
    }
  }

  if (total === 0) {
    return makePersonality(
      'New Member',
      '👋',
      COLORS.MUTED,
      50,
      'Just joined. The jury is still out.'
    )
  }

  const settleRate = settledCount / total
  const payerRate = paidCount / total

  if (settleRate >= 0.85 && payerRate >= 0.25) {
    return makePersonality('The Saint', '👑', COLORS.YELLOW, 98, 'Always pays first. The group MVP.')
  }

  if (settleRate >= 0.75) {
    return makePersonality('The Penny Pincher', '🧮', COLORS.GREEN, 76, 'Pays exactly their share. Not a rupee more.')
  }

  if (settleRate >= 0.55) {
    return makePersonality('The Gambler', '🎲', COLORS.PURPLE, 52, 'Could pay in 2 mins or 2 weeks. Who knows.')
  }

  if (settleRate >= 0.35) {
    return makePersonality('The Chronic Delayer', '🐢', COLORS.ACCENT, 30, 'Not broke. Perpetually about to send it.')
  }

  if (settleRate >= 0.15) {
    return makePersonality('The Ghost', '👻', COLORS.MUTED, 12, 'Last seen online before the bill dropped.')
  }

  return makePersonality(
    'The Overdue King',
    '😇',
    COLORS.RED,
    3,
    'Holds the group record. A legend - just not a good one.'
  )
}

function getPendingTotal(member, group) {
  const unsettled = group.expenses.filter(expense => {
    return expense.settled[member] === false
  })

  const total = unsettled.reduce((sum, expense) => {
    return sum + expense.amount / group.members.length
  }, 0)

  return {
    amount: Math.round(total),
    count: unsettled.length,
  }
}

export function getRoast(member, group) {
  const personality = getPersonality(member, group.expenses)
  const pending = getPendingTotal(member, group)

  const roasts = {
    'The Ghost':
      `${member} has ₹${pending.amount} pending and was conveniently "offline" right when the bill dropped. Classic.`,
    'The Chronic Delayer':
      `${member} owes ₹${pending.amount} and has been "about to send it" since ${pending.count} bills ago. The group is still waiting.`,
    'The Overdue King':
      `At ₹${pending.amount} across ${pending.count} bills, ${member} has built a legacy. Not a good one, but a legacy.`,
    'The Gambler':
      `${member} paid instantly last time. This time it has been weeks. Nobody knows which version shows up next.`,
    'The Penny Pincher':
      `${member} will pay exactly ₹${pending.amount}. Already calculated the per-head fuel cost for the cab split too.`,
    'The Saint':
      `${member} is the reason this group still functions. The unsung hero. Respect. 🙏`,
    'New Member':
      `${member} just joined. Watch this space.`,
  }

  return roasts[personality.pName] || `${member} has ₹${pending.amount} pending. The group is watching.`
}
