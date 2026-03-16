import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, Package, Users, Receipt, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/' },
    { icon: <ShoppingCart size={18} />, label: 'POS Terminal', path: '/pos' },
    { icon: <Package size={18} />, label: 'Inventory', path: '/inventory' },
    { icon: <Users size={18} />, label: 'B2B Clients', path: '/clients' },
    { icon: <Receipt size={18} />, label: 'Expenses', path: '/expenses' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem' }}>
      
      {/* Brand Header */}
      <div style={{ marginBottom: '3rem', padding: '0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          width: '36px', height: '36px', background: '#fff', borderRadius: '2px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR6R1ZiuxJXP-tMuvdgKWoZIhPBDqyyWuhHQ&s" alt="Logo" style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1 }}>Kashif Poultry</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.2rem' }}>Retail & Distribution</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.875rem 1rem', borderRadius: '4px',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              background: isActive ? 'var(--bg-subtle)' : 'transparent',
              border: '1px solid',
              borderColor: isActive ? 'var(--border-highlight)' : 'transparent',
              transition: 'all 0.15s ease',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '1rem 0' }}>
        <button 
          className="btn-ghost" 
          onClick={() => { supabase.auth.signOut(); onClose?.(); }}
          style={{ width: '100%', justifyContent: 'flex-start', border: 'none', color: 'var(--error)', padding: '0.75rem 1rem', fontSize: '0.875rem' }}
        >
          <LogOut size={18} />
          <span>Logout Securely</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar