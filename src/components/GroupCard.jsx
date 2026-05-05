import { useNavigate } from 'react-router-dom'
import { useGroups } from '../context/GroupContext'
import { COLORS } from '../utils/constants'
import { getTotalUnsettled, getPendingCount, formatCurrency } from '../utils/calculations'

const C = COLORS

export default function GroupCard({ group, index }) {
  const navigate = useNavigate()
  const { setSelectedGroupId } = useGroups()

  const unsettledAmount = getTotalUnsettled(group)
  const pendingCount = getPendingCount(group)

  const handleClick = () => {
    setSelectedGroupId(group.id)
    navigate(`/group/${group.id}`)
  }

  return (
    <div
      className="card space-between fade-up"
      onClick={handleClick}
      style={{ cursor: 'pointer', animationDelay: `${index * 0.06}s` }}
    >
      <div className="row">
        <div
          className="avatar"
          style={{
            background: `${group.color}20`,
            border: `2px solid ${group.color}50`,
          }}
        >
          {group.emoji}
        </div>

        <div>
          <div className="title">{group.name}</div>
          <div className="muted">
            {group.members.length} members · {group.expenses.length} expenses
          </div>
        </div>
      </div>

      {unsettledAmount > 0 ? (
        <div className="right-info">
          <div className="title" style={{ color: C.RED }}>
            {formatCurrency(unsettledAmount)}
          </div>
          <div className="muted">
            {pendingCount} pending
          </div>
        </div>
      ) : (
        <div style={{ color: C.GREEN, fontWeight: 600, fontSize: 13 }}>
          ✓ All clear
        </div>
      )}
    </div>
  )
}
