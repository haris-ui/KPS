import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import { Edit3, Trash2, TrendingUp, AlertCircle, Plus, Loader2, X } from 'lucide-react'

const InventoryPage = () => {
  const { products, fetchProducts, isLoading } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Poultry',
    buy_price: 0,
    sell_price: 0,
    unit: 'KG' as 'KG' | 'Piece',
    stock: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdatingId('adding')
    try {
      const { error } = await supabase
        .from('products')
        .insert([newProduct])
      
      if (error) throw error
      await fetchProducts()
      setShowAddModal(false)
      setNewProduct({ name: '', category: 'Poultry', buy_price: 0, sell_price: 0, unit: 'KG', stock: 0 })
    } catch (error: any) {
      console.error('Adding product failed:', error)
      alert(`Failed to add product: ${error.message || 'Unknown error'}`)
    } finally {
      setUpdatingId(null)
    }
  }

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
    <div className="animate-fade">
      <div className="page-header">
        <h2>INVENTORY SYSTEM</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          ADD PRODUCT
        </button>
      </div>

      <div className="grid" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderColor: 'var(--border-highlight)' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '2px', color: 'var(--accent)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Stock Valuation</p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Rs. {stockValue.toLocaleString()}</h4>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderColor: lowStockCount > 0 ? 'var(--error)' : 'var(--border-highlight)' }}>
          <div style={{ padding: '1rem', background: lowStockCount > 0 ? 'rgba(255, 59, 48, 0.1)' : 'var(--bg-subtle)', borderRadius: '2px', color: lowStockCount > 0 ? 'var(--error)' : 'var(--text-muted)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Alert Status</p>
            <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: lowStockCount > 0 ? 'var(--error)' : 'inherit' }}>{lowStockCount} LOW STOCK</h4>
          </div>
        </div>
      </div>

      <div className="table-container card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>ID / NAME</th>
              <th>CATEGORY</th>
              <th>COST RATE</th>
              <th>SALE RATE</th>
              <th>STOCK LEVEL</th>
              <th>PROFIT %</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '4rem', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>SYNCING DATABASE...</p>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  NO INVENTORY DATA FOUND
                </td>
              </tr>
            ) : products.map((product) => (
              <tr key={product.id} className="animate-slide" style={{ opacity: updatingId === product.id ? 0.5 : 1 }}>
                <td style={{ fontWeight: 700 }}>{product.name}</td>
                <td>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>
                    {product.category}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>Rs. {product.buy_price.toLocaleString()}</td>
                <td>
                  {editingId === product.id ? (
                    <input 
                      type="number" 
                      defaultValue={product.sell_price}
                      onBlur={(e) => handlePriceChange(product.id, Number(e.target.value))}
                      onKeyDown={(e) => e.key === 'Enter' && handlePriceChange(product.id, Number(e.currentTarget.value))}
                      autoFocus
                      className="input"
                      style={{ width: '120px', padding: '0.4rem' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 800 }}>Rs. {product.sell_price.toLocaleString()}</span>
                  )}
                </td>
                <td>
                  <span style={{ 
                    padding: '0.35rem 0.6rem',
                    borderRadius: '2px',
                    background: product.stock < 20 ? 'rgba(255, 59, 48, 0.1)' : 'var(--bg-subtle)',
                    color: product.stock < 20 ? 'var(--error)' : 'var(--text-primary)',
                    fontWeight: product.stock < 20 ? 800 : 600,
                    fontSize: '0.75rem'
                  }}>
                    {product.stock} {product.unit}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                  +{(((product.sell_price - product.buy_price) / product.sell_price) * 100).toFixed(1)}%
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button className="btn-ghost" style={{ padding: '0.5rem', border: 'none' }} onClick={() => setEditingId(product.id)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="btn-ghost" style={{ padding: '0.5rem', border: 'none', color: 'var(--error)' }} onClick={() => handleDelete(product.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
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
            <h3 style={{ marginBottom: '2.5rem', fontSize: '1.25rem', fontWeight: 800 }}>NEW PRODUCT ENTRY</h3>
            
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</label>
                <input 
                  type="text" required
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="input"
                    style={{ appearance: 'none' }}
                  >
                    <option>Poultry</option>
                    <option>Supplies</option>
                    <option>Feed</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Unit</label>
                  <select className="input" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value as any})}>
                    <option>KG</option>
                    <option>Piece</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Purchase Price</label>
                  <input type="number" required value={newProduct.buy_price} onChange={e => setNewProduct({...newProduct, buy_price: Number(e.target.value)})} className="input" />
                </div>
                <div className="input-group">
                  <label className="input-label">Sale Price</label>
                  <input type="number" required value={newProduct.sell_price} onChange={e => setNewProduct({...newProduct, sell_price: Number(e.target.value)})} className="input" />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Initial Stock Level</label>
                <input type="number" required min="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="input" />
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '3.5rem', marginTop: '1rem' }}>
                {updatingId === 'adding' ? <Loader2 className="animate-spin" /> : 'REGISTER INVENTORY'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryPage
