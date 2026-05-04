import { COLORS } from '../../utils/constants'
import { getPersonality } from '../../utils/personality'
import { getRoast } from '../../utils/personality'
import { useGroups } from '../../context/GroupContext'

const C = COLORS

export default function RoastModal() {
  const { roastTarget, setRoastTarget } = useGroups()
  if (!roastTarget) return null

  const { member, group } = roastTarget
  const personality = getPersonality(member, group.expenses)
  const roast       = getRoast(member, group)

  return (
    <div
      onClick={() => setRoastTarget(null)}
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(6px)',
        zIndex:         1000,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="pop-in"
        style={{
          background:   '#13131E',
          borderRadius: 20,
          padding:      '28px 24px',
          border:       `1px solid ${C.BORDER}`,
          width:        '100%',
          maxWidth:     400,
          textAlign:    'center',
          boxShadow:    '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
                <div style={{ fontSize: 52, marginBottom: 10 }}>{personality.emoji}</div>

                <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize:   21,
          color:      personality.color,
          marginBottom: 4,
        }}>
          {personality.pName}
        </h2>

                <p style={{ color: C.MUTED, fontSize: 12, marginBottom: 18 }}>
          {member} · {group.name}
        </p>

                <div style={{
          background:   `${personality.color}10`,
          border:       `1px solid ${personality.color}30`,
          borderRadius: 14,
          padding:      '14px 18px',
          marginBottom: 20,
          fontSize:     13,
          lineHeight:   1.7,
          color:        C.TEXT,
          textAlign:    'left',
        }}>
          🔥 {roast}
        </div>

                <button
          onClick={() => setRoastTarget(null)}
          style={{
            background:   C.ACCENT,
            color:        '#fff',
            padding:      '9px 24px',
            borderRadius: 20,
            fontWeight:   600,
            fontSize:     13,
            boxShadow:    `0 0 14px ${C.ACCENT}50`,
          }}
        >
          Noted 😬
        </button>
      </div>
    </div>
  )
}
