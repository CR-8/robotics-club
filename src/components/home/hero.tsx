import { type RefObject } from 'react';
import UnicornScene from 'unicornstudio-react';
import HeroFooter from './heroFooter';

interface HeroProps {
  bgRef: RefObject<HTMLDivElement | null>;
}

const TITLE = 'Grobots';
const SDK_URL = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.6/dist/unicornStudio.umd.js';

export default function Hero({ bgRef }: HeroProps) {
  return (
    <section className="hero">
      <div ref={bgRef} className="hero-bg">
        <UnicornScene
          projectId="gK3lOic9aLAOUfbUjBXK"
          sdkUrl={SDK_URL}
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
          {TITLE.split('').map((char, i) => (
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
