import { useState } from 'react'
import { COLORS, GROUP_COLORS, GROUP_EMOJIS, inputStyle } from '../../utils/constants'
import { useGroups } from '../../context/GroupContext'

const C = COLORS

export default function AddGroupModal() {
  const { addGroup, setShowAddGrp } = useGroups()

  const [name,      setName]      = useState('')
  const [emoji,     setEmoji]     = useState('🎉')
  const [color,     setColor]     = useState(GROUP_COLORS[0])
  const [members,   setMembers]   = useState(['Yatharth'])
  const [memberInp, setMemberInp] = useState('')

  const addMember = () => {
    if (memberInp.trim() && !members.includes(memberInp.trim())) {
      setMembers(prev => [...prev, memberInp.trim()])
      setMemberInp('')
    }
  }

  const removeMember = (m) => {
    if (m === 'Yatharth') return
    setMembers(prev => prev.filter(x => x !== m))
  }

  const handleSubmit = () => {
    if (name && members.length >= 2) {
      addGroup({ name, emoji, color, members })
    }
  }

  const isValid = name && members.length >= 2

  return (
    <Modal onClose={() => setShowAddGrp(false)}>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 19, marginBottom: 18,
      }}>
        👥 New Group
      </h2>

      <div style={{ display: 'grid', gap: 14 }}>
                <div>
          <Label>Group Name</Label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. College Squad"
            style={inputStyle}
          />
        </div>

                <div>
          <Label>Choose an Emoji</Label>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {GROUP_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  fontSize: 18,
                  background: emoji === e ? `${C.ACCENT}30` : C.CARD,
                  border: `1px solid ${emoji === e ? C.ACCENT : C.BORDER}`,
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

                <div>
          <Label>Group Color</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            {GROUP_COLORS.map(col => (
              <button
                key={col}
                onClick={() => setColor(col)}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: col,
                  border: `3px solid ${color === col ? '#fff' : 'transparent'}`,
                  transition: 'border 0.15s',
                }}
              />
            ))}
          </div>
        </div>

                <div>
          <Label>Members (min 2)</Label>

                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
            {members.map(m => (
              <span
                key={m}
                style={{
                  padding:      '3px 9px',
                  borderRadius: 20,
                  fontSize:     11,
                  background:   `${C.GREEN}20`,
                  color:        C.GREEN,
                  border:       `1px solid ${C.GREEN}40`,
                  display:      'inline-flex',
                  alignItems:   'center',
                  gap:          4,
                }}
              >
                {m}
                {m !== 'Yatharth' && (
                  <span
                    onClick={() => removeMember(m)}
                    style={{ cursor: 'pointer', fontWeight: 700, marginLeft: 2 }}
                  >
                    ×
                  </span>
                )}
              </span>
            ))}
          </div>

                    <div style={{ display: 'flex', gap: 6 }}>
            <input
              value={memberInp}
              onChange={e => setMemberInp(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addMember()}
              placeholder="Add a member name"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={addMember}
              style={{
                background:   C.ACCENT,
                color:        '#fff',
                padding:      '0 14px',
                borderRadius: 8,
                fontWeight:   600,
                fontSize:     13,
              }}
            >
              Add
            </button>
          </div>
        </div>

                <button
          onClick={handleSubmit}
          style={{
            background:   C.ACCENT,
            color:        '#fff',
            padding:      '12px',
            borderRadius: 10,
            fontWeight:   700,
            fontSize:     14,
            marginTop:    4,
            boxShadow:    `0 0 18px ${C.ACCENT}50`,
            opacity:      isValid ? 1 : 0.45,
            cursor:       isValid ? 'pointer' : 'not-allowed',
          }}
        >
          Create Group 🚀
        </button>
      </div>
    </Modal>
  )
}

function Label({ children }) {
  return (
    <div style={{ color: COLORS.MUTED, fontSize: 11, marginBottom: 6 }}>
      {children}
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div
      onClick={onClose}
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
          padding:      '22px',
          border:       `1px solid ${COLORS.BORDER}`,
          width:        '100%',
          maxWidth:     420,
          maxHeight:    '88vh',
          overflowY:    'auto',
          boxShadow:    '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
