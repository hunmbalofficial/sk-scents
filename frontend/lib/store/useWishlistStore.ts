import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  category?: string;
  gender?: string;
  description?: string;
  stock?: number;
  featured?: boolean;
  bestSeller?: boolean;
}

interface WishlistStore {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  count: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) => {
        set((state) => {
          if (state.items.some((item) => item._id === product._id)) return state;
          return { items: [...state.items, product] };
        });
      },
      removeFromWishlist: (productId) => {
        set((state) => ({ items: state.items.filter((item) => item._id !== productId) }));
      },
      isInWishlist: (productId) => get().items.some((item) => item._id === productId),
      count: () => get().items.length,
    }),
    { name: 'sk_wishlist' }
  )
);
