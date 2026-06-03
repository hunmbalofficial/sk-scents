import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './ui/Toaster';
import { formatPrice } from '../lib/utils';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const { addToast } = useToast();
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, [index]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock < 1) return;
    addItem(product);
    addToast(`${product.name} added to cart`, 'success');
  };

  return (
    <Link
      ref={cardRef}
      to={`/product/${product._id}`}
      className="group block luxury-card rounded-xl overflow-hidden"
    >
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-luxury-card">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
        {product.discountPrice && (
          <div className="absolute top-3 left-3 bg-luxury-gold text-luxury-black text-xs font-bold px-2 py-1 rounded">
            SALE
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 right-3">
            <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
          </div>
        )}
        <button
          onClick={handleAddToCart}
          disabled={product.stock < 1}
          className="absolute bottom-3 right-3 bg-luxury-gold text-luxury-black p-2.5 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-luxury-gold-light disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-luxury-gray uppercase tracking-widest mb-1">{product.gender}</p>
        <h3 className="font-display text-sm sm:text-lg text-white mb-1 group-hover:text-luxury-gold transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-luxury-gold font-semibold">{formatPrice(product.discountPrice)}</span>
              <span className="text-luxury-gray line-through text-sm">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-luxury-gold font-semibold">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
