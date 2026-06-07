'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/useWishlistStore';
import { useCartStore } from '@/lib/store/useCartStore';
import { useToast } from '@/components/ui/Toaster';
import { formatPrice } from '@/lib/utils';
import gsap from 'gsap';

export default function WishlistPage() {
  const wishlist = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const { addToast } = useToast();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => { window.scrollTo(0, 0); if (pageRef.current) gsap.fromTo(pageRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }); }, []);

  return (
    <div ref={pageRef} className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-10"><Heart className="w-6 h-6 text-luxury-gold" /><h1 className="font-display text-3xl text-white">My Wishlist</h1><span className="text-white/40 text-sm mt-2">({wishlist.length} items)</span></div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h2 className="font-display text-2xl text-white/60 mb-4">Your wishlist is empty</h2>
          <p className="text-white/30 mb-8">Save your favorite fragrances here</p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm tracking-wider uppercase"><ArrowLeft className="w-4 h-4" /> Browse Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="group bg-white/[0.04] backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden hover:border-luxury-gold/20 transition-all duration-500">
              <Link href={`/product/${product._id}`} className="block aspect-square overflow-hidden">
                <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </Link>
              <div className="p-5">
                <p className="text-xs text-white/40 tracking-wider uppercase mb-1">{product.category}</p>
                <Link href={`/product/${product._id}`}><h3 className="font-display text-lg text-white group-hover:text-luxury-gold transition-colors mb-2">{product.name}</h3></Link>
                <p className="text-luxury-gold font-display text-xl mb-4">{formatPrice(product.discountPrice || product.price)}</p>
                <div className="flex gap-2">
                  <button onClick={() => { addItem(product); addToast('Added to cart', 'success'); }} className="flex-1 bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold/20 rounded-xl py-2.5 text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"><ShoppingBag className="w-3.5 h-3.5" /> Add to Cart</button>
                  <button onClick={() => removeFromWishlist(product._id)} className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all duration-300"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
