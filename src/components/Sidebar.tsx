import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Receipt, 
  LogOut 
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const Sidebar = () => {

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <ShoppingCart size={20} />, label: 'POS Terminal', path: '/pos' },
    { icon: <Package size={20} />, label: 'Inventory', path: '/inventory' },
    { icon: <Users size={20} />, label: 'B2B Clients', path: '/clients' },
    { icon: <Receipt size={20} />, label: 'Expenses', path: '/expenses' },
  ]

  return (
    <div className="sidebar glass" style={{
      width: '280px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      position: 'fixed',
      left: 0,
      top: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
      animation: 'slideInLeft 0.4s cubic-bezier(0.22, 1, 0.36, 1) both'
    }}>
      <div style={{ marginBottom: '2.5rem', padding: '0 0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: '40px', height: '40px', background: '#fff', borderRadius: '0.75rem', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
          flexShrink: 0, boxShadow: '0 0 15px rgba(255,255,255,0.1)' 
        }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR6R1ZiuxJXP-tMuvdgKWoZIhPBDqyyWuhHQ&s" alt="KPS Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
        </div>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>Kashif Poultry Shop</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.2rem' }}>Quality Meats</p>
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1.25rem',
              borderRadius: '0.75rem',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              textDecoration: 'none',
              marginBottom: '0.5rem',
              background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
              boxShadow: isActive ? '0 4px 12px rgba(255,255,255,0.03)' : 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animationDelay: `${i * 0.08 + 0.1}s`
            })}
          >
            {({ isActive }) => (
              <>
                {item.icon}
                <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '1rem' }} />
      <button 
        className="btn btn-ghost" 
        onClick={() => supabase.auth.signOut()}
        style={{ width: '100%', justifyContent: 'flex-start', border: 'none', color: 'var(--error)', background: 'transparent' }}
      >
        <LogOut size={18} />
        <span style={{ fontSize: '0.875rem' }}>Logout Securely</span>
      </button>
    </div>
  )
}

export default Sidebar
