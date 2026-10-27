import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard.jsx';
import Ring from '../components/Ring.jsx';
import { scopeQuestions } from '../lib/data.js';
import { correctText, drawMock, MOCK_MIX, record } from '../lib/quiz.js';
import { href } from '../lib/route.js';

const MINUTES = 20;
const total = Object.values(MOCK_MIX).reduce((a, b) => a + b, 0);
const maxPoints = (qs) => qs.reduce((s, q) => s + (q.points ?? 1), 0);
const show = (q, r) => {
  if (r === undefined) return 'nincs válasz';
  if (typeof r === 'boolean') return r ? 'Igaz' : 'Hamis';
  if (typeof r === 'object') return Object.entries(r).map(([l, v]) => `${l}: ${v}`).join('\n');
  return r;
};

export default function Mock({ subject }) {
  const mock = subject.exam.mock;
  const LIMIT = (mock?.minutes ?? MINUTES) * 60;
  const [phase, setPhase] = useState('intro');
  const [qs, setQs] = useState([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [left, setLeft] = useState(LIMIT);

  useEffect(() => {
    if (phase !== 'run') return;
    const end = Date.now() + LIMIT * 1000;
    const t = setInterval(() => {
      const s = Math.max(0, Math.round((end - Date.now()) / 1000));
      setLeft(s);
      if (!s) setPhase('done');
    }, 250);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') qs.forEach((q, k) => answers[k] && record(q, answers[k].ok));
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const back = <a className="back" href={href(subject.path)}><ArrowLeft size={18} aria-hidden="true" />{subject.title}</a>;

  if (phase === 'intro') {
    return (
      <div className="wrap page narrow">{back}
        <div className="empty"><Clock size={36} aria-hidden="true" /><h1>ZH-szimuláció</h1>
          {mock
            ? <p>{mock.minutes} perc, feladattípusonként {mock.perChapter} feladat, összesen {maxPoints(drawMock(scopeQuestions(subject), mock))} pont. Részpont nincs: egy feladat csak akkor ér pontot, ha minden mezője jó. Visszajelzést csak a végén kapsz.</p>
            : <p>{MINUTES} perc, {total} ZH-szintű kérdés: {MOCK_MIX['igaz-hamis']} igaz–hamis, {MOCK_MIX.feleletvalasztos} feleletválasztós, {MOCK_MIX['rovid-valasz']} rövid válasz és {MOCK_MIX.abra} ábrás, mert a ZH-n sok lesz az ábrás kérdés. A kérdések a fejezetek arányában jönnek. Visszajelzést csak a végén kapsz.</p>}
          <button className="btn pri" onClick={() => { setQs(drawMock(scopeQuestions(subject), mock)); setAnswers([]); setI(0); setLeft(LIMIT); setPhase('run'); }}>Indítás</button>
        </div>
      </div>
    );
  }

  if (phase === 'run') {
    const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0');
    return (
      <div className="wrap page narrow">
        <div className="run-head">{back}
          <span className={`timer ${left < 120 ? 'low' : ''}`} role="timer" aria-label={`Hátralévő idő: ${mm} perc ${ss} másodperc`}>
            <Clock size={16} aria-hidden="true" />{mm}:{ss}</span>
        </div>
        <div className="progress" aria-hidden="true"><i style={{ width: `${(i / qs.length) * 100}%` }} /></div>
        <p className="count">{i + 1} / {qs.length}</p>
        <QuestionCard key={i} q={qs[i]} feedback={false} onNext={() => {}}
          onAnswer={(ok, r) => {
            const next = [...answers]; next[i] = { ok, r }; setAnswers(next);
            setTimeout(() => (i + 1 < qs.length ? setI(i + 1) : setPhase('done')), 220);
          }} />
        <button className="btn ghost" onClick={() => setPhase('done')}>Beadás most</button>
      </div>
    );
  }

  // Calculation ZH: points of the fully right tasks; otherwise one point per question.
  const ok = qs.reduce((s, q, k) => s + (answers[k]?.ok ? q.points ?? 1 : 0), 0);
  const max = maxPoints(qs);
  const chapters = subject.chapters.map((c) => {
    const idx = qs.map((q, k) => [q, k]).filter(([q]) => q.chapter === c.n);
    return { ...c, n: c.n, all: idx.length, ok: idx.filter(([, k]) => answers[k]?.ok).length };
  }).filter((c) => c.all);

  return (
    <div className="wrap page narrow">{back}
      <div className="result">
        <Ring value={max ? ok / max : 0} size={132} label={`Eredmény: ${ok} / ${max}`} />
        <div><h1>{ok} / {max} pont</h1><p className="lede">{left ? 'Beadtad a ZH-t.' : 'Lejárt az idő.'}</p>
          <button className="btn pri" onClick={() => setPhase('intro')}>Új ZH-szimuláció</button></div>
      </div>
      <h2 className="sub">{mock ? 'Feladattípusonként' : 'Fejezetenként'}</h2>
      <ul className="breakdown">
        {chapters.map((c) => (
          <li key={c.n}><span>{c.n}. {c.short}</span><i><b style={{ width: `${(c.ok / c.all) * 100}%` }} /></i><span>{c.ok} / {c.all}</span></li>
        ))}
      </ul>
      <h2 className="sub">Kérdésenként</h2>
      <ol className="review">
        {qs.map((q, k) => {
          const a = answers[k];
          return (
            <li key={q.id} className={a?.ok ? 'right' : 'wrong'}>
              <b>{a?.ok ? <CheckCircle2 size={18} aria-label="Helyes" /> : <XCircle size={18} aria-label="Hibás" />}{q.question}</b>
              <p>Válaszod: <span className="pre">{show(q, a?.r)}</span></p>
              {!a?.ok && <p>Helyes válasz: <span className="pre">{correctText(q)}</span></p>}
              <p className="muted">{q.explanation} <small>Forrás: {q.source}</small></p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
