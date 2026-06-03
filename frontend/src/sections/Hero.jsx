import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    particlesRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        x: gsap.utils.random(-30, 30),
        y: gsap.utils.random(-30, 30),
        opacity: gsap.utils.random(0.3, 0.8),
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2,
      });
    });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 })
      .fromTo(
        headingRef.current?.querySelectorAll('.word'),
        { opacity: 0, y: 60, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.12 },
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
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12 },
        '-=0.4'
      )
      .fromTo(
        imageRef.current,
        { opacity: 0, scale: 0, rotate: -10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: 'back.out(1.7)' },
        '-=0.8'
      )
      .fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
        '-=1.2'
      );

    return () => tl.kill();
  }, []);

  const particles = Array.from({ length: 12 });

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-luxury-black">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-luxury-gold/5 rounded-full blur-[120px]" />
      </div>

      {particles.map((_, i) => (
        <div
          key={i}
          ref={(el) => (particlesRef.current[i] = el)}
          className="absolute w-1 h-1 bg-luxury-gold/30 rounded-full"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
          }}
        />
      ))}

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen py-28 lg:py-0">
          <div className="text-center lg:text-left">
            <div ref={badgeRef} className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="text-luxury-gold text-xs tracking-widest uppercase font-medium">Premium Luxury Fragrances</span>
            </div>

            <div ref={headingRef} className="mb-6 perspective-1000">
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.05]">
                <span className="word inline-block mr-4 lg:mr-6">Discover</span>
                <span className="word inline-block mr-4 lg:mr-6 text-gradient">Your</span>
                <br className="sm:hidden" />
                <span className="word inline-block mr-4 lg:mr-6">Signature</span>
                <span className="word inline-block text-gradient">Scent</span>
              </h1>
            </div>

            <p ref={subtitleRef} className="text-luxury-gray text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10">
              Luxury fragrances crafted for confidence, elegance and timeless identity.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="cta-btn btn-primary px-8 py-3.5 rounded-full text-sm tracking-wider uppercase flex items-center gap-2 group font-medium"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                to="/shop?featured=true"
                className="cta-btn btn-outline px-8 py-3.5 rounded-full text-sm tracking-wider uppercase font-medium"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center">
            <div ref={glowRef} className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-luxury-gold/15 rounded-full blur-[100px]" />
            <div ref={imageRef} className="relative">
              <div className="relative w-64 h-80 sm:w-80 sm:h-[450px]">
                <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/10 via-transparent to-luxury-gold/5 rounded-[2rem]" />
                <img
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80"
                  alt="Luxury Fragrance"
                  className="w-full h-full object-contain drop-shadow-2xl relative z-[1]"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-luxury-gold/20 rounded-full" />
              <div className="absolute -top-4 -right-4 w-16 h-16 border border-luxury-gold/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.4em] uppercase text-luxury-gray/40">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-luxury-gold/40 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
