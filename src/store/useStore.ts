import { create } from 'zustand'

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

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  cart: { product: Product; quantity: number; processing_charge: number }[];
  addToCart: (product: Product, quantity: number, processing_charge: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  products: [
    { id: '1', name: 'Whole Chicken', category: 'Whole', buy_price: 310, sell_price: 390, unit: 'KG', stock: 50 },
    { id: '2', name: 'Leg Piece', category: 'Cuts', buy_price: 420, sell_price: 520, unit: 'KG', stock: 30 },
    { id: '3', name: 'Boneless Breast', category: 'Boneless', buy_price: 540, sell_price: 680, unit: 'KG', stock: 25 },
    { id: '4', name: 'Chicken Liver', category: 'Offal', buy_price: 185, sell_price: 250, unit: 'KG', stock: 15 },
  ],
  setProducts: (products) => set({ products }),
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
