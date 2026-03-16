import { useState, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      
      {/* Mobile Header */}
      <div className="mobile-only glass" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '64px', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 1.25rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR6R1ZiuxJXP-tMuvdgKWoZIhPBDqyyWuhHQ&s" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Kashif Poultry</h2>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.25rem' }}
          >
            {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="mobile-only"
          onClick={() => setIsSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 140 }}
        />
      )}

      {/* Sidebar Container uses CSS for positioning! */}
      <div className={`layout-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content uses CSS for margins! */}
      <main className="layout-main">
        {children}
      </main>

    </div>
  )
}

export default Layout