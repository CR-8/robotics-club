import siteData from '../../data/site.json';

export default function HeroFooter() {
  return (
    <div className="hero-footer">
      {siteData.hero.footerItems.map((item) => (
        <div key={item} className="overflow-hidden">
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}
