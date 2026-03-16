import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Banknote,
  Package,
  Loader2,
  X
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const POSPage = () => {
  const { products, fetchProducts } = useStore()
  const [cart, setCart] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedClient, setSelectedClient] = useState('')
  const [clients, setClients] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
    loadClients()
  }, [])

  const loadClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('name')
    if (data) setClients(data)
  }

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0.5, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const total = cart.reduce((sum, item) => sum + (item.sell_price * item.quantity), 0)

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setIsProcessing(true)
    try {
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([{
          total_amount: total,
          client_id: selectedClient || null,
          payment_method: 'cash'
        }])
        .select()
        .single()

      if (saleError) throw saleError

      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.sell_price,
        subtotal: item.sell_price * item.quantity
      }))

      const { error: itemsError } = await supabase.from('sale_items').insert(saleItems)
      if (itemsError) throw itemsError

      // Update stock
      for (const item of cart) {
        await supabase.rpc('decrement_stock', { 
          product_id: item.id, 
          amount: item.quantity 
        })
      }

      setCart([])
      setSelectedClient('')
      alert('Transaction Completed Successfully!')
    } catch (error: any) {
      console.error(error)
      alert('Payment Processing Failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div>
          <h2 style={{ color: 'var(--accent)' }}>POS TERMINAL</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>Quick sales processing terminal</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '500px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              className="input" 
              placeholder="Search products..." 
              style={{ paddingLeft: '3rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid" style={{ flex: 1, alignItems: 'flex-start', gridTemplateColumns: '1fr 380px', height: '100%', overflow: 'hidden' }}>
        {/* Products Grid */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 15rem)', paddingRight: '0.5rem' }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {filteredProducts.map(p => (
              <div key={p.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(0, 173, 181, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                    <Package size={20} color="var(--accent)" />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{p.category}</span>
                </div>
                <h4 style={{ fontSize: '1rem', textTransform: 'none', letterSpacing: 'normal' }}>{p.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>Rs. {p.sell_price}</span>
                  <button className="btn btn-primary" style={{ padding: '0.5rem', width: 'auto' }} onClick={() => addToCart(p)}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="card" style={{ height: 'calc(100vh - 15rem)', display: 'flex', flexDirection: 'column', padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
              <ShoppingCart size={20} color="var(--accent)" /> CART
            </h3>
            <span style={{ background: 'var(--bg-main)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>{cart.length} ITEMS</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {cart.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
                <ShoppingCart size={48} opacity={0.2} />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.1)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><X size={16} /></button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: '4px' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Minus size={14} /></button>
                        <span style={{ width: '30px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><Plus size={14} /></button>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Rs. {(item.sell_price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="input-label">CLIENT PARTNER</label>
              <select className="input" value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                <option value="">Walk-in Customer</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL AMOUNT</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>Rs. {total.toLocaleString()}</span>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', height: '3.5rem' }}
              disabled={cart.length === 0 || isProcessing}
              onClick={handleCheckout}
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <><Banknote size={20} /> COMPLETE ORDER</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default POSPage