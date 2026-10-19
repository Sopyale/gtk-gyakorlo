import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, CalendarDays, Layers, Play, RotateCcw, Timer, Trash2 } from 'lucide-react';
import Ring from '../components/Ring.jsx';
import { scopeGlossary, scopeQuestions } from '../lib/data.js';
import { daysBetween, today } from '../lib/plan.js';
import { TYPES } from '../lib/quiz.js';
import { href } from '../lib/route.js';
import { clearProgress, load } from '../lib/storage.js';

const toggle = (set, v) => (set.includes(v) ? set.filter((x) => x !== v) : [...set, v]);

export default function Subject({ subject }) {
  const qs = scopeQuestions(subject);
  const [chapters, setChapters] = useState([]);
  const [types, setTypes] = useState([]);
  const [, refresh] = useState(0);
  const answers = load('answers', {});
  const done = qs.filter((q) => answers[q.id]).length;
  const wrongIds = load('wrong', {});
  const plan = load(`plan:${subject.path}`, {});
  const wrong = qs.filter((q) => q.id in wrongIds).length;
  const pool = qs.filter((q) => (!chapters.length || chapters.includes(q.chapter)) && (!types.length || types.includes(q.type)));
  const query = new URLSearchParams();
  if (chapters.length) query.set('ch', chapters.join(','));
  if (types.length) query.set('t', types.join(','));
  const practiceHref = href(subject.path, 'gyakorlas') + (query.toString() ? `?${query}` : '');

  return (
    <div className="wrap page">
      <a className="back" href={href(subject.id)}><ArrowLeft size={18} aria-hidden="true" />{subject.name}</a>
      <div className="subject-head">
        <div>
          <h1>{subject.exam.name}</h1>
          <p className="lede">{subject.name}, {subject.chapters.length} fejezet, {qs.length} kérdés. {subject.sources}.</p>
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
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><Play size={26} className="mi" aria-hidden="true" /><h3>Gyakorlás</h3>
          <p>{pool.length} kérdés a kiválasztott fejezetekből és típusokból, visszajelzés minden válasz után.</p>
        </a>
        <a className="card mode glow" href={href(subject.path, 'rontott')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><RotateCcw size={24} className="mi" aria-hidden="true" /><h3>Rontott kérdéseim</h3>
          <p>{wrong ? `${wrong} kérdés vár. Kétszer egymás után eltalálva lekerül a listáról.` : 'Még nincs rontott kérdésed.'}</p>
        </a>
        <a className="card mode glow" href={href(subject.path, 'szimulacio')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><Timer size={24} className="mi" aria-hidden="true" /><h3>ZH-szimuláció</h3>
          <p>20 perc, 25 kérdés a valódi ZH arányaival. Értékelés csak a végén.</p>
        </a>
        <a className="card mode glow" href={href(subject.path, 'flashcard')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><Layers size={24} className="mi" aria-hidden="true" /><h3>Flashcardok</h3>
          <p>{scopeGlossary(subject).length} fogalom a fogalomtárból.</p>
        </a>
        <a className="card mode glow" href={href(subject.path, 'utemterv')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><CalendarDays size={24} className="mi" aria-hidden="true" /><h3>Ütemterv</h3>
          <p>{plan.date > today() ? `${daysBetween(today(), plan.date)} nap a ZH-ig, napi bontásban.` : 'Add meg a ZH dátumát, és napokra bontjuk az anyagot.'}</p>
        </a>
      </div>

      <button className="btn ghost" onClick={() => {
        if (confirm('Biztosan törlöd a haladásodat? A válaszaid, a rontott kérdéseid és a flashcard-állapotod elvész.')) { clearProgress(); refresh((n) => n + 1); }
      }}><Trash2 size={18} aria-hidden="true" />Haladás törlése</button>
    </div>
  );
}
