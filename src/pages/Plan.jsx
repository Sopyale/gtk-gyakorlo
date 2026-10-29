import { useState } from 'react';
import { ArrowLeft, CalendarDays, Check, Play, RefreshCw, RotateCcw, Timer } from 'lucide-react';
import { scopeQuestions } from '../lib/data.js';
import { addDays, daysBetween, planDays, today } from '../lib/plan.js';
import { href } from '../lib/route.js';
import { load, save } from '../lib/storage.js';

const label = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('hu-HU', { weekday: 'long', month: 'long', day: 'numeric' });

// Ütemterv: the student sets the ZH date; the days until then get the chapters, the last day is review.
export default function Plan({ subject }) {
  const key = `plan:${subject.path}`;
  const [plan, setPlan] = useState(() => load(key, { date: '', start: '', done: {} }));
  const update = (next) => { save(key, next); setPlan(next); };
  const now = today();
  const qs = scopeQuestions(subject);
  const answers = load('answers', {});
  const back = <a className="back" href={href(subject.path)}><ArrowLeft size={18} aria-hidden="true" />{subject.title}</a>;

  const days = plan.date && plan.start ? daysBetween(plan.start, plan.date) : 0;
  const review = days >= 3; // with only two days left, both go to new material
  const weights = subject.chapters.map((c) => ({ n: c.n, weight: qs.filter((q) => q.chapter === c.n).length }));
  const slots = days > 0 ? planDays(weights, review ? days - 1 : days) : [];
  const chapter = (n) => subject.chapters.find((c) => c.n === n);
  const progress = (n) => {
    const cq = qs.filter((q) => q.chapter === n);
    return cq.length ? cq.filter((q) => answers[q.id]).length / cq.length : 0;
  };
  const practice = (ns) => href(subject.path, 'gyakorlas') + `?ch=${ns.join(',')}`;
  const left = plan.date ? daysBetween(now, plan.date) : null;

  return (
    <div className="wrap page narrow">
      {back}
      <h1 className="page-title">Ütemterv</h1>
      <p className="lede">Add meg, mikor írod a ZH-t, és a hátralévő napokra szétosztjuk a fejezeteket a kérdések száma szerint. Ha legalább három nap van hátra, az utolsó nap ismétlés.</p>

      <form className="card plan-date" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="zh-date"><CalendarDays size={20} aria-hidden="true" />A ZH napja</label>
        <input id="zh-date" type="date" min={addDays(now, 1)} value={plan.date}
          onChange={(e) => update({ date: e.target.value, start: now, done: {} })} />
        {left > 0 && <p className="plan-left"><b>{left}</b> nap van hátra</p>}
      </form>

      {plan.date && left <= 0 && (
        <p className="note">{left === 0 ? 'Ma van a ZH. Sok sikert!' : 'Ez a dátum már elmúlt. Adj meg egy újat.'}</p>
      )}
      {plan.start && plan.start < now && left > 0 && (
        <button className="btn sec plan-reset" onClick={() => update({ ...plan, start: now, done: {} })}>
          <RefreshCw size={18} aria-hidden="true" />Újratervezés mától
        </button>
      )}

      {days > 0 && left > 0 && (
        <ol className="plan">
          {Array.from({ length: days }, (_, i) => {
            const date = addDays(plan.start, i);
            const ns = slots[i];
            const done = Boolean(plan.done[date]);
            const state = date === now ? 'today' : date < now ? 'past' : '';
            return (
              <li key={date} className={`card plan-day ${state} ${done ? 'done' : ''}`}>
                <div className="plan-head">
                  <span className="plan-when">{label(date)}{state === 'today' && <em>Ma</em>}</span>
                  <button className={`chip plan-check`} aria-pressed={done}
                    onClick={() => update({ ...plan, done: { ...plan.done, [date]: !done } })}>
                    <Check size={16} aria-hidden="true" />{done ? 'Kész' : 'Kész?'}
                  </button>
                </div>
                {ns ? (
                  <>
                    <ul className="plan-ch">
                      {ns.map((n) => (
                        <li key={n}>
                          <b>{n}</b><span>{chapter(n).title}</span>
                          <i aria-label={`${Math.round(progress(n) * 100)}% kész`}><em style={{ width: `${progress(n) * 100}%` }} /></i>
                        </li>
                      ))}
                    </ul>
                    <a className="btn pri" href={practice(ns)}><Play size={18} aria-hidden="true" />Mai fejezetek gyakorlása</a>
                  </>
                ) : (
                  <>
                    <p className="plan-review">Ismétlés: a rontott kérdések, utána egy teljes ZH-szimuláció.</p>
                    <div className="cta">
                      <a className="btn pri" href={href(subject.path, 'rontott')}><RotateCcw size={18} aria-hidden="true" />Rontott kérdések</a>
                      <a className="btn sec" href={href(subject.path, 'szimulacio')}><Timer size={18} aria-hidden="true" />ZH-szimuláció</a>
                    </div>
                  </>
                )}
              </li>
            );
          })}
          <li className="plan-zh"><span>{label(plan.date)}</span><b>ZH</b></li>
        </ol>
      )}
    </div>
  );
}
