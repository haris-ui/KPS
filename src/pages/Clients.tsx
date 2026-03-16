import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Search, Users, CreditCard, ArrowDownRight, ArrowUpRight, Loader2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ClientsPage = () => {
  const { clients, fetchStats } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newClient, setNewClient] = useState({
    name: '',
    contact: '',
    credit_limit: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    const { error } = await supabase.from('clients').insert([newClient])
    if (!error) {
      await fetchStats()
      setShowAddModal(false)
      setNewClient({ name: '', contact: '', credit_limit: 0 })
    }
    setIsAdding(false)
  }

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalReceivables = clients.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0)
  const totalCredits = clients.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0)

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h2 style={{ color: 'var(--accent)' }}>B2B PARTNERS</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Manage wholesale clients and credit lines</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> REGISTER PARTNER
        </button>
      </div>

      <div className="grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
            <ArrowDownRight size={80} color="var(--error)" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Receivables</p>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem', color: 'var(--error)' }}>Rs. {totalReceivables.toLocaleString()}</h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Outstanding debts from clients</p>
        </div>
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1 }}>
            <ArrowUpRight size={80} color="var(--success)" />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Credits</p>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.5rem', color: 'var(--success)' }}>Rs. {totalCredits.toLocaleString()}</h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Advance payments held</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              className="input" 
              placeholder="Search by business or person..." 
              style={{ paddingLeft: '3rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid" style={{ padding: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {filteredClients.map(client => (
            <div key={client.id} className="card" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users color="white" size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#fff' }}>{client.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{client.contact}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Balance</p>
                  <p style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 800, 
                    color: client.balance < 0 ? 'var(--error)' : client.balance > 0 ? 'var(--success)' : 'inherit' 
                  }}>
                    Rs. {Math.abs(client.balance).toLocaleString()}
                    {client.balance < 0 ? ' (Dr)' : client.balance > 0 ? ' (Cr)' : ''}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}>
                  <CreditCard size={14} /> LEDGER
                </button>
                <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}>
                  SETTLE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="mobile-nav-overlay animate-fade" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Register Client Partner</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Business Name / Person</label>
                <input required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="input" placeholder="e.g. Al-Madina Poultry" />
              </div>
              
              <div className="input-group">
                <label className="input-label">Contact Information</label>
                <input required value={newClient.contact} onChange={e => setNewClient({...newClient, contact: e.target.value})} className="input" placeholder="Phone or WhatsApp" />
              </div>

              <div className="input-group">
                <label className="input-label">Credit Limit (Rs.)</label>
                <input type="number" required value={newClient.credit_limit} onChange={e => setNewClient({...newClient, credit_limit: Number(e.target.value)})} className="input" />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isAdding} style={{ height: '3.5rem', marginTop: '1rem' }}>
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