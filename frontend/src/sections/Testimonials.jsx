import { useRef, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import gsap from 'gsap';
import { testimonialService } from '../services/api';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    testimonialService.getAll().then((res) => {
      setTestimonials(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    cards.forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, delay: i * 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-luxury-card/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-2">Testimonials</p>
          <h2 className="font-display text-4xl sm:text-5xl text-white">What Our Clients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} ref={(el) => (cardsRef.current[i] = el)} className="luxury-card rounded-xl p-8">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
                ))}
              </div>
              <p className="text-luxury-gray leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-luxury-gray text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
