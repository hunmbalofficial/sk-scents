import { useRef, useEffect } from 'react';
import { Quote } from 'lucide-react';
import gsap from 'gsap';

const BrandStory = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
    });
    tl.fromTo(contentRef.current, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' })
      .fromTo(imageRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-luxury-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/[0.03] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div ref={contentRef}>
            <p className="text-luxury-gold text-sm tracking-[0.3em] uppercase mb-4">Our Story</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white mb-8">
              The Art of <span className="text-gradient">Luxury</span> Fragrance
            </h2>
            <div className="space-y-4 text-luxury-gray leading-relaxed">
              <p>
                At SK SCENTS, we believe fragrance is more than just a scent — it's a statement. 
                A signature. An identity. Every bottle is crafted with precision, using the finest 
                ingredients sourced from around the world.
              </p>
              <p>
                Our master perfumers blend tradition with innovation, creating compositions that 
                transcend time and trends. From the first sparkle of top notes to the lingering 
                embrace of the base, every SK SCENTS creation tells a story.
              </p>
            </div>
            <div className="mt-10 flex items-start gap-4 p-6 border-l-2 border-luxury-gold bg-luxury-card/50 rounded-r-lg">
              <Quote className="w-8 h-8 text-luxury-gold flex-shrink-0 mt-1" />
              <div>
                <p className="text-white/80 text-lg italic font-light leading-relaxed">
                  "Luxury is in each detail. Our fragrances are crafted for those who appreciate 
                  the finer things in life."
                </p>
                <p className="text-luxury-gold text-sm mt-2">— SK SCENTS Founder</p>
              </div>
            </div>
          </div>
          <div ref={imageRef} className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600"
                alt="Luxury perfume bottles"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border border-luxury-gold/20 rounded-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 border border-luxury-gold/10 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
