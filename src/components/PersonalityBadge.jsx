import { findMemberPersonality } from '../utils/personality'

export default function PersonalityBadge({ member, expenses }) {
  const personality = findMemberPersonality(member, expenses)

  return (
    <div
      className="row"
      style={{
        display: 'inline-flex',
        background: `${personality.color}15`,
        border: `1px solid ${personality.color}40`,
        borderRadius: 20,
        padding: '3px 9px',
      }}
    >
      <span>{personality.emoji}</span>
      <div style={{ color: personality.color, fontWeight: 600, fontSize: 11 }}>
        {personality.pName}
      </div>
    </div>
  )
}
