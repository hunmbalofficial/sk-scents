import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../sections/Hero';
import FeaturedCollection from '../sections/FeaturedCollection';
import BestSellers from '../sections/BestSellers';

import Testimonials from '../sections/Testimonials';
import Newsletter from '../sections/Newsletter';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <div>
      <Hero />
      <FeaturedCollection />
      <BestSellers />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
