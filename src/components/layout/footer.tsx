import { ArrowSquareOut } from '@phosphor-icons/react';

const NAV_LINKS = ['Index', 'Collection', 'Projects', 'Process', 'Info'];
const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn',  href: '#' },
  { label: 'Twitter',   href: '#' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Top row */}
      <div className="footer__top">
        {/* Contact */}
        <div className="footer__contact">
          <span className="footer__phone">+91 98765 43210</span>
          <a href="mailto:hello@grobots.in" className="footer__email">
            hello@grobots.in
          </a>
        </div>

        {/* Nav + Social */}
        <div className="footer__links">
          <div className="footer__col">
            <span className="footer__col-label">Navigate</span>
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" className="footer__link">{l}</a>
            ))}
          </div>
          <div className="footer__col">
            <span className="footer__col-label">Social</span>
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} className="footer__link footer__link--social">
                {s.label}
                <ArrowSquareOut size={12} weight="bold" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Brand name */}
      <div className="footer__brand">
        <span className="footer__brand-name">Grobots</span>
        <span className="footer__brand-reg">®</span>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <span className="footer__copy">©{year} Grobots. All rights reserved.</span>
        <div className="footer__legal">
          <a href="#" className="footer__legal-link">Privacy Policy</a>
          <a href="#" className="footer__legal-link">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
