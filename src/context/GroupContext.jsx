import { createContext, useContext, useState, useEffect } from 'react'
import { DEMO_GROUPS } from '../data/demoData'


const GroupContext = createContext()


export function useGroups() {
  return useContext(GroupContext)
}

export function GroupProvider({ children }) {


  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('splitsense_groups')
      return saved ? JSON.parse(saved) : DEMO_GROUPS
    } catch {
      return DEMO_GROUPS
    }
  })


  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [showAddExp,      setShowAddExp]       = useState(false)
  const [showAddGrp,      setShowAddGrp]       = useState(false)
  const [roastTarget,     setRoastTarget]      = useState(null)
  const [toast,           setToast]            = useState(null)


  useEffect(() => {
    localStorage.setItem('splitsense_groups', JSON.stringify(groups))
  }, [groups])



  const selectedGroup = groups.find(g => g.id === selectedGroupId)


  const notify = (msg, color = '#FF6B35') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 2500)
  }


  const addExpense = (expense) => {
    setGroups(prev =>
      prev.map(g =>
        g.id === selectedGroupId
          ? { ...g, expenses: [...g.expenses, { ...expense, id: 'e' + Date.now() }] }
          : g
      )
    )
    setShowAddExp(false)
    notify('Expense added 💸')
  }


  const settleDebt = (groupId, expenseId, member) => {
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? {
              ...g,
              expenses: g.expenses.map(e =>
                e.id === expenseId
                  ? { ...e, settled: { ...e.settled, [member]: true } }
                  : e
              ),
            }
          : g
      )
    )
    notify(`${member} settled up! 🎉`, '#06D6A0')
  }


  const addGroup = (group) => {
    setGroups(prev => [
      ...prev,
      { ...group, id: 'g' + Date.now(), expenses: [], createdAt: new Date().toISOString() },
    ])
    setShowAddGrp(false)
    notify('Group created! 🙌', '#06D6A0')
  }


  const resetData = () => {
    setGroups(DEMO_GROUPS)
    notify('Reset to demo data')
  }


  const value = {
    groups,
    selectedGroup,
    selectedGroupId,
    setSelectedGroupId,
    showAddExp, setShowAddExp,
    showAddGrp, setShowAddGrp,
    roastTarget, setRoastTarget,
    toast,
    notify,
    addExpense,
    settleDebt,
    addGroup,
    resetData,
  }

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  )
}
