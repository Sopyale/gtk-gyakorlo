import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, CalendarDays, Layers, Play, Puzzle, Repeat, RotateCcw, Timer, Trash2 } from 'lucide-react';
import Ring from '../components/Ring.jsx';
import { scopeGlossary, scopeQuestions } from '../lib/data.js';
import { daysBetween, today } from '../lib/plan.js';
import { due, TYPES, zhLevel } from '../lib/quiz.js';
import { href } from '../lib/route.js';
import { clearProgress, load } from '../lib/storage.js';

const toggle = (set, v) => (set.includes(v) ? set.filter((x) => x !== v) : [...set, v]);

export default function Subject({ subject }) {
  const qs = scopeQuestions(subject);
  const cards = scopeGlossary(subject).length;
  const typeKeys = Object.keys(TYPES).filter((k) => qs.some((q) => q.type === k));
  const mock = subject.exam.mock;
  const calc = !!mock?.perChapter; // Matematika-style ZH of calculation tasks; other mocks use mock.mix
  const [chapters, setChapters] = useState([]);
  const [types, setTypes] = useState([]);
  const [hard, setHard] = useState(false);
  const [, refresh] = useState(0);
  const answers = load('answers', {});
  const done = qs.filter((q) => answers[q.id]).length;
  const wrongIds = load('wrong', {});
  const zhDate = load(`plan:${subject.path}`, {}).date || subject.exam.date;
  const wrong = qs.filter((q) => q.id in wrongIds).length;
  const dueNow = due(qs).length;
  const best = load('match', {})[subject.path];
  const pool = qs.filter((q) => (!chapters.length || chapters.includes(q.chapter)) && (!types.length || types.includes(q.type)) && (!hard || zhLevel(q)));
  const query = new URLSearchParams();
  if (chapters.length) query.set('ch', chapters.join(','));
  if (types.length) query.set('t', types.join(','));
  if (hard) query.set('zh', '1');
  // Weak spots: share of right answers per chapter (latest answer per question), worst first.
  const weak = subject.chapters.map((c) => {
    const seen = qs.filter((q) => q.chapter === c.n && q.id in answers);
    return { ...c, seen: seen.length, rate: seen.filter((q) => answers[q.id]).length / (seen.length || 1) };
  }).filter((c) => c.seen).sort((a, b) => a.rate - b.rate);
  const practiceHref = href(subject.path, 'gyakorlas') + (query.toString() ? `?${query}` : '');

  return (
    <div className="wrap page">
      <a className="back" href={href(subject.id)}><ArrowLeft size={18} aria-hidden="true" />{subject.name}</a>
      <div className="subject-head">
        <div>
          <h1>{subject.exam.name}</h1>
          <p className="lede">{subject.name}, {subject.chapters.length} {calc ? 'feladattípus' : 'fejezet'}, {qs.length} {calc ? 'feladat' : 'kérdés'}. {subject.sources}.</p>
        </div>
        <Ring value={qs.length ? done / qs.length : 0} size={104} label={`Haladás: ${done} / ${qs.length}`} />
      </div>

      <section className="filters" aria-label="Szűrők">
        <h2>{subject.chapterLabel ?? 'Fejezetek'}</h2>
        <div className="chips">
          {subject.chapters.map((c) => (
            <button key={c.n} className="chip" aria-pressed={chapters.includes(c.n)} onClick={() => setChapters(toggle(chapters, c.n))}>
              {c.n}. {c.title}
            </button>
          ))}
        </div>
        {typeKeys.length > 1 && <>
          <h2>Kérdéstípus</h2>
          <div className="chips">
            {typeKeys.map((k) => (
              <button key={k} className="chip" aria-pressed={types.includes(k)} onClick={() => setTypes(toggle(types, k))}>{TYPES[k]}</button>
            ))}
          </div>
        </>}
        {!qs.every(zhLevel) && <>
          <h2>Nehézség</h2>
          <div className="chips">
            <button className="chip" aria-pressed={hard} onClick={() => setHard(!hard)}>Csak ZH-szintű ({qs.filter(zhLevel).length})</button>
          </div>
        </>}
      </section>

      <div className="bento modes">
        <a className="card mode glow big" href={practiceHref} aria-disabled={!pool.length}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><Play size={26} className="mi" aria-hidden="true" /><h3>Gyakorlás</h3>
          <p>{calc ? `${pool.length} feladat a kiválasztott feladattípusokból, ellenőrzés és megoldás minden feladat után.` : `${pool.length} kérdés a kiválasztott fejezetekből és típusokból, visszajelzés minden válasz után.`}</p>
        </a>
        <a className="card mode glow" href={href(subject.path, 'rontott')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><RotateCcw size={24} className="mi" aria-hidden="true" /><h3>Rontott kérdéseim</h3>
          <p>{wrong ? `${wrong} kérdés vár. Kétszer egymás után eltalálva lekerül a listáról.` : 'Még nincs rontott kérdésed.'}</p>
        </a>
        <a className="card mode glow" href={href(subject.path, 'ismetles')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><Repeat size={24} className="mi" aria-hidden="true" /><h3>Ismétlés</h3>
          <p>{dueNow ? `Mára ${dueNow} kérdés esedékes.` : 'Mára nincs ismételnivaló.'} Az elrontottak 1, 3 és 7 nap múlva jönnek vissza.</p>
        </a>
        <a className="card mode glow" href={href(subject.path, 'szimulacio')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><Timer size={24} className="mi" aria-hidden="true" /><h3>ZH-szimuláció</h3>
          <p>{calc ? `${mock.minutes} perc, típusonként ${mock.perChapter} feladat, ${(mock.chapters ?? subject.chapters).length * mock.perChapter} feladat. Értékelés csak a végén.` : mock?.mix ? `${mock.minutes} perc, ${Object.values(mock.mix).reduce((a, b) => a + b, 0)} ZH-szintű kérdés. Értékelés csak a végén.` : '20 perc, 25 ZH-szintű kérdés, sok ábrással. Értékelés csak a végén.'}</p>
        </a>
        {cards > 0 && <>
          <a className="card mode glow" href={href(subject.path, 'flashcard')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><Layers size={24} className="mi" aria-hidden="true" /><h3>Flashcardok</h3>
          <p>{cards} fogalom a fogalomtárból.</p>
        </a>
          <a className="card mode glow" href={href(subject.path, 'parosito')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><Puzzle size={24} className="mi" aria-hidden="true" /><h3>Párosító</h3>
          <p>Párosíts 6 fogalmat a meghatározásával, minél gyorsabban.{best ? ` Legjobb időd: ${(best / 1000).toFixed(1)} mp.` : ''}</p>
        </a>
        </>}
        <a className="card mode glow wide" href={href(subject.path, 'utemterv')}>
          <ArrowUpRight className="go" size={22} aria-hidden="true" /><CalendarDays size={24} className="mi" aria-hidden="true" /><h3>Ütemterv</h3>
          <p>{zhDate > today() ? `${daysBetween(today(), zhDate)} nap a ZH-ig. Add meg, mikor kezdesz tanulni, és napokra bontjuk az anyagot.` : 'Add meg a ZH dátumát, és napokra bontjuk az anyagot.'}</p>
        </a>
      </div>

      <section className="weak" aria-labelledby="weak-h">
        <h2 id="weak-h">Gyenge pontok</h2>
        {weak.length ? (
          <>
            <p className="sub">Fejezetenként a legutóbbi válaszaid alapján, elöl az, ami a legkevésbé megy.</p>
            <ol className="weak-list">
              {weak.map((c) => (
                <li key={c.n}>
                  <a className="card weak-row glow" href={`${href(subject.path, 'gyakorlas')}?ch=${c.n}`}>
                    <b>{c.n}.</b>
                    <span className="weak-name">{c.title}<small>{Math.round(c.rate * 100)}% helyes, {c.seen} megválaszolt kérdésből</small></span>
                    <i style={{ '--p': c.rate }} aria-hidden="true" />
                    <span className="weak-go">Gyakorold<ArrowUpRight size={18} aria-hidden="true" /></span>
                  </a>
                </li>
              ))}
            </ol>
          </>
        ) : <p className="sub">Válaszolj néhány kérdésre, és itt látod, melyik fejezet megy a legkevésbé.</p>}
      </section>

      <button className="btn ghost" onClick={() => {
        if (confirm('Biztosan törlöd a haladásodat? A válaszaid, a rontott kérdéseid és a flashcard-állapotod elvész.')) { clearProgress(); refresh((n) => n + 1); }
      }}><Trash2 size={18} aria-hidden="true" />Haladás törlése</button>
    </div>
  );
}
