import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard.jsx';
import Ring from '../components/Ring.jsx';
import { getQuestions } from '../lib/data.js';
import { correctText, drawMock, MOCK_MIX, record } from '../lib/quiz.js';
import { href } from '../lib/route.js';

const LIMIT = 20 * 60;
const total = Object.values(MOCK_MIX).reduce((a, b) => a + b, 0);
const show = (q, r) => {
  if (r === undefined) return 'nincs válasz';
  if (typeof r === 'boolean') return r ? 'Igaz' : 'Hamis';
  if (typeof r === 'object') return Object.entries(r).map(([l, v]) => `${l}: ${v}`).join('\n');
  return r;
};

export default function Mock({ subject }) {
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

  const back = <a className="back" href={href(subject.id)}><ArrowLeft size={18} aria-hidden="true" />{subject.name}</a>;

  if (phase === 'intro') {
    return (
      <div className="wrap page narrow">{back}
        <div className="empty"><Clock size={36} aria-hidden="true" /><h1>ZH-szimuláció</h1>
          <p>20 perc, {total} kérdés a valódi ZH arányaival: {MOCK_MIX['igaz-hamis']} igaz–hamis, {MOCK_MIX.feleletvalasztos} feleletválasztós, {MOCK_MIX['rovid-valasz']} rövid válasz és {MOCK_MIX.abra} ábrás. A kérdések a fejezetek arányában jönnek. Visszajelzést csak a végén kapsz.</p>
          <button className="btn pri" onClick={() => { setQs(drawMock(getQuestions(subject.id))); setAnswers([]); setI(0); setLeft(LIMIT); setPhase('run'); }}>Indítás</button>
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

  const ok = answers.filter((a) => a?.ok).length;
  const chapters = subject.chapters.map((c) => {
    const idx = qs.map((q, k) => [q, k]).filter(([q]) => q.chapter === c.n);
    return { ...c, n: c.n, all: idx.length, ok: idx.filter(([, k]) => answers[k]?.ok).length };
  }).filter((c) => c.all);

  return (
    <div className="wrap page narrow">{back}
      <div className="result">
        <Ring value={qs.length ? ok / qs.length : 0} size={132} label={`Eredmény: ${ok} / ${qs.length}`} />
        <div><h1>{ok} / {qs.length} pont</h1><p className="lede">{left ? 'Beadtad a ZH-t.' : 'Lejárt az idő.'}</p>
          <button className="btn pri" onClick={() => setPhase('intro')}>Új ZH-szimuláció</button></div>
      </div>
      <h2 className="sub">Fejezetenként</h2>
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
