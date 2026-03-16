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
    <div className="animate-fade">
      <div className="page-header">
        <h2>CLIENT PARTNERS</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          ADD PARTNER
        </button>
      </div>

      <div className="grid" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '2px', color: 'var(--text-secondary)' }}>
            <TrendingDown size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Market Receivables</p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Rs. {totalReceivables.toLocaleString()}</h4>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '2px', color: 'var(--text-secondary)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Advance Deposits</p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Rs. {totalCredits.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0.75rem', marginBottom: '2.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
          <input
            type="text"
            placeholder="SEARCH PARTNER NAME OR CONTACT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ paddingLeft: '3rem', background: 'transparent' }}
          />
        </div>
      </div>

      <div className="grid">
        {isLoading && clients.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '6rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto' }} size={32} />
            <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', letterSpacing: '0.1em' }}>RELOADING PARTNER PROFILES...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '6rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>NO MATCHING PROFILES FOUND</p>
          </div>
        ) : filteredClients.map(client => (
          <div key={client.id} className="card animate-slide" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>{client.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{client.contact}</p>
              </div>
              <div style={{
                padding: '0.5rem 0.75rem', borderRadius: '2px',
                background: client.balance < 0 ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)',
                border: client.balance < 0 ? '1px solid var(--error)' : '1px solid var(--success)',
                fontSize: '0.7rem', fontWeight: 800, color: client.balance < 0 ? 'var(--error)' : 'var(--success)'
              }}>
                {client.balance < 0 ? `DUE: Rs. ${Math.abs(client.balance).toLocaleString()}` : `CRED: Rs. ${client.balance.toLocaleString()}`}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>
                <span>Credit Utilization</span>
                <span>{Math.round(Math.min(100, (Math.abs(client.balance) / client.credit_limit) * 100))}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-main)', border: '1px solid var(--border-dim)', borderRadius: '1px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (Math.abs(client.balance) / client.credit_limit) * 100)}%`,
                  background: Math.abs(client.balance) > client.credit_limit * 0.8 ? 'var(--error)' : 'var(--accent)'
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1, height: '3rem' }}><History size={16} /> LEDGER</button>
              <button className="btn btn-ghost" style={{ flex: 1, height: '3rem' }}><Wallet size={16} /> BILLING</button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card animate-slide" style={{ width: '100%', maxWidth: '480px', position: 'relative', background: 'var(--bg-surface)' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '2.5rem', fontSize: '1.25rem', fontWeight: 800 }}>REGISTER PARTNER</h3>

            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Entity Name</label>
                <input type="text" required value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} className="input" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Contact Info</label>
                <input type="text" required value={newClient.contact} onChange={e => setNewClient({ ...newClient, contact: e.target.value })} className="input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Opening Balance</label>
                  <input type="number" required value={newClient.balance} onChange={e => setNewClient({ ...newClient, balance: Number(e.target.value) })} className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Limit</label>
                  <input type="number" required min="0" value={newClient.credit_limit} onChange={e => setNewClient({ ...newClient, credit_limit: Number(e.target.value) })} className="input" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isAdding} style={{ height: '4rem', marginTop: '1rem' }}>
                {isAdding ? <Loader2 className="animate-spin" /> : 'CONFIRM REGISTRATION'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientsPage