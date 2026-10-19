import { ArrowRight, Clock } from 'lucide-react';
import Ring from '../components/Ring.jsx';
import { getScope, scopeQuestions } from '../lib/data.js';
import { href } from '../lib/route.js';
import { load } from '../lib/storage.js';

// Consumer optimum drawn to scale: budget line y = 180 - 0.75x, indifference curves xy = k;
// k = 10800 touches the budget line at (120, 90). Origin of the plot is at (36, 214) in the SVG.
const O = [36, 214];
const pt = (x, y) => `${(O[0] + x).toFixed(1)} ${(O[1] - y).toFixed(1)}`;
const ic = (k) => {
  const xs = [];
  for (let x = k / 196; x <= 268; x += 4) xs.push(x);
  return 'M' + xs.map((x) => pt(x, k / x)).join('L');
};

function ExamPlot() {
  return (
    <svg className="exam-curve" viewBox="0 0 320 240" aria-hidden="true">
      <path className="hp-axis" d={`M${pt(0, 204)}V${O[1]}H${O[0] + 276}`} />
      <path className="hp-ic" d={ic(6000)} />
      <path className="hp-ic hot" d={ic(10800)} />
      <path className="hp-ic" d={ic(17000)} />
      <path className="hp-budget" pathLength="1" d={`M${pt(0, 180)}L${pt(240, 0)}`} />
      <path className="hp-guide" d={`M${pt(120, 90)}V${O[1]}M${pt(120, 90)}H${O[0]}`} />
      <circle className="hp-dot" cx={O[0] + 120} cy={O[1] - 90} r="6" />
    </svg>
  );
}

// Subject landing: one card per ZH; each opens the practice modes for that ZH's chapters.
export default function Hub({ subject }) {
  const answers = load('answers', {});
  return (
    <>
      <section className="hero hub-hero">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="grain" aria-hidden="true" />
        <div className="wrap">
          <h1>{subject.name}</h1>
          <p className="lede">{subject.sources}. Válaszd ki, melyik zárthelyire készülsz.</p>
        </div>
      </section>
      <div className="wrap exams">
        {subject.exams.map((e) => {
          if (!e.active) {
            return (
              <div key={e.id} className="card exam soon-exam" aria-disabled="true">
                <span className="exam-no">{e.name}</span>
                <p><Clock size={18} aria-hidden="true" />Hamarosan. Az anyaga később kerül fel.</p>
              </div>
            );
          }
          const scope = getScope(subject, e.id);
          const qs = scopeQuestions(scope);
          const done = qs.filter((q) => answers[q.id]).length;
          return (
            <a key={e.id} className="card exam glow" href={href(scope.path)}>
              <ExamPlot />
              <div className="exam-top">
                <span className="exam-no">{e.name}</span>
                <Ring value={qs.length ? done / qs.length : 0} size={96} label={`Haladás: ${done} / ${qs.length}`} />
              </div>
              <p className="exam-sum">{scope.chapters.length} fejezet, {qs.length} kérdés, ebből {qs.filter((q) => q.official).length} valódi gyakorló ZH-kérdés.</p>
              <ol className="exam-ch">
                {scope.chapters.map((c) => {
                  const cq = qs.filter((q) => q.chapter === c.n);
                  const cd = cq.filter((q) => answers[q.id]).length;
                  return (
                    <li key={c.n}>
                      <b>{c.n}</b><span>{c.short}</span>
                      <i aria-label={`${cd} / ${cq.length}`}><em style={{ width: `${cq.length ? (cd / cq.length) * 100 : 0}%` }} /></i>
                    </li>
                  );
                })}
              </ol>
              <span className="btn pri exam-go">Gyakorlás<ArrowRight size={18} aria-hidden="true" /></span>
            </a>
          );
        })}
      </div>
    </>
  );
}
