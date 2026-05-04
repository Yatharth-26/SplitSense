import { useState } from 'react'
import { COLORS, CATEGORIES, inputStyle } from '../../utils/constants'
import { useGroups } from '../../context/GroupContext'

const C = COLORS

export default function AddExpenseModal() {
  const { selectedGroup, addExpense, setShowAddExp } = useGroups()

  const [form, setForm] = useState({
    name:     '',
    amount:   '',
    category: 'food',
    paidBy:   selectedGroup?.members[0] || '',
  })

  const set = (key) => (value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    if (!form.name || !form.amount) return


    const settled = {}
    selectedGroup.members.forEach(m => (settled[m] = m === form.paidBy))

    addExpense({
      name:     form.name,
      amount:   parseFloat(form.amount),
      category: form.category,
      paidBy:   form.paidBy,
      date:     new Date().toISOString().split('T')[0],
      settled,
    })
  }

  if (!selectedGroup) return null

  const isValid = form.name && form.amount

  return (
    <Modal onClose={() => setShowAddExp(false)}>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 19, marginBottom: 18,
      }}>
        ➕ Add Expense
      </h2>

      <div style={{ display: 'grid', gap: 14 }}>
                <div>
          <Label>Expense Name</Label>
          <input
            value={form.name}
            onChange={e => set('name')(e.target.value)}
            placeholder="e.g. Pizza Night"
            style={inputStyle}
          />
        </div>

                <div>
          <Label>Amount (₹)</Label>
          <input
            value={form.amount}
            onChange={e => set('amount')(e.target.value)}
            type="number"
            placeholder="0"
            style={inputStyle}
          />
        </div>

                <div>
          <Label>Category</Label>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => set('category')(cat.id)}
                style={{
                  padding:      '5px 11px',
                  borderRadius: 20,
                  fontSize:     12,
                  fontWeight:   500,
                  background:   form.category === cat.id ? `${C.ACCENT}25` : C.CARD,
                  color:        form.category === cat.id ? C.ACCENT : C.MUTED,
                  border:       `1px solid ${form.category === cat.id ? C.ACCENT : C.BORDER}`,
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

                <div>
          <Label>Paid By</Label>
          <select
            value={form.paidBy}
            onChange={e => set('paidBy')(e.target.value)}
            style={{ ...inputStyle, appearance: 'none' }}
          >
            {selectedGroup.members.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

                <button
          onClick={handleSubmit}
          style={{
            background:    C.ACCENT,
            color:         '#fff',
            padding:       '12px',
            borderRadius:  10,
            fontWeight:    700,
            fontSize:      14,
            marginTop:     4,
            boxShadow:     `0 0 18px ${C.ACCENT}50`,
            opacity:       isValid ? 1 : 0.45,
            cursor:        isValid ? 'pointer' : 'not-allowed',
          }}
        >
          Add Expense 💸
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
