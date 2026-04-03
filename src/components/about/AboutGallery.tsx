import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aboutData from '../../data/about.json';

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  cardCount:           16,
  cardWidth:           250,
  cardHeight:          300,
  animationDuration:   0.75,
  animationOverlap:    0.5,
  headingFadeDuration: 0.5,
};

const { headings, images } = aboutData.gallery;

interface CardData {
  element: HTMLDivElement;
  centerX: number;
  centerY: number;
}

export default function AboutGallery() {
  const sectionRef     = useRef<HTMLElement>(null);
  const headingRef     = useRef<HTMLHeadingElement>(null);
  const activeCards    = useRef<CardData[]>([]);
  const currentSection = useRef(0);
  const isAnimating    = useRef(false);

  useGSAP(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    function getViewport() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const halfDiag    = Math.sqrt((W / 2) ** 2 + (H / 2) ** 2);
      // innerRadius: large protected circle — cards never enter this zone
      const innerRadius = halfDiag * 0.45;
      // outerRadius: push cards all the way to (and slightly past) the edges
      const outerRadius = halfDiag * 0.9;
      return { centerX: W / 2, centerY: H / 2, W, H, innerRadius, outerRadius };
    }

    function getEdgePosition(cx: number, cy: number) {
      const offsetVariation = () => (Math.random() - 0.5) * 400;
      const hw = CONFIG.cardWidth  / 2;
      const hh = CONFIG.cardHeight / 2;
      const distances = {
        left:   cx,
        right:  window.innerWidth  - cx,
        top:    cy,
        bottom: window.innerHeight - cy,
      };
      const min = Math.min(...Object.values(distances));
      if (min === distances.left)
        return { x: -350 - Math.random() * 200,                   y: cy - hh + offsetVariation() };
      if (min === distances.right)
        return { x: window.innerWidth + 100 + Math.random() * 200, y: cy - hh + offsetVariation() };
      if (min === distances.top)
        return { x: cx - hw + offsetVariation(),                   y: -450 - Math.random() * 200 };
      return   { x: cx - hw + offsetVariation(),                   y: window.innerHeight + 100 + Math.random() * 200 };
    }

    function createCards(setIndex: number): CardData[] {
      const vp        = getViewport();
      const cards: CardData[] = [];
      const angleStep = (Math.PI * 2) / CONFIG.cardCount;

      for (let i = 0; i < CONFIG.cardCount; i++) {
        const card = document.createElement('div');
        card.className = 'about-card';

        const img = document.createElement('img');
        img.src = `https://picsum.photos/seed/gb${setIndex * CONFIG.cardCount + i}/400/500`;
        img.alt = images[i % images.length]?.alt ?? '';
        card.appendChild(img);

        const jitter   = (Math.random() - 0.5) * angleStep * 0.6;
        const angle    = i * angleStep + jitter;
        const radius   = vp.innerRadius + Math.random() * (vp.outerRadius - vp.innerRadius);
        const cx       = vp.centerX + Math.cos(angle) * radius;
        const cy       = vp.centerY + Math.sin(angle) * radius;
        const left     = cx - CONFIG.cardWidth  / 2;
        const top      = cy - CONFIG.cardHeight / 2;
        const rotation = Math.random() * 50 - 25;

        // Set position inline BEFORE appending — prevents any flash at (0,0)
        card.style.cssText = `position:absolute;left:${left}px;top:${top}px;transform:rotate(${rotation}deg)`;
        section!.appendChild(card);
        gsap.set(card, { left, top, rotation });

        cards.push({ element: card, centerX: cx, centerY: cy });
      }
      return cards;
    }

    function animateHeading(newText: string) {
      return gsap.timeline()
        .to(heading!, { opacity: 0, duration: CONFIG.headingFadeDuration, ease: 'power2.inOut' })
        .call(() => { heading!.textContent = newText; })
        .to(heading!, { opacity: 1, duration: CONFIG.headingFadeDuration, ease: 'power2.inOut' });
    }

    function animateCards(exiting: CardData[], entering: CardData[]) {
      const tl = gsap.timeline();
      exiting.forEach(({ element, centerX, centerY }) => {
        const edge = getEdgePosition(centerX, centerY);
        tl.to(element, {
          left:     edge.x,
          top:      edge.y,
          rotation: Math.random() * 180 - 90,
          ease:     'power2.in',
          duration: CONFIG.animationDuration,
          onComplete: () => element.remove(),
        }, 0);
      });
      entering.forEach(({ element, centerX, centerY }) => {
        const edge = getEdgePosition(centerX, centerY);
        gsap.set(element, { left: edge.x, top: edge.y, rotation: Math.random() * 180 - 90 });
        tl.to(element, {
          left:     centerX - CONFIG.cardWidth  / 2,
          top:      centerY - CONFIG.cardHeight / 2,
          rotation: Math.random() * 50 - 25,
          ease:     'power2.out',
          duration: CONFIG.animationDuration,
        }, CONFIG.animationOverlap);
      });
      return tl;
    }

    function getSectionIndex(progress: number) {
      if (progress < 0.25) return 0;
      if (progress < 0.5)  return 1;
      if (progress < 0.75) return 2;
      return 3;
    }

    function transitionTo(nextIndex: number) {
      if (isAnimating.current || nextIndex === currentSection.current) return;
      isAnimating.current = true;
      const nextCards = createCards(nextIndex);
      const master = gsap.timeline({ onComplete: () => { isAnimating.current = false; } });
      master.add(animateCards(activeCards.current, nextCards), 0);
      master.add(animateHeading(headings[nextIndex] ?? headings[0]), 0);
      activeCards.current    = nextCards;
      currentSection.current = nextIndex;
    }

    // Purge any cards left by StrictMode's double-invoke before initialising
    section.querySelectorAll('.about-card').forEach(el => el.remove());
    activeCards.current    = createCards(0);
    currentSection.current = 0;
    heading.textContent    = headings[0];
    gsap.set(heading, { opacity: 1 });

    ScrollTrigger.create({
      trigger:    section,
      start:      'top top',
      end:        () => `+=${window.innerHeight * 6}`,
      pin:        true,
      pinSpacing: true,
      onUpdate(self) {
        transitionTo(getSectionIndex(self.progress));
      },
    });

    function onResize() {
      activeCards.current.forEach(({ element }) => element.remove());
      activeCards.current = createCards(currentSection.current);
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      activeCards.current.forEach(({ element }) => element.remove());
      activeCards.current = [];
      section.querySelectorAll('.about-card').forEach(el => el.remove());
    };
  });

  return (
    <section ref={sectionRef} className="about-gallery">
      <h1 ref={headingRef} className="about-gallery__heading" />
    </section>
  );
}
