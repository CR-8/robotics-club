import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from './projectCard';
import projectsData from '../../data/projects.json';

gsap.registerPlugin(ScrollTrigger);

const { projects } = projectsData;
const CARD_Y_OFFSET  = 5;   // px stack offset per card
const CARD_SCALE_STEP = 0.075; // scale reduction per card behind active

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>('.project-card');
    const total = cards.length;
    const segmentSize = 1 / total;

    // Initial stacked positions — each card slightly lower and smaller than the one in front
    cards.forEach((card, i) => {
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50 + i * CARD_Y_OFFSET,
        scale: 1 - i * CARD_SCALE_STEP,
      });
    });

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * total}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate(self) {
        const progress = self.progress;
        const activeIndex = Math.min(
          Math.floor(progress / segmentSize),
          total - 1,
        );
        const segProgress = (progress - activeIndex * segmentSize) / segmentSize;

        cards.forEach((card, i) => {
          if (i < activeIndex) {
            // Already flipped away — hold off-screen
            gsap.set(card, { yPercent: -250, rotationX: 35 });
          } else if (i === activeIndex) {
            // Active card — animate out as segment progresses
            gsap.set(card, {
              yPercent:  gsap.utils.interpolate(-50, -250, segProgress),
              rotationX: gsap.utils.interpolate(0, 35, segProgress),
              scale: 1,
            });
          } else {
            // Cards behind — shuffle forward as active card leaves
            const behindIndex    = i - activeIndex;
            const currentYOffset = (behindIndex - segProgress) * CARD_Y_OFFSET;
            const currentScale   = 1 - (behindIndex - segProgress) * CARD_SCALE_STEP;
            gsap.set(card, {
              yPercent:  -50 + currentYOffset,
              rotationX: 0,
              scale:     currentScale,
            });
          }
        });
      },
    });
  });

  return (
    <section ref={sectionRef} className="projects">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={i}
          total={projects.length}
        />
      ))}
    </section>
  );
}
