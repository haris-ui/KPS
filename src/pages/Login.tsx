import React from 'react'
import { useStore } from '../store/useStore'
import { LogIn } from 'lucide-react'

const LoginPage = () => {
  const { setUser } = useStore()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setUser({
      id: '1',
      name: 'Admin User',
      role: 'admin'
    })
  }

  return (
    <div className="login-page" style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Grid Background */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        opacity: 0.5
      }} />

      <div className="glass-card animate-scale-in" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        textAlign: 'center', 
        background: 'rgba(5, 5, 5, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        zIndex: 1
      }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '100px', height: '100px',
            background: '#ffffff',
            borderRadius: '1.5rem', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 1.5rem',
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.2)',
            transform: 'rotate(5deg)',
            overflow: 'hidden'
          }} className="animate-float">
            <img src="/Logo.png" alt="Kashif Poultry Shop Logo" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
          </div>
          <h1 className="gradient-text animate-typewriter" style={{ fontSize: '2rem', margin: '0 auto', whiteSpace: 'nowrap' }}>Kashif Poultry Shop</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.75rem' }}>Premium Quality Management</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.5rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Administrator Access</label>
            <div 
              style={{
                width: '100%', padding: '1rem', borderRadius: '1rem', 
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', 
                color: 'white', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}
            >
              <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }} />
              SUPER USER PORTAL
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', marginBottom: '0.5rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Security Key</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="glass"
              style={{
                width: '100%', padding: '1rem', borderRadius: '1rem', 
                border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', 
                color: 'white', outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1rem', letterSpacing: '0.1em' }}>
            <LogIn size={20} />
            ESTABLISH CONNECTION
          </button>
        </form>

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.05em' }}>v2.4.1 KPS-SECURE</span>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
