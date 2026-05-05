import { COLORS } from '../utils/constants'
import { formatCurrency, getCatEmoji } from '../utils/calculations'
import { useGroups } from '../context/GroupContext'

const C = COLORS

export default function ExpenseCard({ expense, group, index }) {
  const { settleDebt } = useGroups()
  const share = expense.amount / group.members.length

  const membersWhoDidNotPay = group.members.filter(member => member !== expense.paidBy)
  const allSettled = membersWhoDidNotPay.every(member => expense.settled[member])

  return (
    <div
      className="card fade-up"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="space-between" style={{ alignItems: 'flex-start' }}>
        <div className="row">
          <span style={{ fontSize: 20 }}>{getCatEmoji(expense.category)}</span>

          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{expense.name}</div>
            <div className="muted">
              Paid by {expense.paidBy} · {expense.date}
            </div>
          </div>
        </div>

        <div className="right-info">
          <div className="title">
            {formatCurrency(expense.amount)}
          </div>
          <div className="muted">
            {formatCurrency(share)}/person
          </div>
        </div>
      </div>

      {allSettled ? (
        <div style={{ color: C.GREEN, fontSize: 11, marginTop: 10 }}>
          ✓ All settled
        </div>
      ) : (
        <div className="row" style={{ flexWrap: 'wrap', marginTop: 10 }}>
          {membersWhoDidNotPay.map(member => {
            const settled = expense.settled[member]

            return (
              <button
                key={member}
                className="small-button"
                onClick={() => !settled && settleDebt(group.id, expense.id, member)}
                style={{
                  background: settled ? `${C.GREEN}20` : `${C.RED}15`,
                  color: settled ? C.GREEN : C.RED,
                  border: `1px solid ${settled ? C.GREEN + '40' : C.RED + '40'}`,
                  cursor: settled ? 'default' : 'pointer',
                }}
              >
                {settled ? `✓ ${member}` : `${member} owes ${formatCurrency(share)}`}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
