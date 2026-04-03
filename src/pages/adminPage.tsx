import { useState, useEffect } from 'react';

// Import all data files as initial state
import siteRaw       from '../data/site.json';
import aboutRaw      from '../data/about.json';
import projectsRaw   from '../data/projects.json';
import achievementsRaw from '../data/achievements.json';
import teamRaw       from '../data/team.json';

// ── Types ────────────────────────────────────────────────────────────────────

type DataKey = 'site' | 'about' | 'projects' | 'achievements' | 'team';

const SECTIONS: { key: DataKey; label: string }[] = [
  { key: 'site',         label: 'Site Config (navbar, hero, footer, brand)' },
  { key: 'about',        label: 'About Section'                              },
  { key: 'projects',     label: 'Projects'                                   },
  { key: 'achievements', label: 'Achievements'                               },
  { key: 'team',         label: 'Team Members'                               },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Field editor — renders a single key/value pair recursively ────────────────

function FieldEditor({
  path, value, onChange,
}: {
  path: string;
  value: unknown;
  onChange: (path: string, val: unknown) => void;
}) {
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return (
      <div className="admin-field">
        <label className="admin-field__label">{path.split('.').pop()}</label>
        <input
          className="admin-field__input"
          value={String(value)}
          onChange={(e) => {
            const raw = e.target.value;
            const coerced = typeof value === 'number' ? Number(raw) :
                            typeof value === 'boolean' ? raw === 'true' : raw;
            onChange(path, coerced);
          }}
        />
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="admin-array">
        <div className="admin-array__header">
          <span className="admin-array__label">{path.split('.').pop()}</span>
          <button className="admin-btn admin-btn--add" onClick={() => {
            const sample = value.length > 0 ? deepClone(value[value.length - 1]) : '';
            // Auto-assign next id if items have id
            if (typeof sample === 'object' && sample !== null && 'id' in (sample as object)) {
              const ids = (value as { id: number }[]).map(i => i.id);
              (sample as { id: number }).id = Math.max(...ids) + 1;
            }
            onChange(path, [...value, sample]);
          }}>+ Add</button>
        </div>
        {(value as unknown[]).map((item, idx) => (
          <div key={idx} className="admin-array__item">
            <div className="admin-array__item-header">
              <span className="admin-array__item-label">
                {typeof item === 'object' && item !== null && 'name' in item
                  ? (item as { name: string }).name
                  : typeof item === 'object' && item !== null && 'label' in item
                  ? (item as { label: string }).label
                  : typeof item === 'object' && item !== null && 'title' in item
                  ? (item as { title: string }).title
                  : `Item ${idx + 1}`}
              </span>
              <button className="admin-btn admin-btn--delete" onClick={() => {
                const next = [...(value as unknown[])];
                next.splice(idx, 1);
                onChange(path, next);
              }}>Delete</button>
            </div>
            <FieldEditor
              path={`${path}.${idx}`}
              value={item}
              onChange={onChange}
            />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="admin-object">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <FieldEditor
            key={k}
            path={`${path}.${k}`}
            value={v}
            onChange={onChange}
          />
        ))}
      </div>
    );
  }

  return null;
}

// ── Set nested value by dot-path ──────────────────────────────────────────────

function setByPath(obj: unknown, path: string, value: unknown): unknown {
  const parts = path.split('.');
  const clone = deepClone(obj);
  let cur: Record<string, unknown> = clone as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (Array.isArray(cur)) {
      cur = (cur as unknown[])[Number(key)] as Record<string, unknown>;
    } else {
      cur = cur[key] as Record<string, unknown>;
    }
  }
  const last = parts[parts.length - 1];
  if (Array.isArray(cur)) {
    (cur as unknown[])[Number(last)] = value;
  } else {
    cur[last] = value;
  }
  return clone;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [active, setActive] = useState<DataKey>('site');
  const [saved,  setSaved]  = useState<Record<DataKey, boolean>>({
    site: false, about: false, projects: false, achievements: false, team: false,
  });
  const [data, setData] = useState<Record<DataKey, unknown>>({
    site:         deepClone(siteRaw),
    about:        deepClone(aboutRaw),
    projects:     deepClone(projectsRaw),
    achievements: deepClone(achievementsRaw),
    team:         deepClone(teamRaw),
  });

  useEffect(() => {
    document.body.classList.add('page-scrollable');
    return () => { document.body.classList.remove('page-scrollable'); };
  }, []);

  function handleChange(path: string, value: unknown) {
    const topKey = active;
    setData((prev) => ({
      ...prev,
      [topKey]: setByPath(prev[topKey], path, value),
    }));
    setSaved((prev) => ({ ...prev, [topKey]: false }));
  }

  function handleSave() {
    downloadJson(`${active}.json`, data[active]);
    setSaved((prev) => ({ ...prev, [active]: true }));
  }

  function handleReset() {
    const defaults: Record<DataKey, unknown> = {
      site: siteRaw, about: aboutRaw, projects: projectsRaw,
      achievements: achievementsRaw, team: teamRaw,
    };
    setData((prev) => ({ ...prev, [active]: deepClone(defaults[active]) }));
    setSaved((prev) => ({ ...prev, [active]: false }));
  }

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <p className="admin-sidebar__title">Content Editor</p>
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            className={`admin-sidebar__item ${active === s.key ? 'admin-sidebar__item--active' : ''}`}
            onClick={() => setActive(s.key)}
          >
            {s.label}
            {saved[s.key] && <span className="admin-sidebar__saved">✓</span>}
          </button>
        ))}
      </div>

      <div className="admin-main">
        <div className="admin-main__header">
          <div>
            <h1 className="admin-main__title">
              {SECTIONS.find((s) => s.key === active)?.label}
            </h1>
            <p className="admin-main__hint">
              Edit values below. Click Save to download the updated JSON file,
              then replace the corresponding file in <code>src/data/</code>.
            </p>
          </div>
          <div className="admin-main__actions">
            <button className="admin-btn admin-btn--reset" onClick={handleReset}>Reset</button>
            <button className="admin-btn admin-btn--save"  onClick={handleSave}>
              Save {active}.json
            </button>
          </div>
        </div>

        <div className="admin-main__body">
          <FieldEditor
            path={active}
            value={data[active]}
            onChange={(path, val) => {
              // strip the top-level key prefix before passing down
              const stripped = path.replace(/^[^.]+\./, '');
              handleChange(stripped, val);
            }}
          />
        </div>
      </div>
    </div>
  );
}
