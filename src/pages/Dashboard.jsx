import { useGroups } from '../context/GroupContext'
import GroupCard from '../components/GroupCard'
import StatCard  from '../components/StatCard'
import { COLORS } from '../utils/constants'
import { calculateTotalPendingAmount, showRupees } from '../utils/calculations'

const C = COLORS

export default function Dashboard() {
  const { groups, setShowAddGrp } = useGroups()

  const totalUnsettled = groups.reduce(
    (sum, g) => sum + calculateTotalPendingAmount(g), 0
  )

  const totalExpenses = groups.reduce((sum, g) => sum + g.expenses.length, 0)

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 30,
          marginBottom: 5,
        }}>
          Hey there 👋
        </h1>
        <p style={{ color: C.MUTED, fontSize: 15 }}>
          Here's what your groups owe each other.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard symbol="₹" value={showRupees(totalUnsettled)} label="Unsettled" color={C.RED} />
        <StatCard symbol="👥" value={groups.length} label="Groups" color={C.PURPLE} />
        <StatCard symbol="🧾" value={totalExpenses} label="Expenses" color={C.GREEN} />
      </div>

      <div className="section-header">
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 18,
        }}>
          Your Groups
        </h2>
        <button
          onClick={() => setShowAddGrp(true)}
          style={{
            background: C.ACCENT,
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 13,
            boxShadow: `0 0 16px ${C.ACCENT}50`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          + New Group
        </button>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {groups.map((group, i) => (
          <GroupCard key={group.id} group={group} index={i} />
        ))}
      </div>

      {groups.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          color: C.MUTED,
          fontSize: 14,
        }}>
          No groups yet. Create one to get started!
        </div>
      )}
    </div>
  )
}
