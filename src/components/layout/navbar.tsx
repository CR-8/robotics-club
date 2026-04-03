import { Link, useLocation } from 'react-router-dom';
import siteData from '../../data/site.json';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-logo overflow-hidden">
        <Link to="/">
          <img src="/Grobotslogo.png" alt={siteData.brand.name} className="nav-logo__img" />
        </Link>
      </div>
      <div className="nav-links">
        {siteData.navbar.links.map((link) => (
          <div key={link.label} className="overflow-hidden">
            {link.href.startsWith('/#') ? (
              <a href={link.href} className="nav-link">{link.label}</a>
            ) : (
              <Link
                to={link.href}
                className={`nav-link ${pathname === link.href ? 'nav-active' : ''}`}
              >
                {link.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
