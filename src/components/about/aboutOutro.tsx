import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aboutData from '../../data/about.json';

gsap.registerPlugin(ScrollTrigger);

export default function AboutOutro() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ctaRef     = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top 75%',
      },
    });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    ).fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );
  });

  return (
    <section ref={sectionRef} className="about-outro">
      <h1 ref={headingRef}>{aboutData.outro.heading}</h1>
      <a ref={ctaRef} href={aboutData.outro.cta.href} className="about-cta">
        {aboutData.outro.cta.label}
      </a>
    </section>
  );
}
