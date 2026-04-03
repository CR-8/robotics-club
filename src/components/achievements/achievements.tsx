import achievementsData from '../../data/achievements.json';

const ROMAN = [
  'I','II','III','IV','V','VI','VII','VIII','IX','X',
  'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX',
];

const ORDINAL: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' };

const POSITION_COLOR: Record<number, string> = {
  1: 'rgba(212,175,55,0.75)',
  2: 'rgba(180,190,210,0.65)',
  3: 'rgba(176,120,70,0.65)',
};

type Result = { event: string; category: string | null; position: number };
type Achievement = (typeof achievementsData.achievements)[number];

/** Returns the best (lowest) position number across all results of an event */
function bestPosition(a: Achievement): number {
  return Math.min(...a.results.map((r) => r.position));
}

/**
 * Sort achievements so events with a 1st place come first,
 * then 2nd, then 3rd. Within the same tier, preserve original order.
 * Also sort each event's result pills by position ascending.
 */
function sortAchievements(items: Achievement[]): Achievement[] {
  return [...items]
    .sort((a, b) => {
      const positionDiff = bestPosition(a) - bestPosition(b);
      if (positionDiff !== 0) return positionDiff;

      return b.year - a.year; // descending year 
      // For ascending swap b.year with a.year and vice versa
    })
    .map((a) => ({
      ...a,
      results: [...a.results].sort((r1: Result, r2: Result) => r1.position - r2.position),
    }));
}

export default function Achievements() {
  const sorted = sortAchievements(achievementsData.achievements);

  return (
    <section className="achievements">
      <div className="achievements__sidebar">
        <span className="achievements__count">{String(sorted.length).padStart(2, '0')}</span>
        <span className="achievements__label">Achievements</span>
      </div>

      <div className="achievements__list">
        {sorted.map((a, i) => (
          <div key={a.id} className="achievement-row">
            <div className="achievement-row__main">
              <h2 className="achievement-row__title">
                {a.name}
                <sup className="achievement-row__numeral">{ROMAN[i]}</sup>
              </h2>
              <span className="achievement-row__location">{a.location}</span>
            </div>

            <div className="achievement-row__meta">
              <div className="achievement-row__results">
                {a.results.map((r, ri) => (
                  <span
                    key={ri}
                    className="achievement-row__pill"
                    style={{ borderColor: POSITION_COLOR[r.position] }}
                  >
                    <span style={{ color: POSITION_COLOR[r.position] }}>
                      {ORDINAL[r.position]}
                    </span>
                    {' '}{r.event}{r.category ? ` ${r.category}` : ''}
                  </span>
                ))}
              </div>
              <span className="achievement-row__year">{a.year}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
