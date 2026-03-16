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
    <div className="pos-page" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', height: 'calc(100vh - 100px)' }}>
      {/* Left: Product Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '0.875rem 0.875rem 0.875rem 3rem', borderRadius: '0.75rem',
                background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', outline: 'none'
              }}
            />
          </div>
        </div>

        <div className="grid-cols-auto" style={{ overflowY: 'auto' }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="glass-card" 
              style={{ cursor: 'pointer', border: selectedProduct?.id === product.id ? '1px solid #ffffff' : '1px solid var(--border)', boxShadow: selectedProduct?.id === product.id ? '0 0 20px rgba(255,255,255,0.1)' : 'none' }}
              onClick={() => setSelectedProduct(product)}
            >
              <h4 style={{ marginBottom: '0.5rem', fontSize: '0.95rem' }}>{product.name}</h4>
              <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.25rem' }}>Rs. {product.sell_price}/{product.unit}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Available: {product.stock} {product.unit}</p>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div className="glass-card" style={{ marginTop: 'auto', border: '1px solid var(--primary)', animation: 'scaleIn 0.3s ease forwards' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Configure {selectedProduct.name}</h3>
              <button className="btn-ghost" onClick={() => setSelectedProduct(null)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Cancel</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight / Qty</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button className="btn-ghost" style={{ padding: '0.5rem' }} onClick={() => setWeight(Math.max(0.1, weight - 0.5))}><Minus size={16} /></button>
                  <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(Number(e.target.value))}
                    style={{ width: '80px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.6rem', borderRadius: '0.75rem' }}
                  />
                  <button className="btn-ghost" style={{ padding: '0.5rem' }} onClick={() => setWeight(weight + 0.5)}><Plus size={16} /></button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Processing Fee (Rs.)</label>
                <input 
                  type="number" 
                  value={processingCharge} 
                  onChange={(e) => setProcessingCharge(Number(e.target.value))}
                  style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', padding: '0.6rem', borderRadius: '0.75rem' }}
                />
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', height: '3.5rem' }} onClick={handleAddToCart}>
              PROCEED TO BILL — Rs. {(selectedProduct.sell_price * weight + processingCharge).toFixed(2)}
            </button>
          </div>
        )}
      </div>

      {/* Right: Cart & Checkout */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(10,10,10,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <ShoppingBag size={24} className="animate-float" />
          <h3 style={{ flex: 1, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>Current Bill</h3>
          <button className="btn-ghost" onClick={clearCart} style={{ color: 'var(--error)', border: 'none', background: 'transparent' }}>
            <Trash2 size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '6rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <ShoppingBag size={24} style={{ opacity: 0.2 }} />
              </div>
              <p style={{ fontSize: '0.875rem', letterSpacing: '0.05em', opacity: 0.5 }}>QUEUE EMPTY</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} style={{ padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', animation: 'slideInLeft 0.3s ease backwards', animationDelay: `${idx * 0.05}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.product.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Rs. {(item.product.sell_price * item.quantity + item.processing_charge).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', opacity: 0.6 }}>
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.quantity} {item.product.unit} @ Rs. {item.product.sell_price}</span>
                  {item.processing_charge > 0 && <span>+ Rs. {item.processing_charge} service</span>}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <span>NET AMOUNT</span>
            <span>Rs. {calculateTotal().toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800 }}>
            <span>TOTAL</span>
            <span className="gradient-text">Rs. {calculateTotal().toFixed(2)}</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', letterSpacing: '0.1em', opacity: isProcessing ? 0.7 : 1 }} 
            disabled={cart.length === 0 || isProcessing}
            onClick={handleProcessPayment}
          >
            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Banknote size={20} />}
            {isProcessing ? 'PROCESSING...' : 'PROCESS PAYMENT'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default POSPage
