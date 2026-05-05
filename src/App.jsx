import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GroupProvider }    from './context/GroupContext'
import Navbar               from './components/Navbar'
import Toast                from './components/Toast'
import AddExpenseModal      from './components/modals/AddExpenseModal'
import AddGroupModal        from './components/modals/AddGroupModal'
import RoastModal           from './components/modals/RoastModal'
import Dashboard            from './pages/Dashboard'
import GroupPage            from './pages/GroupPage'
import ShameWall            from './pages/ShameWall'
import { useGroups }        from './context/GroupContext'


function AppShell({ theme, toggleTheme }) {
  const { showAddExp, showAddGrp, roastTarget } = useGroups()

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="page">
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/group/:id"    element={<GroupPage />} />
          <Route path="/shamewall"    element={<ShameWall />} />
        </Routes>
      </div>

      {showAddExp   && <AddExpenseModal />}
      {showAddGrp   && <AddGroupModal  />}
      {roastTarget  && <RoastModal     />}

      <Toast />
    </>
  )
}

export default function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <BrowserRouter>
      <GroupProvider>
        <AppShell theme={theme} toggleTheme={toggleTheme} />
      </GroupProvider>
    </BrowserRouter>
  )
}
