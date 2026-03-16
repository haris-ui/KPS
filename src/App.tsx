import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import { supabase } from './lib/supabase'
import Layout from './components/Layout'
import LoginPage from './pages/Login'
import InventoryPage from './pages/Inventory'
import POSPage from './pages/POS'
import ClientsPage from './pages/Clients'
import ExpensesPage from './pages/Expenses'

const DashboardPage = () => {
  const { products, stats, fetchStats } = useStore()
  
  useEffect(() => {
    fetchStats()
  }, [])

  const stockValue = products.reduce((acc, p) => acc + p.buy_price * p.stock, 0)
  const totalItems = products.reduce((acc, p) => acc + p.stock, 0)
  const lowStockCount = products.filter(p => p.stock < 20).length

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>Business Overview</h2>
      <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.2), transparent)', marginBottom: '2rem', animation: 'lineIn 0.8s ease forwards' }} />
      <div className="grid-cols-auto">
        <div className="glass-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Sales (Today)</p>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem', fontWeight: 700 }}>Rs. {stats.todaySales.toLocaleString()}</h3>
          <div style={{ color: 'var(--success)', fontSize: '0.75rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>↑ Updated live</div>
        </div>
        <div className="glass-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Stock</p>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem', fontWeight: 700 }}>{totalItems.toLocaleString()} KG</h3>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem' }}>{products.length} product categories</div>
        </div>
        <div className="glass-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stock Value</p>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem', fontWeight: 700 }}>Rs. {stockValue.toLocaleString()}</h3>
          <div style={{ fontSize: '0.75rem', marginTop: '1rem', color: lowStockCount > 0 ? 'var(--error)' : 'var(--text-muted)' }}>
            {lowStockCount > 0 ? `${lowStockCount} items low in stock` : 'Inventory healthy'}
          </div>
        </div>
        <div className="glass-card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active B2B Clients</p>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem', fontWeight: 700 }}>{stats.clientCount} Partners</h3>
          <div style={{ color: stats.totalReceivables > 0 ? 'var(--error)' : 'var(--success)', fontSize: '0.75rem', marginTop: '1rem' }}>
            Rs. {stats.totalReceivables.toLocaleString()} receivables
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', letterSpacing: '0.05em', fontSize: '0.875rem' }}>[ SALES TRENDS CHART — COMING SOON ]</p>
      </div>
    </div>
  )
}


const Dashboard = () => <Layout><DashboardPage /></Layout>
const InventoryPageWrapper = () => <Layout><InventoryPage /></Layout>
const POS = () => <Layout><POSPage /></Layout>
const Clients = () => <Layout><ClientsPage /></Layout>
const Expenses = () => <Layout><ExpensesPage /></Layout>

function App() {
  const { user, setUser, fetchProducts } = useStore()

  useEffect(() => {
    // Check active sessions and set up listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthStateChange(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthStateChange = async (session: any) => {
    if (session?.user) {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUser({
        id: session.user.id,
        name: profile?.name || session.user.email?.split('@')[0] || 'User',
        role: profile?.role || 'staff'
      })
      fetchProducts()
    } else {
      setUser(null)
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/pos" element={user ? <POS /> : <Navigate to="/login" />} />
        <Route path="/inventory" element={user ? <InventoryPageWrapper /> : <Navigate to="/login" />} />
        <Route path="/clients" element={user ? <Clients /> : <Navigate to="/login" />} />
        <Route path="/expenses" element={user ? <Expenses /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
