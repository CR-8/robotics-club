const NAV_LINKS = ['Index', 'Collection', 'Material', 'Process', 'Info'];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo overflow-hidden">
        <a href="#">Grobots</a>
      </div>

      <div className="nav-links">
        {NAV_LINKS.map((link) => (
          <div key={link} className="overflow-hidden">
            <a href="#">{link}</a>
          </div>
        ))}
      </div>
    </nav>
  );
}
