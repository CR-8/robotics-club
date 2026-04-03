import { type RefObject } from 'react';
import UnicornScene from 'unicornstudio-react';
import HeroFooter from './heroFooter';
import siteData from '../../data/site.json';

interface HeroProps {
  bgRef: RefObject<HTMLDivElement | null>;
}

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
          lazyLoad={false}
          dpi={1.5}
          fps={60}
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
