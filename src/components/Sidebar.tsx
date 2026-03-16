import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Package, Users, Receipt, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <ShoppingCart size={20} />, label: 'POS Terminal', path: '/pos' },
    { icon: <Package size={20} />, label: 'Inventory', path: '/inventory' },
    { icon: <Users size={20} />, label: 'B2B Clients', path: '/clients' },
    { icon: <Receipt size={20} />, label: 'Expenses', path: '/expenses' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '2rem 1rem' }}>
      
      {/* Brand Header */}
      <div style={{ marginBottom: '2.5rem', padding: '0 0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: '40px', height: '40px', background: '#fff', borderRadius: '0.75rem', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
        }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR6R1ZiuxJXP-tMuvdgKWoZIhPBDqyyWuhHQ&s" alt="KPS Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
        </div>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '1.2rem', lineHeight: 1.1, whiteSpace: 'nowrap' }}>Kashif Poultry Shop</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.2rem' }}>Quality Meats</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.875rem 1.25rem', borderRadius: '0.75rem',
              color: isActive ? '#ffffff' : 'var(--text-muted)',
              textDecoration: 'none',
              background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              fontWeight: isActive ? 600 : 400
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '1rem 0' }} />
      <button 
        className="btn btn-ghost" 
        onClick={() => { supabase.auth.signOut(); onClose?.(); }}
        style={{ width: '100%', justifyContent: 'flex-start', border: 'none', color: 'var(--error)', padding: '0.875rem 1.25rem' }}
      >
        <LogOut size={18} />
        <span style={{ fontSize: '0.875rem' }}>Logout Securely</span>
      </button>
    </div>
  )
}

export default Sidebar