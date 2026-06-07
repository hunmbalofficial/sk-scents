'use client';

import { useRef, useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialService } from '@/lib/api';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<any>(null);

  useEffect(() => {
    testimonialService.getAll().then((res) => setTestimonials(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const totalSlides = Math.max(0, testimonials.length - itemsPerView);
  const slidePercent = 100 / itemsPerView;

  const goToSlide = (idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(Math.max(0, Math.min(idx, totalSlides)));
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const next = () => goToSlide(currentIndex >= totalSlides ? 0 : currentIndex + 1);
  const prev = () => goToSlide(currentIndex <= 0 ? totalSlides : currentIndex - 1);

  useEffect(() => {
    if (testimonials.length <= itemsPerView) return;
    autoPlayRef.current = setInterval(next, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, [testimonials.length, itemsPerView, totalSlides]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  if (loading || testimonials.length === 0) {
    return (
      <section className="py-24 bg-luxury-card/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Testimonials</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="luxury-card rounded-xl p-8 h-64">
                <div className="h-3 w-20 skeleton rounded mb-4" />
                <div className="space-y-2 mb-6"><div className="h-3 w-full skeleton rounded" /><div className="h-3 w-5/6 skeleton rounded" /><div className="h-3 w-4/6 skeleton rounded" /></div>
                <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-full skeleton" /><div className="space-y-2"><div className="h-3 w-20 skeleton rounded" /><div className="h-2 w-16 skeleton rounded" /></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length <= itemsPerView) {
    return (
      <section className="py-24 bg-luxury-card/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Testimonials</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t._id} className="luxury-card rounded-xl p-8">
                <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => (<Star key={j} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />))}</div>
                <p className="text-luxury-gray leading-relaxed mb-6 italic line-clamp-4">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  {t.image ? <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-display">{t.name?.[0]}</div>}
                  <div><p className="text-white font-medium text-sm">{t.name}</p><p className="text-luxury-gray text-xs">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-luxury-card/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Testimonials</p>
          <h2 className="font-display text-4xl sm:text-5xl text-white">What Our Clients Say</h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * slidePercent}%)` }}
              onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
              onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
              onTouchEnd={() => { const diff = touchStart - touchEnd; if (Math.abs(diff) > 50) diff > 0 ? next() : prev(); }}
            >
              {testimonials.map((t) => (
                <div key={t._id} className="shrink-0 px-3" style={{ width: `${slidePercent}%` }}>
                  <div className="luxury-card rounded-xl p-8 h-full">
                    <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }).map((_, j) => (<Star key={j} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />))}</div>
                    <p className="text-luxury-gray leading-relaxed mb-6 italic line-clamp-4">&quot;{t.text}&quot;</p>
                    <div className="flex items-center gap-3">
                      {t.image ? <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold font-display">{t.name?.[0]}</div>}
                      <div><p className="text-white font-medium text-sm">{t.name}</p><p className="text-luxury-gray text-xs">{t.role}</p></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={prev} disabled={isTransitioning} className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-luxury-card border border-luxury-gold/20 flex items-center justify-center text-luxury-gray hover:text-luxury-gold hover:border-luxury-gold hover:scale-110 transition-all duration-300 disabled:opacity-50 shadow-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} disabled={isTransitioning} className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-luxury-card border border-luxury-gold/20 flex items-center justify-center text-luxury-gray hover:text-luxury-gold hover:border-luxury-gold hover:scale-110 transition-all duration-300 disabled:opacity-50 shadow-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {totalSlides > 0 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {Array.from({ length: totalSlides + 1 }).map((_, i) => (
              <button key={i} onClick={() => goToSlide(i)} className={`transition-all duration-300 rounded-full ${i === currentIndex ? 'w-8 h-2 bg-luxury-gold' : 'w-2 h-2 bg-luxury-gold/30 hover:bg-luxury-gold/50'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
