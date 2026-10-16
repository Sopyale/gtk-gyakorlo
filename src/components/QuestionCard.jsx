import { useEffect, useMemo, useRef, useState } from 'react';
import { BadgeCheck, CheckCircle2, CornerDownLeft, XCircle } from 'lucide-react';
import { figures } from '../figures/index.js';
import { correctText, isCorrect, isTrueFalse, shuffle, TYPES } from '../lib/quiz.js';

const KEY_TF = { i: true, h: false };

// One question; the parent remounts it (via key) for each new question.
// In practice mode it shows feedback after answering; in mock mode it only reports the response.
export default function QuestionCard({ q, feedback, onAnswer, onNext, nextLabel = 'Következő' }) {
  const [response, setResponse] = useState(null);
  const [text, setText] = useState('');
  const [pairs, setPairs] = useState({});
  const options = useMemo(() => (q.options ? shuffle(q.options) : null), [q]);
  const rights = useMemo(() => (q.type === 'parositas' ? shuffle(q.answer.map(([, r]) => r)) : null), [q]);
  const nextRef = useRef(null);
  const stemRef = useRef(null);
  const answered = response !== null;
  const correct = answered && isCorrect(q, response);
  const Fig = q.figure && figures[q.figure];

  useEffect(() => { if (answered && feedback) nextRef.current?.focus(); }, [answered, feedback]);
  // Keep keyboard focus inside the card when the previous one unmounts.
  useEffect(() => { if (document.activeElement === document.body) stemRef.current?.focus({ preventScroll: true }); }, []);

  const submit = (value) => {
    if (answered) return;
    setResponse(value);
    onAnswer(isCorrect(q, value), value);
  };

  const canSubmitPairs = q.type === 'parositas' && q.answer.every(([l]) => pairs[l]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const typing = e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT';
      if (e.key === 'Enter') {
        if (answered && feedback && e.target.tagName !== 'BUTTON') { e.preventDefault(); onNext(); }
        return;
      }
      if (answered || typing) return;
      const k = e.key.toLowerCase();
      if (isTrueFalse(q) && k in KEY_TF) submit(KEY_TF[k]);
      else if (options && /^[1-4]$/.test(k)) submit(options[+k - 1]);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  const state = (value) => {
    if (!answered || !feedback) return answered && value === response ? 'picked' : '';
    if (value === q.answer) return 'right';
    return value === response ? 'wrong' : 'dim';
  };

  return (
    <article className={`qcard ${answered && feedback ? (correct ? 'is-right' : 'is-wrong') : ''}`}>
      <div className="qmeta">
        <span>{TYPES[q.type]}, {q.section}</span>
        {q.official && <span className="badge"><BadgeCheck size={15} aria-hidden="true" />Valódi gyakorló ZH-kérdés</span>}
      </div>
      {Fig && <div className="qfig"><Fig /></div>}
      <h2 className="qstem" ref={stemRef} tabIndex={-1}>{q.question}</h2>

      {isTrueFalse(q) && (
        <div className="opts two">
          {[true, false].map((v) => (
            <button key={String(v)} className={`opt ${state(v)}`} disabled={answered} onClick={() => submit(v)}>
              <kbd>{v ? 'I' : 'H'}</kbd>{v ? 'Igaz' : 'Hamis'}
            </button>
          ))}
        </div>
      )}

      {options && !isTrueFalse(q) && (
        <div className="opts">
          {options.map((o, i) => (
            <button key={o} className={`opt ${state(o)}`} disabled={answered} onClick={() => submit(o)}>
              <kbd>{i + 1}</kbd>{o}
            </button>
          ))}
        </div>
      )}

      {q.type === 'rovid-valasz' && (
        <form className="short" onSubmit={(e) => { e.preventDefault(); if (text.trim()) submit(text); }}>
          <label htmlFor={`a-${q.id}`} className="sr">Válasz</label>
          <input id={`a-${q.id}`} value={text} onChange={(e) => setText(e.target.value)} disabled={answered}
            autoComplete="off" placeholder="Írd be a választ" autoFocus />
          <button className="btn pri" disabled={answered || !text.trim()}><CornerDownLeft size={18} aria-hidden="true" />Beküldés</button>
        </form>
      )}

      {q.type === 'parositas' && (
        <form className="match" onSubmit={(e) => { e.preventDefault(); if (canSubmitPairs) submit(pairs); }}>
          {q.answer.map(([left]) => {
            const ok = answered && feedback ? pairs[left] === q.answer.find(([l]) => l === left)[1] : null;
            return (
              <label key={left} className={`pair ${ok === null ? '' : ok ? 'right' : 'wrong'}`}>
                <span>{left}</span>
                <select value={pairs[left] || ''} disabled={answered}
                  onChange={(e) => setPairs({ ...pairs, [left]: e.target.value })}>
                  <option value="" disabled>Válassz…</option>
                  {rights.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
            );
          })}
          <button className="btn pri" disabled={answered || !canSubmitPairs}><CornerDownLeft size={18} aria-hidden="true" />Beküldés</button>
        </form>
      )}

      {answered && feedback && (
        <div className={`fb ${correct ? 'right' : 'wrong'}`} role="status">
          <b>{correct ? <CheckCircle2 size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}
            {correct ? 'Helyes válasz' : 'Nem jó válasz'}</b>
          {(!correct || q.type === 'rovid-valasz') && (
            <p className="fb-answer"><span>{q.type === 'rovid-valasz' ? 'Mintaválasz' : 'A helyes válasz'}:</span> {correctText(q)}</p>
          )}
          <p>{q.explanation}</p>
          <small>Forrás: {q.source}</small>
        </div>
      )}

      {answered && feedback && (
        <div className="qnext">
          <button ref={nextRef} className="btn pri" onClick={onNext}>{nextLabel}<CornerDownLeft size={18} aria-hidden="true" /></button>
        </div>
      )}
    </article>
  );
}
