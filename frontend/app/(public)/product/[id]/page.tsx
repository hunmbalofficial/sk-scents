'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import gsap from 'gsap';
import { productService } from '@/lib/api';
import { useCartStore } from '@/lib/store/useCartStore';
import { useToast } from '@/components/ui/Toaster';
import { formatPrice } from '@/lib/utils';
import Loader from '@/components/ui/Loader';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const { addToast } = useToast();
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    productService.getById(id).then((res) => {
      setProduct(res.data);
      setSelectedImage(0);
      setQuantity(1);
      return productService.getAll({ category: res.data.category });
    }).then((res) => setRelatedProducts(res.data.filter((p: any) => p._id !== id).slice(0, 4))).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product && detailsRef.current) gsap.fromTo(detailsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
  }, [product]);

  if (loading) return <Loader />;
  if (!product) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-luxury-gray">Product not found</p></div>;

  const handleAddToCart = () => { addItem(product, quantity); addToast(`${product.name} added to cart`, 'success'); };

  const notes = [
    { label: 'Top Notes', items: product.topNotes, color: 'text-amber-300' },
    { label: 'Middle Notes', items: product.middleNotes, color: 'text-rose-300' },
    { label: 'Base Notes', items: product.baseNotes, color: 'text-stone-300' },
  ];

  return (
    <div className="min-h-screen bg-luxury-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-luxury-gray hover:text-luxury-gold text-sm mb-8 transition-colors"><ChevronLeft className="w-4 h-4" /> Back to Shop</Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-luxury-card relative group">
              <img src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {product.images?.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-luxury-gold transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                  <button onClick={() => setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-luxury-gold transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-luxury-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div ref={detailsRef}>
            <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">{product.gender}</p>
            <h1 className="font-display text-4xl sm:text-5xl text-white mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />))}</div>
              <span className="text-luxury-gray text-sm">(5.0)</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              {product.discountPrice ? (<><span className="text-3xl font-display text-luxury-gold">{formatPrice(product.discountPrice)}</span><span className="text-xl text-luxury-gray line-through">{formatPrice(product.price)}</span></>) : (<span className="text-3xl font-display text-luxury-gold">{formatPrice(product.price)}</span>)}
            </div>
            <p className="text-luxury-gray leading-relaxed mb-8">{product.description}</p>

            <div className="mb-8">
              <h3 className="font-display text-lg text-white mb-4">Fragrance Notes</h3>
              <div className="grid grid-cols-3 gap-4">
                {notes.map((note) => (
                  <div key={note.label} className="luxury-card rounded-lg p-4 text-center">
                    <div className={`text-xs font-medium mb-1 ${note.color}`}>{note.label}</div>
                    {note.items?.map((item: string, i: number) => (<span key={i} className="text-sm text-luxury-gray block">{item}</span>))}
                  </div>
                ))}
              </div>
            </div>

            {product.notes && <p className="text-sm text-luxury-gray mb-8 italic">&quot;{product.notes}&quot;</p>}

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-luxury-card rounded-lg border border-luxury-gold/20">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-luxury-gray hover:text-white transition-colors">-</button>
                <span className="px-4 py-3 text-white font-medium min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-luxury-gray hover:text-white transition-colors">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={product.stock < 1} className="flex-1 btn-primary px-8 py-3.5 rounded-lg text-sm tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag className="w-4 h-4" />{product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="luxury-card rounded-lg p-4"><p className="text-luxury-gray">Category</p><p className="text-white capitalize">{product.category}</p></div>
              <div className="luxury-card rounded-lg p-4"><p className="text-luxury-gray">Stock</p><p className="text-white">{product.stock} units</p></div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-white mb-8">Similar Fragrances</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p._id} href={`/product/${p._id}`} className="group block luxury-card rounded-xl overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-luxury-card"><img src={p.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
                  <div className="p-4"><h3 className="font-display text-white group-hover:text-luxury-gold transition-colors">{p.name}</h3><p className="text-luxury-gold text-sm">{formatPrice(p.discountPrice || p.price)}</p></div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
