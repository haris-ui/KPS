import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface User {
  id: string;
  role: 'admin' | 'staff';
  name: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  buy_price: number;
  sell_price: number;
  unit: 'KG' | 'Piece';
  stock: number;
}

interface Client {
  id: string;
  name: string;
  contact: string;
  balance: number;
  credit_limit: number;
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  note: string;
  has_receipt: boolean;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  products: Product[];
  setProducts: (products: Product[]) => void;
  fetchProducts: () => Promise<void>;
  clients: Client[];
  fetchClients: () => Promise<void>;
  expenses: Expense[];
  fetchExpenses: () => Promise<void>;
  stats: { todaySales: number; clientCount: number; totalReceivables: number };
  fetchStats: () => Promise<void>;
  cart: { product: Product; quantity: number; processing_charge: number }[];
  addToCart: (product: Product, quantity: number, processing_charge: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: false,
  products: [],
  setProducts: (products) => set({ products }),
  fetchProducts: async () => {
    set({ isLoading: true })
    const { data, error } = await supabase.from('products').select('*').order('name')
    if (error) console.error('Error fetching products:', error)
    else set({ products: data || [] })
    set({ isLoading: false })
  },
  clients: [],
  fetchClients: async () => {
    set({ isLoading: true })
    const { data, error } = await supabase.from('clients').select('*').order('name')
    if (error) console.error('Error fetching clients:', error)
    else set({ clients: data || [] })
    set({ isLoading: false })
  },
  expenses: [],
  fetchExpenses: async () => {
    set({ isLoading: true })
    const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false })
    if (error) console.error('Error fetching expenses:', error)
    else set({ expenses: data || [] })
    set({ isLoading: false })
  },
  stats: { todaySales: 0, clientCount: 0, totalReceivables: 0 },
  fetchStats: async () => {
    const today = new Date().toISOString().split('T')[0]
    
    // Fetch today's sales
    const { data: sales } = await supabase
      .from('sales')
      .select('total_amount')
      .gte('created_at', today)
    
    // Fetch client stats
    const { data: clients } = await supabase
      .from('clients')
      .select('balance')

    set({
      stats: {
        todaySales: sales?.reduce((acc, s) => acc + s.total_amount, 0) || 0,
        clientCount: clients?.length || 0,
        totalReceivables: clients?.reduce((acc, c) => acc + (c.balance < 0 ? Math.abs(c.balance) : 0), 0) || 0
      }
    })
  },
  cart: [],
  addToCart: (product, quantity, processing_charge) => 
    set((state) => ({ 
      cart: [...state.cart, { product, quantity, processing_charge }] 
    })),
  removeFromCart: (productId) => 
    set((state) => ({ 
      cart: state.cart.filter((item) => item.product.id !== productId) 
    })),
  clearCart: () => set({ cart: [] }),
}))
