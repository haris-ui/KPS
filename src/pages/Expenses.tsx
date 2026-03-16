import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Receipt, Banknote, Tag, Calendar, Camera, Edit3, Loader2 } from 'lucide-react'

const ExpensesPage = () => {
  const { expenses, fetchExpenses, isLoading } = useStore()

  useEffect(() => {
    fetchExpenses()
  }, [])

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0)

  return (
    <div className="expenses-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Expense Log</h2>
        <button className="btn btn-primary">
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
    </div>
  )
}

export default ExpensesPage
