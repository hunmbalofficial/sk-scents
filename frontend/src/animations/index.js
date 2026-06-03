import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const fadeInUp = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

export const fadeIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

export const staggerChildren = (parent, children, delay = 0) => {
  gsap.fromTo(
    children,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

export const scaleIn = (element, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

export const textReveal = (element, delay = 0) => {
  const tl = gsap.timeline({ delay });
  tl.fromTo(
    element,
    { y: '100%', opacity: 0 },
    { y: '0%', opacity: 1, duration: 1.2, ease: 'power4.out' }
  );
  return tl;
};

export const parallaxScroll = (element, speed = 0.5) => {
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

export const heroAnimation = (container, bottle, text, cta) => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.5 })
    .fromTo(
      bottle,
      { opacity: 0, scale: 0.8, y: 100 },
      { opacity: 1, scale: 1, y: 0, duration: 1.5 },
      '-=0.3'
    )
    .fromTo(
      text,
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
      '-=1'
    )
    .fromTo(
      cta,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.5'
    );

  return tl;
};

export const luxuryParallax = (element) => {
  gsap.to(element, {
    y: '30%',
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
};

export const revealImage = (element) => {
  gsap.fromTo(
    element,
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.5,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

export const counterAnimation = (element, start, end, duration = 2) => {
  const obj = { val: start };
  gsap.to(obj, {
    val: end,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.val);
    },
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
};

export const marqueeAnimation = (element) => {
  gsap.to(element, {
    xPercent: -50,
    ease: 'none',
    repeat: -1,
    duration: 30,
  });
};

export default gsap;
