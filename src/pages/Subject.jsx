import { useState } from 'react';
import { Layers, Play, RotateCcw, Timer, Trash2 } from 'lucide-react';
import Ring from '../components/Ring.jsx';
import { getGlossary, getQuestions } from '../lib/data.js';
import { TYPES } from '../lib/quiz.js';
import { href } from '../lib/route.js';
import { clearProgress, load } from '../lib/storage.js';

const toggle = (set, v) => (set.includes(v) ? set.filter((x) => x !== v) : [...set, v]);

export default function Subject({ subject }) {
  const qs = getQuestions(subject.id);
  const [chapters, setChapters] = useState([]);
  const [types, setTypes] = useState([]);
  const [, refresh] = useState(0);
  const answers = load('answers', {});
  const done = qs.filter((q) => answers[q.id]).length;
  const wrong = Object.keys(load('wrong', {})).length;
  const pool = qs.filter((q) => (!chapters.length || chapters.includes(q.chapter)) && (!types.length || types.includes(q.type)));
  const query = new URLSearchParams();
  if (chapters.length) query.set('ch', chapters.join(','));
  if (types.length) query.set('t', types.join(','));
  const practiceHref = href(subject.id, 'gyakorlas') + (query.toString() ? `?${query}` : '');

  return (
    <div className="wrap page">
      <div className="subject-head">
        <div>
          <h1>{subject.name}</h1>
          <p className="lede">{subject.sources}. {qs.length} kérdés, {subject.chapters.length} fejezet.</p>
        </div>
        <Ring value={qs.length ? done / qs.length : 0} size={104} label={`Haladás: ${done} / ${qs.length}`} />
      </div>

      <section className="filters" aria-label="Szűrők">
        <h2>Fejezetek</h2>
        <div className="chips">
          {subject.chapters.map((c) => (
            <button key={c.n} className="chip" aria-pressed={chapters.includes(c.n)} onClick={() => setChapters(toggle(chapters, c.n))}>
              {c.n}. {c.title}
            </button>
          ))}
        </div>
        <h2>Kérdéstípus</h2>
        <div className="chips">
          {Object.entries(TYPES).map(([k, v]) => (
            <button key={k} className="chip" aria-pressed={types.includes(k)} onClick={() => setTypes(toggle(types, k))}>{v}</button>
          ))}
        </div>
      </section>

      <div className="bento modes">
        <a className="card mode glow big" href={practiceHref} aria-disabled={!pool.length}>
          <Play size={26} aria-hidden="true" /><h3>Gyakorlás</h3>
          <p>{pool.length} kérdés a kiválasztott fejezetekből és típusokból, visszajelzés minden válasz után.</p>
        </a>
        <a className="card mode glow" href={href(subject.id, 'rontott')}>
          <RotateCcw size={24} aria-hidden="true" /><h3>Rontott kérdéseim</h3>
          <p>{wrong ? `${wrong} kérdés vár. Kétszer egymás után eltalálva lekerül a listáról.` : 'Még nincs rontott kérdésed.'}</p>
        </a>
        <a className="card mode glow" href={href(subject.id, 'zh')}>
          <Timer size={24} aria-hidden="true" /><h3>ZH-szimuláció</h3>
          <p>20 perc, 25 kérdés a valódi ZH arányaival. Értékelés csak a végén.</p>
        </a>
        <a className="card mode glow" href={href(subject.id, 'flashcard')}>
          <Layers size={24} aria-hidden="true" /><h3>Flashcardok</h3>
          <p>{getGlossary(subject.id).length} fogalom a fogalomtárból.</p>
        </a>
      </div>

      <button className="btn ghost" onClick={() => {
        if (confirm('Biztosan törlöd a haladásodat? A válaszaid, a rontott kérdéseid és a flashcard-állapotod elvész.')) { clearProgress(); refresh((n) => n + 1); }
      }}><Trash2 size={18} aria-hidden="true" />Haladás törlése</button>
    </div>
  );
}
