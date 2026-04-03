import { LinkedinLogo } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import teamData from '../../data/team.json';
import siteData from '../../data/site.json';

const { featuredBatch, label, cta } = siteData.teamPreview;
const featured = teamData.members.filter((m) => m.batch === featuredBatch);

export default function TeamPreview() {
  return (
    <section className="team-preview">
      <div className="team-preview__header">
        <span className="team-preview__label">{label}</span>
        <Link to={cta.href} className="team-preview__cta">{cta.label}</Link>
      </div>
      <div className="team-preview__grid">
        {featured.map((member, i) => (
          <div key={member.id}
            className={`team-preview__card ${i % 2 === 0 ? 'team-preview__card--tall' : 'team-preview__card--short'}`}>
            <div className="team-preview__img-wrap">
              <img src={member.image} alt={member.name} />
            </div>
            <div className="team-preview__info">
              <div className="team-preview__text">
                <p className="team-preview__name">{member.name}</p>
                <p className="team-preview__role">{member.role} · {member.branch}</p>
              </div>
              {member.social.linkedin !== '#' && (
                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer"
                  className="team-preview__linkedin" aria-label={`${member.name} on LinkedIn`}>
                  <LinkedinLogo weight="fill" size={16} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
