import { useNavigate, useLocation } from 'react-router-dom'
import { COLORS } from '../utils/constants'

const C = COLORS

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const current = location.pathname

  const tabs = [
    { path: '/', label: 'Home' },
    { path: '/shamewall', label: 'Shame Wall' },
  ]

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')}>
        Split<span style={{ color: C.ACCENT }}>Sense</span>
      </div>

      <div className="row">
        {tabs.map(t => {
          const active = current === t.path

          return (
            <button
              key={t.path}
              onClick={() => navigate(t.path)}
              className="pill-button"
              style={{
                background: active ? C.ACCENT : 'transparent',
                color: active ? '#fff' : C.MUTED,
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
