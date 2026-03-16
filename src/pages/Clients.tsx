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
      const { error } = await supabase.from('clients').insert([newClient])
      if (error) throw error
      await fetchClients()
      setShowAddModal(false)
      setNewClient({ name: '', contact: '', balance: 0, credit_limit: 50000 })
    } catch (error: any) {
      alert(`Failed to add client: ${error.message || 'Unknown error'}`)
    } finally {
      setIsAdding(false)
    }
  }

  const totalReceivables = clients.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0)
  const totalCredits = clients.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0)
  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <div className="page-header">
        <h2>B2B Client Management</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          NEW CLIENT
        </button>
      </div>

      <div className="grid-cols-auto" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', border: '1px solid var(--border-highlight)', borderRadius: '0.75rem' }}>
            <TrendingDown size={20} color="var(--text-secondary)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Receivables</p>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Rs. {totalReceivables.toLocaleString()}</h4>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', border: '1px solid var(--border-highlight)', borderRadius: '0.75rem' }}>
            <TrendingUp size={20} color="var(--text-secondary)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Deposits</p>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Rs. {totalCredits.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
        <input
          type="text"
          placeholder="Search hotels, restaurants, and wholesalers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="grid-cols-auto">
        {isLoading && clients.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto', color: 'var(--text-secondary)' }} size={32} />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
            <Search style={{ margin: '0 auto', color: 'var(--border-highlight)' }} size={48} />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>No clients found matching your search.</p>
          </div>
        ) : filteredClients.map(client => (
          <div key={client.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{client.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>{client.contact}</p>
              </div>
              <div style={{
                padding: '0.25rem 0.5rem', borderRadius: '0.25rem',
                background: client.balance < 0 ? 'var(--bg-color)' : 'var(--bg-color)',
                border: `1px solid var(--border-color)`,
                fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase'
              }}>
                {client.balance < 0 ? `DEBT: Rs. ${Math.abs(client.balance).toLocaleString()}` : `CRED: Rs. ${client.balance.toLocaleString()}`}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <span>Credit Utilization</span>
                <span>{Math.round(Math.min(100, (Math.abs(client.balance) / client.credit_limit) * 100))}%</span>
              </div>
              <div style={{ height: '4px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (Math.abs(client.balance) / client.credit_limit) * 100)}%`,
                  background: Math.abs(client.balance) > client.credit_limit * 0.8 ? 'var(--text-primary)' : 'var(--text-secondary)'
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }}><History size={16} /> Ledger</button>
              <button className="btn btn-ghost" style={{ flex: 1 }}><Wallet size={16} /> Payment</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 600 }}>Register New Partner</h3>

            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Business Name</label>
                <input
                  type="text" required value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                  className="search-input" style={{ padding: '0.75rem 1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Contact Details</label>
                <input
                  type="text" required value={newClient.contact} onChange={e => setNewClient({ ...newClient, contact: e.target.value })}
                  className="search-input" style={{ padding: '0.75rem 1rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Initial Balance</label>
                  <input
                    type="number" required value={newClient.balance} onChange={e => setNewClient({ ...newClient, balance: Number(e.target.value) })}
                    className="search-input" style={{ padding: '0.75rem 1rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Credit Limit</label>
                  <input
                    type="number" required min="0" value={newClient.credit_limit} onChange={e => setNewClient({ ...newClient, credit_limit: Number(e.target.value) })}
                    className="search-input" style={{ padding: '0.75rem 1rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isAdding} style={{ height: '3rem', marginTop: '1rem' }}>
                {isAdding ? <Loader2 className="animate-spin" /> : 'CREATE PROFILE'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientsPage