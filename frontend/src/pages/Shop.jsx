import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import gsap from 'gsap';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    gender: searchParams.get('gender') || '',
    sort: searchParams.get('sort') || '',
    search: searchParams.get('search') || '',
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.gender) params.gender = filters.gender;
    if (filters.sort) params.sort = filters.sort;
    if (filters.search) params.search = filters.search;

    setLoading(true);
    productService.getAll(params)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(headingRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    }
  }, []);

  const genders = ['Men', 'Women', 'Unisex'];
  const sortOptions = [
    { value: '', label: 'Latest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A-Z' },
    { value: 'name_desc', label: 'Name: Z-A' },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  return (
    <div className="min-h-screen bg-luxury-black pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div ref={headingRef} className="mb-10">
          <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Our Collection</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white">Luxury Fragrances</h1>
        </div>

        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setMobileFilterOpen(true)} className="lg:hidden btn-outline px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="hidden lg:flex items-center gap-4 flex-wrap">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => handleFilterChange('gender', g)}
                className={`px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all ${
                  filters.gender === g
                    ? 'bg-luxury-gold text-luxury-black'
                    : 'bg-luxury-card text-luxury-gray hover:text-white border border-luxury-gold/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="input-luxury rounded-lg px-4 py-2 text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="luxury-card rounded-xl overflow-hidden">
                <div className="aspect-square skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-20 skeleton rounded" />
                  <div className="h-4 w-32 skeleton rounded" />
                  <div className="h-4 w-24 skeleton rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-luxury-gray text-lg mb-2">No fragrances found</p>
            <p className="text-luxury-gray-dark text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>

      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${mobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
        <div className={`absolute top-0 right-0 w-72 h-full bg-luxury-card p-6 transition-all duration-300 ${mobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg text-white">Filters</h3>
            <button onClick={() => setMobileFilterOpen(false)}><X className="w-5 h-5 text-luxury-gray" /></button>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-luxury-gray mb-3 uppercase tracking-wider">Gender</p>
              <div className="flex flex-wrap gap-2">
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleFilterChange('gender', g)}
                    className={`px-3 py-1.5 rounded text-xs transition-all ${
                      filters.gender === g
                        ? 'bg-luxury-gold text-luxury-black' : 'bg-luxury-black text-luxury-gray'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
