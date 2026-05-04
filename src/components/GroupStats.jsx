import { COLORS, CATEGORIES } from '../utils/constants'
import { formatCurrency } from '../utils/calculations'

const C = COLORS

function getCategoryTotal(group, categoryId) {
  const categoryExpenses = group.expenses.filter(expense => {
    return expense.category === categoryId
  })

  return categoryExpenses.reduce((sum, expense) => {
    return sum + expense.amount
  }, 0)
}

function getMemberTotal(group, member) {
  const memberExpenses = group.expenses.filter(expense => {
    return expense.paidBy === member
  })

  return memberExpenses.reduce((sum, expense) => {
    return sum + expense.amount
  }, 0)
}

export default function GroupStats({ group }) {
  const total = group.expenses.reduce((sum, e) => sum + e.amount, 0)

  const byCategory = CATEGORIES
    .map(cat => ({
      ...cat,
      total: getCategoryTotal(group, cat.id),
    }))
    .filter(cat => cat.total > 0)
    .sort((a, b) => b.total - a.total)

  const byMember = group.members
    .map(m => ({
      name: m,
      paid: getMemberTotal(group, m),
    }))
    .sort((a, b) => b.paid - a.paid)

  const biggest = group.expenses.length
    ? group.expenses.reduce((a, b) => (b.amount > a.amount ? b : a))
    : null

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="card">
          <div className="muted">
            ₹ Total Spent
          </div>
          <div className="title" style={{ color: C.YELLOW, fontSize: 20 }}>
            {formatCurrency(total)}
          </div>
        </div>

        {biggest && (
          <div className="card">
            <div className="muted">
              📈 Biggest Expense
            </div>
            <div className="title" style={{ color: C.ACCENT }}>
              {biggest.name}
            </div>
            <div className="muted">{formatCurrency(biggest.amount)}</div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="title" style={{ fontSize: 13, marginBottom: 12 }}>
          Spending by Category
        </div>

        {byCategory.map(cat => (
          <div key={cat.id} className="space-between" style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 13 }}>
              <span style={{ fontSize: 13 }}>{cat.emoji} {cat.label}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {formatCurrency(cat.total)}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="title" style={{ fontSize: 13, marginBottom: 12 }}>
          Who Paid the Most
        </div>

        {byMember.map(({ name, paid }) => (
          <div key={name} className="space-between" style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 13 }}>{name}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {formatCurrency(paid)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
