import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Receipt, Banknote, Tag, Calendar, Camera, Edit3, Loader2, X } from 'lucide-react'
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
    } catch (error) {
      console.error('Adding expense failed:', error)
      alert('Failed to log expense')
    } finally {
      setIsAdding(false)
    }
  }

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)

  return (
    <div className="expenses-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Expense Log</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          LOG EXPENSE
        </button>
      </div>

      <div className="grid-cols-auto" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: 'rgba(255, 77, 77, 0.1)', borderRadius: '1rem', color: 'var(--error)' }}>
            <Banknote size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Outflow</p>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Rs. {totalExpenses.toLocaleString()}</h4>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', color: 'var(--text-muted)' }}>
            <Receipt size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Receipt Retention</p>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{expenses.filter(e => e.has_receipt).length} Records</h4>
          </div>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--surface)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <tr>
              <th style={{ padding: '1.25rem 1.5rem' }}>DATE</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>CATEGORY</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>DESCRIPTION</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>AMOUNT</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>DOCUMENT</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && expenses.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>RETRIEVING RECORDS...</p>
                </td>
              </tr>
            ) : expenses.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No outflow records found.
                </td>
              </tr>
            ) : expenses.map((expense) => (
              <tr key={expense.id} style={{ borderTop: '1px solid var(--border)', background: 'transparent' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 500 }}>
                    <Calendar size={14} style={{ opacity: 0.5 }} />
                    {expense.date}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Tag size={14} style={{ color: '#ffffff' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{expense.category}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  {expense.note}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: 'var(--error)', fontSize: '1rem' }}>
                  − Rs. {expense.amount.toLocaleString()}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  {expense.has_receipt ? (
                    <button className="btn-ghost" style={{ padding: '0.4rem 0.75rem', fontSize: '0.7rem', borderRadius: '0.5rem', fontWeight: 700 }}>
                      <Camera size={14} />
                      PREVIEW
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.05em' }}>NO FILE</span>
                  )}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <button className="btn-ghost" style={{ padding: '0.5rem', border: 'none', background: 'transparent' }}>
                    <Edit3 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Log Business Expense</h3>
            
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Category</label>
                  <select 
                    value={newExpense.category}
                    onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}
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
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Date</label>
                  <input 
                    type="date" required
                    value={newExpense.date}
                    onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                    style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Amount (Rs.)</label>
                <input 
                  type="number" required min="0"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                  style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Description / Note</label>
                <textarea 
                  value={newExpense.note}
                  onChange={e => setNewExpense({...newExpense, note: e.target.value})}
                  rows={3}
                  placeholder="What was this expense for?"
                  style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                <input 
                  type="checkbox" 
                  id="has_receipt"
                  checked={newExpense.has_receipt}
                  onChange={e => setNewExpense({...newExpense, has_receipt: e.target.checked})}
                />
                <label htmlFor="has_receipt" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>Receipt Available</label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isAdding}
                style={{ height: '3.5rem', marginTop: '1rem' }}
              >
                {isAdding ? <Loader2 className="animate-spin" /> : 'CONFIRM EXPENSE'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpensesPage
