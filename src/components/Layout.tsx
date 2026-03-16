import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="layout-root">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR6R1ZiuxJXP-tMuvdgKWoZIhPBDqyyWuhHQ&s" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Kashif Poultry</h2>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn-ghost"
          style={{ padding: '0.4rem', border: 'none' }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 140 }}
        />
      )}

      {/* Sidebar Container */}
      <div className={`layout-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}

export default Layout