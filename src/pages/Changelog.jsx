import changelog from '../data/changelog.json';

const day = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' });

// Újdonságok: a short, student-facing version of log/LOG.md.
export default function Changelog() {
  return (
    <div className="wrap page narrow">
      <h1 className="page-title">Újdonságok</h1>
      <p className="lede">Mi változott az oldalon, a legújabbal kezdve.</p>
      <ol className="changelog">
        {changelog.map((v) => (
          <li key={v.version} className="card">
            <h2>{v.version}<time dateTime={v.date}>{day(v.date)}</time></h2>
            <ul>{v.items.map((t) => <li key={t}>{t}</li>)}</ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
