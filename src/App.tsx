import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Preloader from './components/layout/preloader';
import Navbar from './components/layout/navbar';
import Hero from './components/home/hero';
import About from './components/about/About';

gsap.registerPlugin(useGSAP, SplitText, CustomEase, ScrollTrigger);

export default function App() {
  const counterRef          = useRef<HTMLHeadingElement>(null);
  const counterContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef      = useRef<HTMLDivElement>(null);
  const progressRef         = useRef<HTMLDivElement>(null);
  const bgRef               = useRef<HTMLDivElement>(null);
  const overlayRef          = useRef<HTMLDivElement>(null);

  // Lenis smooth scroll — integrates with GSAP ticker
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    CustomEase.create('hop', '0.9, 0, 0.1, 1');

    // SplitText — runs after mount so DOM is ready
    SplitText.create('.header h1', { type: 'chars', charsClass: 'char', mask: 'chars' });
    SplitText.create('.navbar a',  { type: 'words', wordsClass: 'word', mask: 'words' });
    SplitText.create('.hero-footer p', { type: 'words', wordsClass: 'word', mask: 'words' });

    const tl = gsap.timeline();
    const counter = { value: 0 };

    // 1. Counter counts 0 → 100 (3s)
    tl.to(counter, {
      value: 100,
      duration: 3,
      ease: 'power3.out',
      onUpdate() {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.floor(counter.value));
        }
      },
      onComplete() {
        if (!counterRef.current || !counterContainerRef.current) return;
        const split = SplitText.create(counterRef.current, {
          type: 'chars',
          charsClass: 'digit',
          mask: 'chars',
        });
        gsap.to(split.chars, {
          x: '-100%',
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.1,
          delay: 1,
          onComplete() {
            counterContainerRef.current?.remove();
          },
        });
      },
    }, 0);

    // 2. Counter container scales up 0.25 → 1 concurrently
    tl.to(counterContainerRef.current, {
      scale: 1,
      duration: 3,
      ease: 'power3.out',
    }, '<');

    // 3. Progress bar track scales in concurrently
    tl.to(progressBarRef.current, {
      scaleX: 1,
      duration: 3,
      ease: 'power3.out',
    }, '<');

    // 4. Fade overlay out just before the rectangle reveal so the clip-path is visible
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, 3.8);

    // 5. Clip-path box reveal at 4.5s
    tl.to(bgRef.current, {
      clipPath: 'polygon(35% 35%, 65% 35%, 65% 65%, 35% 65%)',
      duration: 1.5,
      ease: 'hop',
    }, 4.5);

    // 6. Full viewport expand at 6s
    tl.to(bgRef.current, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 2,
      ease: 'hop',
    }, 6);

    // Progress fill expands with the reveal
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 2,
      ease: 'hop',
    }, 6);

    // 7. Title chars slide in at 7s
    tl.to('.header h1 .char', {
      x: '0%',
      duration: 1,
      ease: 'power4.out',
      stagger: 0.075,
    }, 7);

    // 8. Nav + footer words slide in at 7.5s
    tl.to('.navbar a .word', {
      y: '0%',
      duration: 1,
      ease: 'power4.out',
      stagger: 0.075,
    }, 7.5);

    tl.to('.hero-footer p .word', {
      y: '0%',
      duration: 1,
      ease: 'power4.out',
      stagger: 0.075,
    }, 7.5);

    // 9. Remove overlay from DOM and unlock scroll after everything is done
    tl.call(() => {
      overlayRef.current?.remove();
      document.body.style.overflow = '';
      ScrollTrigger.refresh();

      // Fade progress bar out when hero scrolls out of view
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'bottom bottom',
        end: 'bottom top',
        onLeave:     () => gsap.to(progressBarRef.current, { opacity: 0, duration: 0.3 }),
        onEnterBack: () => gsap.to(progressBarRef.current, { opacity: 1, duration: 0.3 }),
      });
    }, [], 8.5);
  });

  return (
    <main style={{ position: 'relative', width: '100%' }}>
      <Preloader
        counterRef={counterRef}
        counterContainerRef={counterContainerRef}
        overlayRef={overlayRef}
        progressBarRef={progressBarRef}
        progressRef={progressRef}
      />
      <Navbar />
      <Hero bgRef={bgRef} />
      <About />
    </main>
  );
}
