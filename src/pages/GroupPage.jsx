import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGroups } from '../context/GroupContext'
import { COLORS, CATEGORIES } from '../utils/constants'
import { calcBalances } from '../utils/calculations'
import ExpenseCard from '../components/ExpenseCard'
import BalanceCard from '../components/BalanceCard'
import GroupStats from '../components/GroupStats'

const C = COLORS

const TABS = [
  { id: 'expenses', label: '🧾 Expenses' },
  { id: 'balances', label: '⚖️ Balances' },
  { id: 'stats', label: '📊 Stats' },
]

export default function GroupPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { groups, setSelectedGroupId, setShowAddExp } = useGroups()

  const [activeTab, setActiveTab] = useState('expenses')
  const [filterCat, setFilterCat] = useState('all')

  const group = groups.find(g => g.id === id)

  if (!group) {
    navigate('/')
    return null
  }

  const balances = calcBalances(group)

  const sortedExpenses = [...group.expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )

  const filteredExpenses = filterCat === 'all'
    ? sortedExpenses
    : sortedExpenses.filter(e => e.category === filterCat)

  const handleAddExp = () => {
    setSelectedGroupId(group.id)
    setShowAddExp(true)
  }

  return (
    <div className="fade-up">
      <div className="group-header">
        <button
          onClick={() => navigate('/')}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: C.CARD,
            border: `1px solid ${C.BORDER}`,
            color: C.TEXT,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </button>

        <span style={{ fontSize: 26 }}>{group.emoji}</span>

        <div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 19,
          }}>
            {group.name}
          </h2>
          <p style={{ color: C.MUTED, fontSize: 12 }}>
            {group.members.join(', ')}
          </p>
        </div>

        <button
          onClick={handleAddExp}
          style={{
            marginLeft: 'auto',
            background: C.ACCENT,
            color: '#fff',
            padding: '8px 14px',
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 13,
            boxShadow: `0 0 14px ${C.ACCENT}50`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          + Expense
        </button>
      </div>

      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              background: activeTab === t.id ? C.ACCENT : 'transparent',
              color: activeTab === t.id ? '#fff' : C.MUTED,
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'expenses' && (
        <div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
            <button
              onClick={() => setFilterCat('all')}
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 500,
                background: filterCat === 'all' ? C.ACCENT : C.CARD,
                color: filterCat === 'all' ? '#fff' : C.MUTED,
                border: `1px solid ${filterCat === 'all' ? C.ACCENT : C.BORDER}`,
              }}
            >
              All
            </button>

            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCat(cat.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 500,
                  background: filterCat === cat.id ? `${group.color}25` : C.CARD,
                  color: filterCat === cat.id ? group.color : C.MUTED,
                  border: `1px solid ${filterCat === cat.id ? group.color : C.BORDER}`,
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 9 }}>
            {filteredExpenses.map((exp, i) => (
              <ExpenseCard key={exp.id} expense={exp} group={group} index={i} />
            ))}
          </div>

          {filteredExpenses.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: C.MUTED,
              fontSize: 14,
            }}>
              No expenses here yet.
            </div>
          )}
        </div>
      )}

      {activeTab === 'balances' && (
        <div style={{ display: 'grid', gap: 9 }}>
          {group.members.map((member, i) => (
            <BalanceCard
              key={member}
              member={member}
              balance={balances[member]}
              group={group}
              index={i}
            />
          ))}
        </div>
      )}

      {activeTab === 'stats' && <GroupStats group={group} />}
    </div>
  )
}
