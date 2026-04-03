import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Index',      href: '/'      },
  { label: 'Collection', href: '/#'     },
  { label: 'Projects',   href: '/#'     },
  { label: 'Team',       href: '/team'  },
  { label: 'Info',       href: '/#'     },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-logo overflow-hidden">
        <Link to="/">Grobots</Link>
      </div>

      <div className="nav-links">
        {NAV_LINKS.map((link) => (
          <div key={link.label} className="overflow-hidden">
            <Link
              to={link.href}
              className={pathname === link.href ? 'nav-active' : ''}
            >
              {link.label}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
}
