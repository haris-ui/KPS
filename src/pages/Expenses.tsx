import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Receipt, Filter, Camera, Loader2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ExpensesPage = () => {
  const { expenses, fetchStats } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: 'Utilities',
    amount: 0,
    note: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    const { error } = await supabase.from('expenses').insert([newExpense])
    if (!error) {
      await fetchStats()
      setShowAddModal(false)
      setNewExpense({ category: 'Utilities', amount: 0, note: '', date: new Date().toISOString().split('T')[0] })
    }
    setIsAdding(false)
  }

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div>
          <h2 style={{ color: 'var(--accent)' }}>EXPENSE JOURNAL</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Track operational costs and overheads</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> LOG EXPENSE
        </button>
      </div>

      <div className="grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(224, 108, 117, 0.1)', padding: '1rem', borderRadius: '12px' }}>
            <Receipt color="var(--error)" size={32} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Total</p>
            <h3 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>Rs. {totalExpenses.toLocaleString()}</h3>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(0, 173, 181, 0.1)', padding: '1rem', borderRadius: '12px' }}>
            <Filter color="var(--accent)" size={32} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Expense Records</p>
            <h3 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>{expenses.length} Entries</h3>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container" style={{ margin: 0, border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Date & ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{new Date(exp.date).toLocaleDateString('en-GB')}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>#{exp.id.slice(0,6)}</div>
                  </td>
                  <td>
                    <span className="status-label" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff' }}>
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', color: 'var(--text-muted)' }}>{exp.note}</td>
                  <td style={{ fontWeight: 700, color: 'var(--error)' }}>Rs. {exp.amount.toLocaleString()}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem', width: 'auto' }}><Camera size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="mobile-nav-overlay animate-fade" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Log Expense Entry</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Date of Expense</label>
                <input type="date" required value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="input" />
              </div>

              <div className="input-group">
                <label className="input-label">Expense Category</label>
                <select className="input" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                  <option>Utilities</option>
                  <option>Rent</option>
                  <option>Salaries</option>
                  <option>Logistics</option>
                  <option>Feed & Stock</option>
                  <option>Miscellaneous</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Expense Amount (Rs.)</label>
                <input type="number" required value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} className="input" />
              </div>
              
              <div className="input-group">
                <label className="input-label">Brief Description / Note</label>
                <textarea rows={3} value={newExpense.note} onChange={e => setNewExpense({...newExpense, note: e.target.value})} className="input" style={{ resize: 'none' }} placeholder="Detail of expenditure..." />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isAdding} style={{ height: '3.5rem', marginTop: '1rem' }}>
                {isAdding ? <Loader2 className="animate-spin" /> : 'POST EXPENSE RECORD'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpensesPage
