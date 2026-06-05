import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FlaskRound, ShoppingBag } from 'lucide-react';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/Toaster';
import { formatPrice } from '../lib/utils';
import gsap from 'gsap';

const TestersSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  const { addItem } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    productService.getAll({ category: 'Testers' })
      .then((res) => setProducts((res.data || []).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!gridRef.current || products.length === 0) return;
    const cards = gridRef.current.querySelectorAll('.tester-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      }
    );
  }, [products]);

  const handleAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    addToast('Added to cart', 'success');
  };

  return (
    <section className="py-24 bg-luxury-card/50 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headingRef} className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FlaskRound className="w-4 h-4 text-luxury-gold" />
              <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase">Try Before You Commit</p>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white">Fragrance Testers</h2>
            <p className="text-luxury-gray text-sm mt-3 max-w-md">Sample our premium scents in convenient sizes — same luxury juice, perfect for finding your signature.</p>
          </div>
          <Link to="/testers" className="btn-outline px-6 py-2.5 rounded-lg text-sm tracking-wider uppercase flex items-center gap-2 group whitespace-nowrap shrink-0">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="luxury-card rounded-2xl overflow-hidden">
                <div className="aspect-[4/5] sm:aspect-square skeleton" />
                <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                  <div className="h-2 sm:h-3 skeleton rounded w-1/3" />
                  <div className="h-3 sm:h-4 skeleton rounded w-2/3" />
                  <div className="h-4 sm:h-5 skeleton rounded w-1/2" />
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FlaskRound className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-luxury-gray text-sm">No testers available yet.</p>
              <Link to="/admin/testers" className="text-luxury-gold text-xs uppercase tracking-wider hover:underline mt-2 inline-block">Add testers in admin</Link>
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="tester-card group luxury-card rounded-2xl overflow-hidden hover:border-luxury-gold/30 transition-all duration-500">
                <Link to={`/product/${product._id}`} className="block aspect-[4/5] sm:aspect-square overflow-hidden bg-luxury-card relative">
                  <img src={product.images?.[0] || ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-2 left-2 bg-luxury-gold/90 text-luxury-black text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded">
                    Tester
                  </span>
                </Link>
                <div className="p-3 sm:p-5">
                  <p className="text-[10px] sm:text-xs text-luxury-gray tracking-wider uppercase mb-1">{product.gender || 'Unisex'}</p>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-display text-sm sm:text-lg text-white group-hover:text-luxury-gold transition-colors mb-2 line-clamp-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-luxury-gold font-display text-base sm:text-xl">{formatPrice(product.discountPrice || product.price)}</p>
                    <button
                      onClick={(e) => handleAdd(e, product)}
                      className="bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded-lg p-2 sm:px-3 sm:py-2 transition-all duration-300"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TestersSection;
