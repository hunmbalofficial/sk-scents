import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.product === (product._id || product.product));
          if (existingIndex >= 0) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated };
          }
          return {
            items: [...state.items, {
              product: product._id || product.product,
              name: product.name,
              price: product.discountPrice || product.price,
              image: product.images?.[0] || product.image || '',
              quantity,
            }],
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((item) => item.product !== productId) }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({ items: state.items.map((item) => item.product === productId ? { ...item, quantity } : item) }));
      },
      clearCart: () => set({ items: [] }),
    }),
    { name: 'sk_cart' }
  )
);

export const useCartSubtotal = () => useCartStore((s) => s.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
export const useCartItemCount = () => useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
