import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Receipt, Banknote, Calendar, Camera, Edit3, Loader2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ExpensesPage = () => {
  const { expenses, fetchExpenses, isLoading } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newExpense, setNewExpense] = useState({
    category: 'Utilities',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    note: '',
    has_receipt: false
  })

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    try {
      const { error } = await supabase
        .from('expenses')
        .insert([newExpense])
      
      if (error) throw error
      await fetchExpenses()
      setShowAddModal(false)
      setNewExpense({
        category: 'Utilities',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        note: '',
        has_receipt: false
      })
    } catch (error: any) {
      console.error('Adding expense failed:', error)
      alert(`Failed to log expense: ${error.message || 'Unknown error'}`)
    } finally {
      setIsAdding(false)
    }
  }

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)

  return (
    <div className="animate-fade">
      <div className="page-header">
        <h2>EXPENSE JOURNAL</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          LOG EXPENSE
        </button>
      </div>

      <div className="grid" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255, 59, 48, 0.1)', borderRadius: '2px', color: 'var(--error)' }}>
            <Banknote size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Total Outflow</p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Rs. {totalExpenses.toLocaleString()}</h4>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '2px', color: 'var(--text-secondary)' }}>
            <Receipt size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Documented Records</p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{expenses.filter(e => e.has_receipt).length} Receipts</h4>
          </div>
        </div>
      </div>

      <div className="table-container card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>POSTING DATE</th>
              <th>ACCOUNT / CAT</th>
              <th>REMARKS</th>
              <th>AMOUNT</th>
              <th>DOCUMENTATION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && expenses.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '4rem', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>RETRIEVING JOURNAL...</p>
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  NO EXPENSE RECORDS FOUND
                </td>
              </tr>
            ) : expenses.map((expense) => (
              <tr key={expense.id} className="animate-slide">
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Calendar size={14} style={{ opacity: 0.5 }} />
                    {expense.date}
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>
                    {expense.category}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  {expense.note || <span style={{ opacity: 0.3 }}>No remarks</span>}
                </td>
                <td style={{ fontWeight: 800, color: 'var(--error)', fontSize: '1rem' }}>
                  − Rs. {expense.amount.toLocaleString()}
                </td>
                <td>
                  {expense.has_receipt ? (
                    <button className="btn-ghost" style={{ padding: '0.35rem 0.6rem', fontSize: '0.65rem', borderRadius: '2px', fontWeight: 800 }}>
                      <Camera size={12} />
                      PREVIEW
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>No File</span>
                  )}
                </td>
                <td>
                  <button className="btn-ghost" style={{ padding: '0.5rem', border: 'none' }}>
                    <Edit3 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <h3 style={{ marginBottom: '2.5rem', fontSize: '1.25rem', fontWeight: 800 }}>LOG BUSINESS EXPENSE</h3>
            
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Category</label>
                  <select 
                    value={newExpense.category}
                    onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                    className="input"
                    style={{ appearance: 'none' }}
                  >
                    <option>Utilities</option>
                    <option>Labor</option>
                    <option>Transport</option>
                    <option>Rent</option>
                    <option>Feed</option>
                    <option>Medical</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Posting Date</label>
                  <input type="date" required value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="input" />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Amount (Rs.)</label>
                <input type="number" required min="0" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} className="input" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Business Remark</label>
                <textarea 
                  value={newExpense.note}
                  onChange={e => setNewExpense({...newExpense, note: e.target.value})}
                  rows={3}
                  className="input"
                  placeholder="Enter expense details..."
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                <input 
                  type="checkbox" 
                  id="has_receipt"
                  checked={newExpense.has_receipt}
                  onChange={e => setNewExpense({...newExpense, has_receipt: e.target.checked})}
                />
                <label htmlFor="has_receipt" style={{ fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Receipt Attached</label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isAdding} style={{ height: '4rem', marginTop: '1rem' }}>
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
