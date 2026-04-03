import { useState, useMemo, useEffect } from 'react';
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/dist/ssr';
import Navbar from '../components/layout/navbar';
import teamData from '../data/team.json';

type Member = (typeof teamData.members)[number];

// Sort: Club Leads (2026) → Coordinators (2027) → Alumni (2025/2024)
const BATCH_ORDER: Record<string, number> = { '2026': 0, '2027': 1, '2025': 2, '2024': 3 };

function sortMembers(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    const oa = BATCH_ORDER[a.batch] ?? 99;
    const ob = BATCH_ORDER[b.batch] ?? 99;
    if (oa !== ob) return oa - ob;
    return a.id - b.id; // preserve original order within same batch
  });
}

export default function TeamPage() {
  const [activeDept, setActiveDept] = useState('All');
  const [query, setQuery]           = useState('');

  useEffect(() => {
    document.body.classList.add('page-scrollable');
    return () => { document.body.classList.remove('page-scrollable'); };
  }, []);

  const filtered = useMemo(() => {
    const sorted = sortMembers(teamData.members);
    return sorted.filter((m) => {
      const matchDept  = activeDept === 'All' || m.department === activeDept;
      const matchQuery = m.name.toLowerCase().includes(query.toLowerCase()) ||
                         m.role.toLowerCase().includes(query.toLowerCase()) ||
                         m.branch.toLowerCase().includes(query.toLowerCase());
      return matchDept && matchQuery;
    });
  }, [activeDept, query]);

  return (
    <>
      <Navbar />
      <div className="team-page">
        <header className="team-header">
          <h1 className="team-header__title">Meet Our Team</h1>
          <p className="team-header__sub">
            Elite robotics engineers, AI specialists, and technology architects
            pushing the boundaries of what's possible.
          </p>
        </header>

        <div className="team-filters">
          <div className="team-filters__tabs">
            {teamData.departments.map((d) => (
              <button
                key={d}
                className={`team-filters__tab ${activeDept === d ? 'team-filters__tab--active' : ''}`}
                onClick={() => setActiveDept(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="team-filters__search">
            <SearchIcon size={14} weight="bold" className="team-filters__search-icon" />
            <input
              type="text"
              placeholder="Search members"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="team-filters__input"
            />
          </div>
        </div>

        <div className="team-grid">
          {filtered.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-card__avatar">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team-card__info">
                <h3 className="team-card__name">{member.name}</h3>
                <p className="team-card__role">{member.role}</p>
              </div>
              <p className="team-card__exp">{member.branch} · Batch {member.batch}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="team-grid__empty">No members found.</p>
          )}
        </div>
      </div>
    </>
  );
}
