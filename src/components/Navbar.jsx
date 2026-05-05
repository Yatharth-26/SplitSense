import { useNavigate, useLocation } from 'react-router-dom'
import { COLORS } from '../utils/constants'

const C = COLORS

export default function Navbar({ theme, toggleTheme }) {
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
        <button
          onClick={toggleTheme}
          className="pill-button"
          style={{
            background: C.CARD,
            color: C.TEXT,
            border: `1px solid ${C.BORDER}`,
          }}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

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
