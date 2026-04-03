import { LinkedinLogo } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import teamData from '../../data/team.json';

// Only render members whose batch maps to priority 0 (currently 2026 — Club Leads)
const FEATURED_BATCH = '2026';

const featured = teamData.members.filter((m) => m.batch === FEATURED_BATCH);

export default function TeamPreview() {
  return (
    <section className="team-preview">
      {/* Header row */}
      <div className="team-preview__header">
        <span className="team-preview__label">[ Meet The Team ]</span>
        <Link to="/team" className="team-preview__cta">[ View All →  ]</Link>
      </div>

      {/* Masonry row — alternating tall/short */}
      <div className="team-preview__grid">
        {featured.map((member, i) => (
          <div
            key={member.id}
            className={`team-preview__card ${i % 2 === 0 ? 'team-preview__card--tall' : 'team-preview__card--short'}`}
          >
            <div className="team-preview__img-wrap">
              <img src={member.image} alt={member.name} />
            </div>
            <div className="team-preview__info">
              <div className="team-preview__text">
                <p className="team-preview__name">{member.name}</p>
                <p className="team-preview__role">{member.role} · {member.branch}</p>
              </div>
              {member.social.linkedin !== '#' && (
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-preview__linkedin"
                  aria-label={`${member.name} on LinkedIn`}
                >
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
