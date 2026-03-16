import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Search, TrendingDown, TrendingUp, History, Wallet, Loader2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ClientsPage = () => {
  const { clients, fetchClients, isLoading } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    contact: '',
    balance: 0,
    credit_limit: 50000
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    try {
      const { error } = await supabase
        .from('clients')
        .insert([newClient])
      
      if (error) throw error
      await fetchClients()
      setShowAddModal(false)
      setNewClient({ name: '', contact: '', balance: 0, credit_limit: 50000 })
    } catch (error) {
      console.error('Adding client failed:', error)
      alert('Failed to add client')
    } finally {
      setIsAdding(false)
    }
  }

  const totalReceivables = clients.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0)
  const totalCredits = clients.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0)

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="clients-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>B2B Client Management</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          NEW CLIENT
        </button>
      </div>

      <div className="grid-cols-auto" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: totalReceivables > 0 ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '1rem', color: totalReceivables > 0 ? 'var(--error)' : 'var(--text-muted)' }}>
            <TrendingDown size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Receivables</p>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: totalReceivables > 0 ? 'var(--error)' : 'inherit' }}>Rs. {totalReceivables.toLocaleString()}</h4>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', color: 'var(--primary)' }} className="animate-float">
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Security Deposits</p>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Rs. {totalCredits.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
          <input 
            type="text" 
            placeholder="Search hotels, restaurants, and wholesalers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '1rem',
              background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', outline: 'none',
              fontSize: '0.95rem'
            }}
          />
        </div>
      </div>

      <div className="grid-cols-auto">
        {isLoading && clients.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto' }} size={32} />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>SYNCHRONIZING CLIENT DATA...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
            <Search style={{ margin: '0 auto', opacity: 0.2 }} size={48} />
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>No clients found matching your search.</p>
          </div>
        ) : filteredClients.map(client => (
          <div key={client.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: isLoading ? 0.7 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{client.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{client.contact}</p>
              </div>
              <div style={{ 
                padding: '0.5rem 0.875rem', borderRadius: '0.75rem', 
                background: client.balance < 0 ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255,255,255,0.05)',
                color: client.balance < 0 ? 'var(--error)' : 'var(--text)',
                fontWeight: 800,
                fontSize: '0.8rem',
                border: `1px solid ${client.balance < 0 ? 'rgba(255,77,77,0.2)' : 'rgba(255,255,255,0.1)'}`,
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                {client.balance < 0 ? `DEBT: Rs. ${Math.abs(client.balance).toLocaleString()}` : `CRED: Rs. ${client.balance.toLocaleString()}`}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>Credit Utilization</span>
                <span>{Math.round(Math.min(100, (Math.abs(client.balance) / client.credit_limit) * 100))}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min(100, (Math.abs(client.balance) / client.credit_limit) * 100)}%`,
                  background: Math.abs(client.balance) > client.credit_limit * 0.8 ? 'var(--error)' : '#ffffff',
                  boxShadow: Math.abs(client.balance) > client.credit_limit * 0.8 ? '0 0 10px rgba(255,77,77,0.3)' : '0 0 10px rgba(255,255,255,0.2)'
                }} />
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 500 }}>
              LIMIT: Rs. {client.credit_limit.toLocaleString()}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1, padding: '0.75rem', fontSize: '0.8rem' }}>
                <History size={16} />
                LEDGER
              </button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.8rem' }}>
                <Wallet size={16} />
                PAYMENT
              </button>
            </div>
          </div>
        ))}
      </div>

    {showAddModal && (
        <div style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', position: 'relative', animation: 'scaleIn 0.3s ease' }}>
            <button 
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Register New Partner</h3>
            
            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Client/Business Name</label>
                <input 
                  type="text" required
                  value={newClient.name}
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                  placeholder="e.g. Grand Hyatt Hotel"
                  style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Contact Details</label>
                <input 
                  type="text" required
                  value={newClient.contact}
                  onChange={e => setNewClient({...newClient, contact: e.target.value})}
                  placeholder="+92 300 1234567"
                  style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Initial Balance</label>
                  <input 
                    type="number" required
                    value={newClient.balance}
                    onChange={e => setNewClient({...newClient, balance: Number(e.target.value)})}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}
                  />
                  <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Use negative for existing debt</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Credit Limit</label>
                  <input 
                    type="number" required min="0"
                    value={newClient.credit_limit}
                    onChange={e => setNewClient({...newClient, credit_limit: Number(e.target.value)})}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isAdding}
                style={{ height: '3.5rem', marginTop: '1rem' }}
              >
                {isAdding ? <Loader2 className="animate-spin" /> : 'CREATE CLIENT PROFILE'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientsPage
