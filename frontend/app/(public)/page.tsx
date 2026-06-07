'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/home/Hero';
import FeaturedCollection from '@/components/home/FeaturedCollection';
import TestersSection from '@/components/home/TestersSection';
import TestimonialsSection from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <>
      <Hero />
      <FeaturedCollection />
      <TestersSection />
      <TestimonialsSection />
      <Newsletter />
    </>
  );
}
