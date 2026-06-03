import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import gsap from 'gsap';

const FeaturedCollection = () => {
  const [products, setProducts] = useState([]);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    productService.getAll({ featured: 'true', limit: 4 }).then((res) => setProducts(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-luxury-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div ref={headingRef} className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-4">
          <div>
            <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Featured</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white">Featured Collection</h2>
          </div>
          <Link to="/shop?featured=true" className="btn-outline px-6 py-2.5 rounded-lg text-sm tracking-wider uppercase flex items-center gap-2 group whitespace-nowrap">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
