import { COLORS } from '../utils/constants'
import { formatCurrency } from '../utils/calculations'
import { getPersonality } from '../utils/personality'
import { useGroups } from '../context/GroupContext'

const C = COLORS

export default function BalanceCard({ member, balance, group, index }) {
  const { setRoastTarget } = useGroups()
  const personality = getPersonality(member, group.expenses)
  const status = balance > 0 ? 'gets back' : balance < 0 ? 'owes' : ''
  let balanceText = 'Even'

  if (balance > 0) {
    balanceText = `+${formatCurrency(balance)}`
  }

  if (balance < 0) {
    balanceText = `-${formatCurrency(balance)}`
  }

  const balanceColor = balance > 0 ? C.GREEN : balance < 0 ? C.RED : C.MUTED

  return (
    <div
      className="card space-between fade-up"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      <div className="row">
        <div
          className="avatar"
          style={{
            background: `${personality.color}20`,
            border: `2px solid ${personality.color}50`,
          }}
        >
          {personality.emoji}
        </div>

        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{member}</div>
          <div style={{ color: personality.color, fontSize: 11, marginTop: 1 }}>
            {personality.pName}
          </div>
        </div>
      </div>

      <div className="right-info row">
        <div style={{ textAlign: 'right' }}>
          <div className="title" style={{ color: balanceColor }}>
            {balanceText}
          </div>
          <div className="muted">
            {status}
          </div>
        </div>

        <button
          onClick={() => setRoastTarget({ member, group })}
          title="Roast this person"
          className="small-button"
          style={{
            background: `${C.ACCENT}20`,
            border: `1px solid ${C.ACCENT}40`,
            color: C.ACCENT,
          }}
        >
          🔥
        </button>
      </div>
    </div>
  )
}
