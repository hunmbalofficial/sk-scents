import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);
  const lineRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    particlesRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        x: gsap.utils.random(-50, 50),
        y: gsap.utils.random(-50, 50),
        opacity: gsap.utils.random(0.3, 0.9),
        duration: gsap.utils.random(3, 6),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2,
      });
    });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(badgeRef.current, { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.8 })
      .fromTo(
        headingRef.current?.querySelectorAll('.word'),
        { opacity: 0, y: 80, rotateX: -30 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.1, stagger: 0.1 },
        '-=0.4'
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current?.querySelectorAll('.cta-btn'),
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12 },
        '-=0.4'
      )
      .fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.7, rotate: -5 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: 'back.out(1.4)' },
        '-=1.2'
      )
      .fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' },
        '-=1.5'
      )
      .fromTo(
        lineRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 1.2, ease: 'power3.out' },
        '-=1.2'
      );

    return () => tl.kill();
  }, []);

  const particles = Array.from({ length: 20 });

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-luxury-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.1)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,175,55,0.06)_0%,_transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-luxury-gold/5 rounded-full blur-[150px]" />
        <div ref={lineRef} className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-luxury-gold/15 to-transparent origin-top" />
        <div className="absolute top-32 left-8 w-32 h-32 border border-luxury-gold/10 rotate-45" />
        <div className="absolute bottom-32 right-8 w-24 h-24 border border-luxury-gold/10 rotate-12" />
        <div className="absolute top-1/2 right-16 w-2 h-2 bg-luxury-gold/40 rounded-full" />
        <div className="absolute top-1/3 left-16 w-1.5 h-1.5 bg-luxury-gold/30 rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-luxury-gold/50 rounded-full" />
      </div>

      {particles.map((_, i) => (
        <div
          key={i}
          ref={(el) => (particlesRef.current[i] = el)}
          className="absolute bg-luxury-gold/30 rounded-full pointer-events-none"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            width: `${1 + Math.random() * 2.5}px`,
            height: `${1 + Math.random() * 2.5}px`,
          }}
        />
      ))}

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-screen py-28 lg:py-0">
          <div className="lg:col-span-7 text-center lg:text-left">
            <div ref={badgeRef} className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/25 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="text-luxury-gold text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium">Premium Luxury Fragrances</span>
            </div>

            <div ref={headingRef} className="mb-6 perspective-1000">
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white leading-[0.95]">
                <span className="word inline-block mr-3 lg:mr-5">Discover</span>
                <span className="word inline-block mr-3 lg:mr-5 text-gradient">Your</span>
                <br className="sm:hidden" />
                <span className="word inline-block mr-3 lg:mr-5">Signature</span>
                <span className="word inline-block text-gradient">Scent</span>
              </h1>
            </div>

            <p ref={subtitleRef} className="text-luxury-gray text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
              Luxury fragrances crafted for confidence, elegance and timeless identity. Each scent tells a story — find yours.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="cta-btn btn-primary px-8 py-4 rounded-full text-sm tracking-wider uppercase flex items-center gap-2 group font-medium relative overflow-hidden"
              >
                <span className="relative z-10">Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform relative z-10" />
              </Link>
              <Link
                to="/shop?featured=true"
                className="cta-btn btn-outline px-8 py-4 rounded-full text-sm tracking-wider uppercase font-medium group"
              >
                <span>Explore Best Sellers</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center min-h-[600px]">
            <div ref={glowRef} className="absolute w-[500px] h-[500px] bg-luxury-gold/15 rounded-full blur-[120px]" />

            <div ref={imageRef} className="relative w-full h-full flex items-center justify-center">
              <div className="absolute top-8 right-0 w-56 h-72 rounded-2xl overflow-hidden border border-luxury-gold/20 shadow-2xl shadow-luxury-gold/10 z-10">
                <img
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80"
                  alt="Luxury Fragrance"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-luxury-gold/95 text-luxury-black text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">Bestseller</div>
              </div>

              <div className="absolute bottom-16 left-4 w-44 h-56 rounded-2xl overflow-hidden border border-luxury-gold/20 shadow-2xl shadow-luxury-gold/10 z-20">
                <img
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80"
                  alt="Luxury Fragrance"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 rounded-3xl overflow-hidden border-2 border-luxury-gold/30 shadow-2xl shadow-luxury-gold/20 z-30 bg-luxury-black">
                <img
                  src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80"
                  alt="Premium Fragrance"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 right-8 z-40 glass border border-luxury-gold/30 rounded-2xl px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
                <p className="text-[10px] text-white/80">"Absolutely divine"</p>
                <p className="text-[9px] text-luxury-gray mt-0.5">— Sarah K.</p>
              </div>

              <div className="absolute -top-4 -left-8 z-40 glass border border-luxury-gold/20 rounded-xl px-3 py-2 backdrop-blur-xl">
                <p className="text-[9px] text-luxury-gray uppercase tracking-wider">New</p>
                <p className="text-xs text-luxury-gold font-display font-bold">50+</p>
              </div>

              <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-20 h-20 border border-luxury-gold/15 rounded-full" />
              <div className="absolute bottom-1/4 -left-6 w-12 h-12 border border-luxury-gold/10 rotate-45" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gray/50">Scroll to Explore</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-luxury-gold/50 to-transparent animate-pulse" />
      </div>
    </section>
  );
};

export default Hero;
