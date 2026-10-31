import { ArrowRight, Clock } from 'lucide-react';
import Countdown from '../components/Countdown.jsx';
import Ring from '../components/Ring.jsx';
import SubjectArt from '../components/SubjectArt.jsx';
import { getScope, scopeQuestions } from '../lib/data.js';
import { today } from '../lib/plan.js';
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
        <div className="wrap hub-grid">
          <div>
            <h1>{subject.name}</h1>
            <p className="lede">{subject.sources}. Válaszd ki, melyik zárthelyire készülsz.</p>
          </div>
          <SubjectArt id={subject.id} className="hero-plot hub-art" />
        </div>
      </section>
      <div className="wrap exams">
        {subject.exams.map((e) => {
          // A ZH that was already written disappears; one still to come shows "Hamarosan".
          if (!e.active && e.date && e.date < today()) return null;
          if (!e.active) {
            return (
              <div key={e.id} className="card exam soon-exam" aria-disabled="true">
                <span className="exam-no">{e.name}</span>
                <p><Clock size={18} aria-hidden="true" />Hamarosan. Az anyaga később kerül fel.</p>
                <Countdown subject={subject} exam={e} />
              </div>
            );
          }
          const scope = getScope(subject, e.id);
          const qs = scopeQuestions(scope);
          const done = qs.filter((q) => answers[q.id]).length;
          return (
            <a key={e.id} className="card exam glow" href={href(scope.path)}>
              <SubjectArt id={subject.id} className="exam-curve" />
              <div className="exam-top">
                <span className="exam-no">{e.name}</span>
                <Ring value={qs.length ? done / qs.length : 0} size={96} label={`Haladás: ${done} / ${qs.length}`} />
              </div>
              <p className="exam-sum">{e.mock?.perChapter ? `${scope.chapters.length} feladattípus, ${qs.length} gyakorló feladat.` : `${scope.chapters.length} fejezet, ${qs.length} kérdés.`}</p>
              <Countdown subject={subject} exam={e} />
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
