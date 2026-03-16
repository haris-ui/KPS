import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import { Search, ShoppingBag, Trash2, Banknote, Plus, Minus, X, Loader2 } from 'lucide-react'

const POSPage = () => {
  const { products, cart, addToCart, removeFromCart, clearCart, fetchProducts } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [weight, setWeight] = useState(1)
  const [processingCharge, setProcessingCharge] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, weight, processingCharge)
      setSelectedProduct(null)
      setWeight(1)
      setProcessingCharge(0)
    }
  }

  const calculateTotal = () => {
    return cart.reduce((acc, item) => 
      acc + (item.product.sell_price * item.quantity) + item.processing_charge, 0
    )
  }

  const handleProcessPayment = async () => {
    if (cart.length === 0) return
    setIsProcessing(true)

    try {
      // 1. Create Sale Record
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          total_amount: calculateTotal(),
          payment_method: 'cash' // Defaulting for now
        })
        .select()
        .single()

      if (saleError) throw saleError

      // 2. Create Sale Items & Update Stock
      for (const item of cart) {
        // Log item
        await supabase.from('sale_items').insert({
          sale_id: sale.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.sell_price,
          subtotal: (item.product.sell_price * item.quantity) + item.processing_charge
        })

        // Update stock
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: item.product.stock - item.quantity })
          .eq('id', item.product.id)

        if (stockError) throw stockError
      }

      alert('Transaction Completed Successfully!')
      clearCart()
      await fetchProducts()
    } catch (error: any) {
      console.error('Payment failed:', error)
      alert(`Payment Processing Failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="pos-container animate-fade">
      {/* Left: Product Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>
        <div className="card" style={{ padding: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="SEARCH PRODUCTS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '3rem', background: 'transparent' }}
            />
          </div>
        </div>

        <div className="grid" style={{ overflowY: 'auto', paddingBottom: '1rem' }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="card animate-slide" 
              style={{ 
                cursor: 'pointer', 
                background: selectedProduct?.id === product.id ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                borderColor: selectedProduct?.id === product.id ? 'var(--accent)' : 'var(--border-dim)'
              }}
              onClick={() => setSelectedProduct(product)}
            >
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.name}</h4>
              <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.25rem' }}>Rs. {product.sell_price.toLocaleString()}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', textTransform: 'uppercase' }}>
                Stock: {product.stock} {product.unit}
              </p>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div className="card animate-slide" style={{ marginTop: 'auto', borderColor: 'var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>Config: {selectedProduct.name}</h3>
              <button className="btn-ghost" onClick={() => setSelectedProduct(null)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>CANCEL</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Weight / Qty</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button className="btn-ghost" style={{ padding: '0.4rem' }} onClick={() => setWeight(Math.max(0.1, weight - 0.5))}><Minus size={16} /></button>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="input"
                    style={{ textAlign: 'center' }}
                  />
                  <button className="btn-ghost" style={{ padding: '0.4rem' }} onClick={() => setWeight(weight + 0.5)}><Plus size={16} /></button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>Service Fee</label>
                <input 
                  type="number" 
                  value={processingCharge} 
                  onChange={(e) => setProcessingCharge(Number(e.target.value))}
                  className="input"
                />
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', height: '3.5rem' }} onClick={handleAddToCart}>
              PROCEED — Rs. {(selectedProduct.sell_price * weight + processingCharge).toLocaleString()}
            </button>
          </div>
        )}
      </div>

      {/* Right: Cart & Checkout */}
      <div className="card pos-cart-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <ShoppingBag size={20} />
          <h3 style={{ flex: 1, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>Session Bill</h3>
          <button className="btn-ghost" onClick={clearCart} style={{ color: 'var(--error)', border: 'none', background: 'transparent', padding: '0.25rem' }}>
            <Trash2 size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', fontWeight: 500 }}>QUEUE EMPTY</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-dim)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.product.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Rs. {(item.product.sell_price * item.quantity + item.processing_charge).toLocaleString()}</span>
                    <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {item.quantity} {item.product.unit} × {item.product.sell_price}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border-highlight)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>TOTAL DUE</span>
            <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>Rs. {calculateTotal().toLocaleString()}</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.25rem' }} 
            disabled={cart.length === 0 || isProcessing}
            onClick={handleProcessPayment}
          >
            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Banknote size={20} />}
            {isProcessing ? 'PROCESSING...' : 'COMPLETE TRANSACTION'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default POSPage