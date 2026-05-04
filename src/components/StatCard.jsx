import { COLORS } from '../utils/constants'

const C = COLORS

export default function StatCard({ symbol, value, label, color }) {
  return (
    <div style={{
      background: C.CARD,
      borderRadius: 16,
      padding: '16px',
      border: `1px solid ${C.BORDER}`,
    }}>
      {symbol && (
        <div style={{
          color: color || C.TEXT,
          fontSize: 22,
          marginBottom: 6,
        }}>
          {symbol}
        </div>
      )}
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: 22,
        color: color || C.TEXT,
      }}>
        {value}
      </div>
      <div style={{ color: C.MUTED, fontSize: 12, marginTop: 2 }}>{label}</div>
    </div>
  )
}
