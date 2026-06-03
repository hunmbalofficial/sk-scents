import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, FlaskRound } from 'lucide-react';
import gsap from 'gsap';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/Toaster';
import { formatPrice } from '../lib/utils';

const Testers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { addToast } = useToast();
  const sectionRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    productService.getAll({ category: 'Testers' })
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    }
  }, []);

  const handleAdd = (product) => {
    addItem(product);
    addToast('Added to cart', 'success');
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-luxury-black pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <FlaskRound className="w-10 h-10 text-luxury-gold mx-auto mb-4" />
          <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Try Before You Commit</p>
          <h1 className="font-display text-5xl sm:text-6xl text-white mb-4">Fragrance Testers</h1>
          <p className="text-luxury-gray text-lg max-w-2xl mx-auto">Explore our tester collection — perfect for sampling before investing in a full bottle. Same premium juice, convenient sizes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="luxury-card rounded-2xl overflow-hidden">
                <div className="aspect-[4/5] sm:aspect-square skeleton" />
                <div className="p-3 sm:p-5 space-y-2 sm:space-y-3"><div className="h-2 sm:h-3 skeleton rounded w-1/3" /><div className="h-3 sm:h-4 skeleton rounded w-2/3" /><div className="h-4 sm:h-5 skeleton rounded w-1/2" /></div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <FlaskRound className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h2 className="font-display text-2xl text-white/60 mb-2">No testers available</h2>
              <p className="text-luxury-gray mb-6">Check back soon for new tester arrivals</p>
              <Link to="/shop" className="btn-primary px-6 py-3 rounded-xl text-sm tracking-wider uppercase inline-flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Shop All</Link>
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="group luxury-card rounded-2xl overflow-hidden hover:border-luxury-gold/30 transition-all duration-500">
                <Link to={`/product/${product._id}`} className="block aspect-[4/5] sm:aspect-square overflow-hidden bg-luxury-card">
                  <img src={product.images?.[0] || ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </Link>
                <div className="p-3 sm:p-5">
                  <p className="text-[10px] sm:text-xs text-luxury-gray tracking-wider uppercase mb-1">{product.category}</p>
                  <Link to={`/product/${product._id}`}><h3 className="font-display text-sm sm:text-lg text-white group-hover:text-luxury-gold transition-colors mb-2">{product.name}</h3></Link>
                  <p className="text-luxury-gold font-display text-base sm:text-xl mb-3 sm:mb-4">{formatPrice(product.discountPrice || product.price)}</p>
                  <button onClick={() => handleAdd(product)} className="w-full bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold/20 rounded-xl py-2.5 sm:py-3 text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Testers;
