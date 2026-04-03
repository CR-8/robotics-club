import { type RefObject } from 'react';
import UnicornScene from 'unicornstudio-react';
import HeroFooter from './heroFooter';
import siteData from '../../data/site.json';

interface HeroProps {
  bgRef: RefObject<HTMLDivElement | null>;
}

// Lower DPI and FPS on mobile to reduce GPU load
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export default function Hero({ bgRef }: HeroProps) {
  const { title, unicornProjectId, unicornSdkUrl } = siteData.hero;
  return (
    <section className="hero">
      <div ref={bgRef} className="hero-bg">
        <UnicornScene
          projectId={unicornProjectId}
          sdkUrl={unicornSdkUrl}
          width="100%"
          height="100%"
          lazyLoad={true}
          dpi={isMobile ? 1 : 1.5}
          fps={isMobile ? 30 : 60}
          scale={1}
        />
      </div>
      <div className="header">
        <h1>
          {title.split('').map((char, i) => (
            <span key={i} className="overflow-hidden" style={{ display: 'inline-block' }}>
              <span className="char">{char}</span>
            </span>
          ))}
        </h1>
      </div>
      <HeroFooter />
    </section>
  );
}
