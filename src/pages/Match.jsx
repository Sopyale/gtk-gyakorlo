import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Play, RotateCw, Trophy } from 'lucide-react';
import { scopeGlossary } from '../lib/data.js';
import { shuffle } from '../lib/quiz.js';
import { href } from '../lib/route.js';
import { load, save } from '../lib/storage.js';

const PAIRS = 6;
const PENALTY = 1000; // a wrong pair adds a second, so guessing doesn't pay
const secs = (ms) => `${(ms / 1000).toFixed(1)} mp`;

// Párosító: match terms to definitions against the clock; the best time per ZH is kept.
export default function Match({ subject }) {
  const glossary = useMemo(() => scopeGlossary(subject), [subject.path]);
  const [round, setRound] = useState(null); // { cards, start, penalty }
  const [done, setDone] = useState([]);
  const [pick, setPick] = useState(null);
  const [miss, setMiss] = useState(null);
  const [now, setNow] = useState(0);
  const [best, setBest] = useState(() => load('match', {})[subject.path]);
  const finished = round && done.length === PAIRS;
  const time = round ? (finished ? round.end : now) - round.start + round.penalty : 0;

  useEffect(() => {
    if (!round || finished) return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [round, finished]);

  const begin = () => {
    const picked = shuffle(glossary).slice(0, PAIRS);
    const cards = shuffle([...picked.map((g) => ({ id: g.term, side: 't', text: g.term })),
      ...picked.map((g) => ({ id: g.term, side: 'd', text: g.definition }))]);
    setDone([]); setPick(null); setMiss(null); setNow(Date.now());
    setRound({ cards, start: Date.now(), penalty: 0 });
  };

  const choose = (c) => {
    if (done.includes(c.id) || finished) return;
    if (!pick || pick.side === c.side) return setPick(c);
    if (pick.id !== c.id) {
      setMiss([pick, c]); setPick(null); setTimeout(() => setMiss(null), 500);
      setRound({ ...round, penalty: round.penalty + PENALTY });
      return;
    }
    const next = [...done, c.id];
    setDone(next); setPick(null); setMiss(null);
    if (next.length === PAIRS) {
      const end = Date.now(), total = end - round.start + round.penalty;
      setRound({ ...round, end });
      if (!best || total < best) { save('match', { ...load('match', {}), [subject.path]: total }); setBest(total); }
    }
  };

  const state = (c) => {
    if (done.includes(c.id)) return 'matched';
    if (pick === c) return 'picked';
    return miss?.includes(c) ? 'missed' : '';
  };

  return (
    <div className="wrap page">
      <a className="back" href={href(subject.path)}><ArrowLeft size={18} aria-hidden="true" />{subject.title}</a>
      <div className="match-head">
        <h1 className="page-title">Párosító</h1>
        {round && !finished && <p className="match-time" aria-live="off">{secs(time)}</p>}
      </div>
      {!round && (
        <div className="empty">
          <p>Kapsz {PAIRS} fogalmat és {PAIRS} meghatározást összekeverve. Koppints egy fogalomra, majd a hozzá tartozó
            meghatározásra. Minden rossz pár egy másodperc büntetés.</p>
          {best && <p><Trophy size={18} aria-hidden="true" /> Legjobb időd: {secs(best)}</p>}
          <button className="btn pri" onClick={begin}><Play size={18} aria-hidden="true" />Indítás</button>
        </div>
      )}
      {round && !finished && (
        <div className="match-grid">
          {round.cards.map((c) => (
            <button key={c.side + c.id} className={`match-card ${c.side === 't' ? 'term' : ''} ${state(c)}`}
              disabled={done.includes(c.id)} aria-pressed={pick === c} onClick={() => choose(c)}>{c.text}</button>
          ))}
        </div>
      )}
      {finished && (
        <div className="empty">
          <Trophy size={36} aria-hidden="true" />
          <h2>{secs(time)}</h2>
          <p>{time <= best ? 'Ez az eddigi legjobb időd!' : `Legjobb időd: ${secs(best)}.`}
            {round.penalty > 0 && ` Ebből ${round.penalty / 1000} mp büntetés a rossz párokért.`}</p>
          <div className="cta">
            <button className="btn pri" onClick={begin}><RotateCw size={18} aria-hidden="true" />Új kör</button>
            <a className="btn sec" href={href(subject.path)}>Vissza</a>
          </div>
        </div>
      )}
    </div>
  );
}
