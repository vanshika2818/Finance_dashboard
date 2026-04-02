import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import { useEffect, useState } from 'react'
import { useStore } from './store/useStore'

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const theme = useStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    const id = window.setTimeout(() => {
      useStore.getState().setIsLoading(false)
    }, 1500)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      {activePage === 'Dashboard' ? <Dashboard /> : <Transactions />}
    </Layout>
  )
}
