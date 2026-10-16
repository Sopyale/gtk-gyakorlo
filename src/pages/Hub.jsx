import { ArrowRight, Clock } from 'lucide-react';
import Ring from '../components/Ring.jsx';
import { getScope, scopeQuestions } from '../lib/data.js';
import { href } from '../lib/route.js';
import { load } from '../lib/storage.js';

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
              <svg className="exam-curve" viewBox="0 0 320 240" aria-hidden="true">
                <path className="hp-ic" d="M60 20C80 120 140 180 310 196" />
                <path className="hp-ic hot" d="M110 14C128 100 180 150 316 160" />
                <line className="hp-budget" x1="40" y1="60" x2="300" y2="226" />
              </svg>
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
