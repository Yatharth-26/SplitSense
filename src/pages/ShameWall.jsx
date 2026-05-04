import { useGroups } from '../context/GroupContext'
import { COLORS } from '../utils/constants'
import { getPersonality } from '../utils/personality'
import { formatCurrency } from '../utils/calculations'

const C = COLORS

const RANK_BADGES = ['💀', '🥈', '🥉']

const PERSONALITY_GUIDE = [
  { emoji: '👑', name: 'The Saint', desc: 'Always pays first', color: C.YELLOW },
  { emoji: '🧮', name: 'The Penny Pincher', desc: 'Exactly their share', color: C.GREEN },
  { emoji: '🎲', name: 'The Gambler', desc: 'Wildly unpredictable', color: C.PURPLE },
  { emoji: '🐢', name: 'The Chronic Delayer', desc: 'About to send it...', color: C.ACCENT },
  { emoji: '👻', name: 'The Ghost', desc: 'Conveniently offline', color: C.MUTED },
  { emoji: '😇', name: 'The Overdue King', desc: 'Sets records, wrong reasons', color: C.RED },
]

function getRankBadge(index) {
  if (index < RANK_BADGES.length) {
    return RANK_BADGES[index]
  }

  return `#${index + 1}`
}

function getOwedAmount(group, member) {
  const unsettledExpenses = group.expenses.filter(expense => {
    return expense.settled[member] === false
  })

  const total = unsettledExpenses.reduce((sum, expense) => {
    return sum + expense.amount / group.members.length
  }, 0)

  return Math.round(total)
}

function getMembersForWall(groups) {
  const members = []
  const addedMembers = {}

  for (const group of groups) {
    for (const member of group.members) {
      if (!addedMembers[member]) {
        const personality = getPersonality(member, group.expenses)

        members.push({
          memberName: member,
          owed: getOwedAmount(group, member),
          ...personality,
        })

        addedMembers[member] = true
      }
    }
  }

  return members.sort((a, b) => a.score - b.score)
}

export default function ShameWall() {
  const { groups } = useGroups()
  const rankedMembers = getMembersForWall(groups)

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 26 }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize:   28,
          marginBottom: 6,
        }}>
          🏆 The Shame Wall
        </h1>
        <p style={{ color: C.MUTED, fontSize: 14 }}>
          Ranked worst to best. It's funny until you're at the top.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 9, marginBottom: 32 }}>
        {rankedMembers.map((member, index) => (
          <div
            key={member.memberName}
            className="fade-up"
            style={{
              background: C.CARD,
              borderRadius: 16,
              padding: '14px 16px',
              border: `1px solid ${C.BORDER}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: index < 3 ? member.color : C.MUTED,
              width: 30,
              textAlign: 'center',
              flexShrink: 0,
            }}>
              {getRankBadge(index)}
            </div>

            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${member.color}20`,
              border: `2px solid ${member.color}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}>
              {member.emoji}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 14,
              }}>
                {member.memberName}
              </div>
              <div style={{
                color: C.MUTED,
                fontSize: 11,
                marginTop: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {member.tagline}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                display: 'inline-block',
                padding: '3px 9px',
                borderRadius: 20,
                background: `${member.color}20`,
                color: member.color,
                fontSize: 11,
                fontWeight: 600,
              }}>
                {member.pName}
              </div>
              {member.owed > 0 && (
                <div style={{
                  color: C.RED,
                  fontWeight: 700,
                  fontSize: 13,
                  marginTop: 4,
                }}>
                  {formatCurrency(member.owed)} owed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: 15,
        marginBottom: 12,
      }}>
        Personality Guide
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: 7,
      }}>
        {PERSONALITY_GUIDE.map(p => (
          <div
            key={p.name}
            style={{
              background: C.CARD,
              borderRadius: 10,
              padding: '9px 11px',
              border: `1px solid ${C.BORDER}`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>{p.emoji}</span>
            <div>
              <div style={{ color: p.color, fontSize: 11, fontWeight: 600 }}>
                {p.name}
              </div>
              <div style={{ color: C.MUTED, fontSize: 10 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
