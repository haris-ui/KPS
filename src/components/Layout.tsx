import { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Mobile Header */}
      <div className="mobile-only glass" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '64px',
        zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 1.25rem',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR6R1ZiuxJXP-tMuvdgKWoZIhPBDqyyWuhHQ&s" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Kashif Poultry</h2>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ background: 'none', border: 'none', color: 'white' }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="mobile-only"
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
            backdropFilter: 'blur(4px)', zIndex: 140
          }}
        />
      )}

      {/* Sidebar - Shared component with visibility control */}
      <div className={`${isSidebarOpen ? 'show' : ''}`} style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 150,
        transform: 'translateX(0)',
        transition: 'transform 0.3s ease',
        width: '280px',
      }}>
        <div className="desktop-only" style={{ height: '100%' }}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
        {isSidebarOpen && (
          <div className="mobile-only" style={{ height: '100%' }}>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        )}
      </div>

      <main style={{ 
        flex: 1, 
        marginLeft: 'var(--sidebar-offset, 280px)',
        padding: '2.5rem',
        backgroundColor: 'var(--background)',
        transition: 'margin-left 0.3s ease'
      }}>
        <style dangerouslySetInnerHTML={{ __html: `
          :root { --sidebar-offset: 280px; }
          @media (max-width: 768px) {
            :root { --sidebar-offset: 0px; }
            main { padding: 1.25rem !important; margin-left: 0 !important; }
            .sidebar { 
              transform: translateX(${isSidebarOpen ? '0' : '-100%'}) !important; 
              width: 280px !important;
            }
          }
        `}} />
        {children}
      </main>
    </div>
  )
}

export default Layout
