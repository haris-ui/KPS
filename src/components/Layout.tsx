import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: '280px',
        padding: '2.5rem',
        backgroundColor: 'var(--background)'
      }}>
        {children}
      </main>
    </div>
  )
}

export default Layout
