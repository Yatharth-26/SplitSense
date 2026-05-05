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
      {/* Navbar ko theme button ka data yaha se milta hai */}
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

      {/* Toast chhota popup message dikhata hai */}
      <Toast />
    </>
  )
}

export default function App() {
  const [theme, setTheme] = useState('dark')

  // Theme ko body par lagate hai, phir CSS colors change hote hai
  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  // Button click par dark aur light mode switch hota hai
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
