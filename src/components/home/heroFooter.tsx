const FOOTER_ITEMS = ['Performance', 'Craftsmanship', 'Expression'];

export default function HeroFooter() {
  return (
    <div className="hero-footer">
      {FOOTER_ITEMS.map((item) => (
        <div key={item} className="overflow-hidden">
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}
