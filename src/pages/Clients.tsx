import { useState } from 'react'
import { Plus, Search, TrendingDown, TrendingUp, History, Wallet } from 'lucide-react'

interface Client {
  id: string;
  name: string;
  contact: string;
  balance: number;
  limit: number;
}

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients] = useState<Client[]>([
    { id: '1', name: 'Grand Royal Hotel', contact: '0123456789', balance: -25400, limit: 50000 },
    { id: '2', name: 'Paradise Restaurant', contact: '9876543210', balance: 8200, limit: 30000 },
    { id: '3', name: 'City Diner', contact: '5551234567', balance: -4850, limit: 15000 },
  ])
  const totalReceivables = clients.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0)
  const totalCredits = clients.reduce((acc, c) => acc + (c.balance > 0 ? c.balance : 0), 0)

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="clients-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>B2B Client Management</h2>
        <button className="btn btn-primary">
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
        {filteredClients.map(client => (
          <div key={client.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                <span>{Math.round(Math.min(100, (Math.abs(client.balance) / client.limit) * 100))}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--surface)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min(100, (Math.abs(client.balance) / client.limit) * 100)}%`,
                  background: Math.abs(client.balance) > client.limit * 0.8 ? 'var(--error)' : '#ffffff',
                  boxShadow: Math.abs(client.balance) > client.limit * 0.8 ? '0 0 10px rgba(255,77,77,0.3)' : '0 0 10px rgba(255,255,255,0.2)'
                }} />
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', fontWeight: 500 }}>
              LIMIT: Rs. {client.limit.toLocaleString()}
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
    </div>
  )
}

export default ClientsPage
