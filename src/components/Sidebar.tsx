import { useNavigate, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Receipt, 
  LogOut,
  ChevronRight,
  Store
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, setUser } = useStore()

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'POS Terminal', path: '/pos' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Users, label: 'B2B Partners', path: '/clients' },
    { icon: Receipt, label: 'Expense Log', path: '/expenses' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="mobile-nav-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
        {/* Brand Section */}
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'var(--accent)', 
              padding: '0.5rem', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Store color="white" size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>Kashif PS</h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>Enterprise SCM</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1.5rem 1rem' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <button
                    onClick={() => { navigate(item.path); setIsOpen(false); }}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: isActive ? 'rgba(0, 173, 181, 0.1)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 500,
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                        e.currentTarget.style.color = '#ffffff'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--text-muted)'
                      }
                    }}
                  >
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                    {isActive && <div style={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: '20%', 
                      bottom: '20%', 
                      width: '3px', 
                      background: 'var(--accent)',
                      borderRadius: '0 4px 4px 0'
                    }} />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer / User Profile */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(0,0,0,0.2)', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem' 
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>LoggedIn as</p>
            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: 'rgba(224, 108, 117, 0.1)',
              color: 'var(--error)',
              border: '1px solid rgba(224, 108, 117, 0.2)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={16} />
            SIGN OUT
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar