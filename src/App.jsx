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


function AppShell() {
  const { showAddExp, showAddGrp, roastTarget } = useGroups()

  return (
    <>
      <Navbar />

            <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px' }}>
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
  return (
    <BrowserRouter>
      <GroupProvider>
        <AppShell />
      </GroupProvider>
    </BrowserRouter>
  )
}
