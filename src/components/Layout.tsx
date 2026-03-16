import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu, X, Store } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
        {/* Mobile Header */}
        <header className="mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--accent)', padding: '0.4rem', borderRadius: '6px', display: 'flex' }}>
              <Store size={18} color="white" />
            </div>
            <span style={{ fontWeight: 800, letterSpacing: '0.05em' }}>KPS</span>
          </div>
          <button 
            className="btn" 
            style={{ padding: '0.5rem', width: 'auto', border: 'none', background: 'transparent', color: 'var(--text-primary)' }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <section className="main-content">
          {children}
        </section>
      </main>
    </div>
  )
}

export default Layout