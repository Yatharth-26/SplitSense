import { useGroups } from '../context/GroupContext'

export default function Toast() {
  const { toast } = useGroups()
  if (!toast) return null

  return (
    <div
      className="pop-in"
      style={{
        position:   'fixed',
        top:        20,
        right:      20,
        zIndex:     9999,
        background: toast.color,
        color:      '#000',
        padding:    '10px 18px',
        borderRadius: 12,
        fontWeight: 600,
        fontSize:   14,
        boxShadow:  `0 4px 20px ${toast.color}60`,
      }}
    >
      {toast.msg}
    </div>
  )
}
