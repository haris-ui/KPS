import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import { Edit3, Trash2, TrendingUp, AlertCircle, Plus, Loader2 } from 'lucide-react'

const InventoryPage = () => {
  const { products, fetchProducts, isLoading } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const stockValue = products.reduce((acc, p) => acc + p.buy_price * p.stock, 0)
  const lowStockCount = products.filter(p => p.stock < 20).length

  const handlePriceChange = async (id: string, newPrice: number) => {
    setUpdatingId(id)
    try {
      const { error } = await supabase
        .from('products')
        .update({ sell_price: newPrice })
        .eq('id', id)
      
      if (error) throw error
      await fetchProducts()
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setUpdatingId(null)
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setUpdatingId(id)
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      await fetchProducts()
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="inventory-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Inventory Management</h2>
        <button className="btn btn-primary">
          <Plus size={20} />
          ADD PRODUCT
        </button>
      </div>

      <div className="grid-cols-auto" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', color: 'var(--primary)' }} className="animate-float">
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Valuation (Cost)</p>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Rs. {stockValue.toLocaleString()}</h4>
          </div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.875rem', background: lowStockCount > 0 ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '1rem', color: lowStockCount > 0 ? 'var(--error)' : 'var(--text-muted)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Stock Alerts</p>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: lowStockCount > 0 ? 'var(--error)' : 'inherit' }}>{lowStockCount} Critical</h4>
          </div>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--surface)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <tr>
              <th style={{ padding: '1.25rem 1.5rem' }}>PRODUCT IDENTIFIER</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>CATEGORY</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>BUY RATE</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>SELL RATE</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>QUANTITY</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>MARGIN</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>OPERATIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>FETCHING INVENTORY...</p>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No products found in database.
                </td>
              </tr>
            ) : products.map((product) => (
              <tr key={product.id} style={{ borderTop: '1px solid var(--border)', background: 'transparent', opacity: updatingId === product.id ? 0.5 : 1 }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{product.name}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>
                    {product.category}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rs. {product.buy_price}</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  {editingId === product.id ? (
                    <input 
                      type="number" 
                      defaultValue={product.sell_price}
                      onBlur={(e) => handlePriceChange(product.id, Number(e.target.value))}
                      onKeyDown={(e) => e.key === 'Enter' && handlePriceChange(product.id, Number(e.currentTarget.value))}
                      autoFocus
                      disabled={updatingId === product.id}
                      style={{ 
                        width: '100px', background: 'var(--background)', border: '1px solid rgba(255,255,255,0.3)', 
                        color: 'white', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', outline: 'none'
                      }}
                    />
                  ) : (
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>Rs. {product.sell_price}</span>
                  )}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.6rem',
                    borderRadius: '0.4rem',
                    background: product.stock < 20 ? 'rgba(255, 77, 77, 0.1)' : 'transparent',
                    color: product.stock < 20 ? 'var(--error)' : 'inherit',
                    fontWeight: product.stock < 20 ? 700 : 400
                  }}>
                    {product.stock} {product.unit}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--success)' }}>
                  +{(((product.sell_price - product.buy_price) / product.sell_price) * 100).toFixed(1)}%
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn-ghost" 
                      style={{ padding: '0.5rem', border: 'none' }} 
                      onClick={() => setEditingId(product.id)}
                      disabled={updatingId === product.id}
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      className="btn-ghost" 
                      style={{ padding: '0.5rem', border: 'none', color: 'var(--error)' }}
                      onClick={() => handleDelete(product.id)}
                      disabled={updatingId === product.id}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InventoryPage
