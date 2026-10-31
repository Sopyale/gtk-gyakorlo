import { useState } from 'react';
import { ArrowLeft, CalendarDays, Check, Play, RotateCcw, Timer, Undo2 } from 'lucide-react';
import { scopeQuestions } from '../lib/data.js';
import { addDays, daysBetween, schedule, tick, today } from '../lib/plan.js';
import { href } from '../lib/route.js';
import { load, save } from '../lib/storage.js';

const label = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('hu-HU', { weekday: 'long', month: 'long', day: 'numeric' });

// Ütemterv: the ZH date comes from subjects.json (the student can change it) and the student picks the day they start;
// the days in between get the chapters, the last day is review.
export default function Plan({ subject }) {
  const key = `plan:${subject.path}`;
  const [stored, setPlan] = useState(() => load(key, { date: '', start: '', done: {} }));
  const update = (next) => { save(key, next); setPlan(next); };
  const now = today();
  const plan = { ...stored, date: stored.date || subject.exam.date || '', start: stored.start || now };
  const qs = scopeQuestions(subject);
  const answers = load('answers', {});
  const back = <a className="back" href={href(subject.path)}><ArrowLeft size={18} aria-hidden="true" />{subject.title}</a>;

  const chapter = (n) => subject.chapters.find((c) => c.n === n);
  const progress = (n) => {
    const cq = qs.filter((q) => q.chapter === n);
    return cq.length ? cq.filter((q) => answers[q.id]).length / cq.length : 0;
  };
  const practice = (ns) => href(subject.path, 'gyakorlas') + `?ch=${ns.join(',')}`;
  const left = plan.date ? daysBetween(now, plan.date) : null;
  const weights = subject.chapters.map((c) => ({ n: c.n, weight: qs.filter((q) => q.chapter === c.n).length }));
  const { done, upcoming } = left > 0 && plan.start < plan.date ? schedule(weights, plan, now) : { done: [], upcoming: [] };
  const chList = (ns) => (
    <ul className="plan-ch">
      {ns.map((n) => (
        <li key={n}>
          <b>{n}</b><span>{chapter(n).title}</span>
          <i aria-label={`${Math.round(progress(n) * 100)}% kész`}><em style={{ width: `${progress(n) * 100}%` }} /></i>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="wrap page narrow">
      {back}
      <h1 className="page-title">Ütemterv</h1>
      <p className="lede">Válaszd ki, mikor kezdesz tanulni, és a ZH napjáig szétosztjuk a fejezeteket a kérdések száma szerint. Ha legalább három napod van, az utolsó nap ismétlés. Bármelyik napot előre is gyakorolhatod.</p>

      <form className="card plan-date" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="zh-date"><CalendarDays size={20} aria-hidden="true" />A ZH napja</label>
        <input id="zh-date" type="date" min={addDays(now, 1)} value={plan.date}
          onChange={(e) => update({ ...plan, date: e.target.value, done: {} })} />
        <label htmlFor="start-date"><Play size={20} aria-hidden="true" />Ekkor kezdek tanulni</label>
        <input id="start-date" type="date" max={plan.date && addDays(plan.date, -1)} value={plan.start}
          onChange={(e) => e.target.value && update({ ...plan, start: e.target.value, done: {} })} />
        {left > 0 && <p className="plan-left"><b>{left}</b> nap van hátra</p>}
      </form>

      {plan.date && left <= 0 && (
        <p className="note">{left === 0 ? 'Ma van a ZH. Sok sikert!' : 'Ez a dátum már elmúlt. Adj meg egy újat.'}</p>
      )}
      {plan.start >= plan.date && left > 0 && <p className="note">A kezdés napja legyen a ZH előtt.</p>}
      {upcoming.length > 0 && (
        <ol className="plan">
          {done.map((d) => (
            <li key={d.date} className="plan-day done">
              <details className="card">
                <summary className="plan-head">
                  <span className="plan-when"><Check size={18} aria-hidden="true" />{label(d.date)}</span>
                  <span className="plan-sum">{d.chapters.length ? `${d.chapters.length} fejezet kész` : 'Kész'}</span>
                </summary>
                {d.chapters.length > 0 && chList(d.chapters)}
                <button className="chip plan-check" aria-pressed="true" onClick={() => {
                  const rest = { ...plan.done }; delete rest[d.date]; update({ ...plan, done: rest });
                }}><Undo2 size={16} aria-hidden="true" />Mégsem kész</button>
              </details>
            </li>
          ))}
          {upcoming.map((d, i) => {
            const today = d.date === now;
            return (
              <li key={d.date} className={`plan-day ${today ? 'today' : ''}`}>
                {/* Every day stays open to practise; only today starts unfolded. */}
                <details className="card" open={i === 0}>
                  <summary className="plan-head">
                    <span className="plan-when">{label(d.date)}{today && <em>Ma</em>}</span>
                    <span className="plan-sum">{d.chapters ? d.chapters.map((n) => chapter(n).short).join(', ') : 'Ismétlés'}</span>
                  </summary>
                  {d.chapters ? (
                    <>
                      {chList(d.chapters)}
                      <div className="cta">
                        <a className="btn pri" href={practice(d.chapters)}><Play size={18} aria-hidden="true" />{today ? 'Mai fejezetek gyakorlása' : 'Gyakorlás'}</a>
                        <button className="btn sec" onClick={() => update(tick(plan, d.chapters, now))}><Check size={18} aria-hidden="true" />Kész</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="plan-review">Ismétlés: a rontott kérdések, utána egy teljes ZH-szimuláció.</p>
                      <div className="cta">
                        <a className="btn pri" href={href(subject.path, 'rontott')}><RotateCcw size={18} aria-hidden="true" />Rontott kérdések</a>
                        <a className="btn sec" href={href(subject.path, 'szimulacio')}><Timer size={18} aria-hidden="true" />ZH-szimuláció</a>
                        <button className="btn sec" onClick={() => update(tick(plan, [], now))}><Check size={18} aria-hidden="true" />Kész</button>
                      </div>
                    </>
                  )}
                </details>
              </li>
            );
          })}
          <li className="plan-zh"><span>{label(plan.date)}</span><b>ZH</b></li>
        </ol>
      )}
      {upcoming.length > 0 && <p className="note">Ha előrébb jársz, a „Kész” gombbal jelöld: a maradék anyagot újraosztjuk a hátralévő napokra.</p>}
    </div>
  );
}
