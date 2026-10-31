import { useEffect, useMemo, useRef, useState } from 'react';
import { BadgeCheck, CheckCircle2, CornerDownLeft, Flag, Send, XCircle } from 'lucide-react';
import { figures } from '../figures/index.js';
import { accountsEnabled, sendTicket, useAccount } from '../lib/account.js';
import { correctText, fieldCorrect, isCorrect, isTrueFalse, RELACIO, shuffle, TYPES } from '../lib/quiz.js';
import { href } from '../lib/route.js';

const KEY_TF = { i: true, h: false };

// "Hibás a kérdés?": sends a bug-report ticket naming the question, so the owner can fix it.
function Report({ q }) {
  const { profile } = useAccount();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [state, setState] = useState('');
  if (!accountsEnabled) return <span />;
  if (state === 'sent') return <p className="report-done" role="status">Köszönjük, megkaptuk a jelzést.</p>;
  if (!open) return <button className="report-btn" onClick={() => setOpen(true)}><Flag size={16} aria-hidden="true" />Hibás a kérdés?</button>;
  if (!profile?.neptun) return <p className="report-done"><a href={href('fiok')}>Jelentkezz be</a>, és jelezheted a hibát.</p>;
  const send = async (e) => {
    e.preventDefault();
    setState('busy');
    const message = `Hibás kérdés: ${q.id}\n${q.question.slice(0, 400)}${text.trim() ? `\n\n${text.trim()}` : ''}`;
    try { await sendTicket({ kind: 'hiba', message }); setState('sent'); }
    catch (err) { setState(err.message); }
  };
  return (
    <form className="reply-form report-form" onSubmit={send}>
      <textarea value={text} maxLength={1500} rows={2} autoFocus aria-label="Mi a hiba?"
        placeholder="Mi a hiba? (nem kötelező)" onChange={(e) => setText(e.target.value)} />
      <button className="btn sec" disabled={state === 'busy'}><Send size={18} aria-hidden="true" />Küldés</button>
      {state && state !== 'busy' && <p className="auth-error" role="alert">{state}</p>}
    </form>
  );
}

// Step-by-step derivation of a calculation task; `steps` is the easiest way, `solutions` the other ways.
export const Steps = ({ q }) => (
  <div className="steps"><strong>Levezetés{q.solutions ? ' (a legegyszerűbb út)' : ''}</strong><ol>{q.steps.map((s) => <li key={s}>{s}</li>)}</ol>
    {q.solutions?.map((m) => (
      <details key={m.title} className="alt-sol"><summary>Másik megoldás: {m.title}</summary><ol>{m.steps.map((s) => <li key={s}>{s}</li>)}</ol></details>
    ))}
  </div>
);

// "Miért rossz?": why each wrong option is wrong; the one the student picked comes first.
export const Why = ({ q, picked }) => {
  const list = Object.entries(q.why).sort(([a], [b]) => (b === picked) - (a === picked));
  return (
    <details className="why" open={picked in q.why}>
      <summary>Miért rossz{list.length > 1 ? 'ak a többi válaszok' : ' a másik válasz'}?</summary>
      <ul>{list.map(([o, w]) => <li key={o} className={o === picked ? 'picked' : ''}><b>{o}</b> {w}</li>)}</ul>
    </details>
  );
};

// One question; the parent remounts it (via key) for each new question.
// In practice mode it shows feedback after answering; in mock mode it only reports the response.
export default function QuestionCard({ q, feedback, onAnswer, onOverride, onNext, nextLabel = 'Következő' }) {
  const [response, setResponse] = useState(null);
  const [text, setText] = useState('');
  const [pairs, setPairs] = useState({});
  const [nums, setNums] = useState({});
  const [marks, setMarks] = useState([]);
  const [got, setGot] = useState([]);
  const [written, setWritten] = useState(false);
  // Relációanalízis keeps the fixed A–E order of the ZH.
  const options = useMemo(() => (q.type === 'relacio' ? Object.keys(RELACIO) : q.options ? shuffle(q.options) : null), [q]);
  const rights = useMemo(() => (q.type === 'parositas' ? shuffle(q.answer.map(([, r]) => r)) : null), [q]);
  const nextRef = useRef(null);
  const stemRef = useRef(null);
  const answered = response !== null;
  const [overridden, setOverridden] = useState(false);
  const correct = answered && (overridden || isCorrect(q, response));
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
  const calc = q.type === 'szamolas';

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const typing = ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName);
      if (e.key === 'Enter') {
        if (answered && feedback && !['BUTTON', 'TEXTAREA'].includes(e.target.tagName)) { e.preventDefault(); onNext(); }
        return;
      }
      if (answered || typing) return;
      const k = e.key.toLowerCase();
      if (isTrueFalse(q) && k in KEY_TF) submit(KEY_TF[k]);
      else if (options && /^[1-9]$/.test(k) && +k <= options.length) submit(options[+k - 1]);
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
        {calc ? <span className="qpoints">Feladat {q.section}<b>{q.points},00 pont szerezhető</b></span> : <span>{TYPES[q.type]}, {q.section}</span>}
        {q.official && <span className="badge"><BadgeCheck size={15} aria-hidden="true" />Valódi gyakorló ZH-kérdés</span>}
      </div>
      {Fig && <div className="qfig"><Fig /></div>}
      <h2 className="qstem" ref={stemRef} tabIndex={-1}>{q.question}</h2>
      {q.type === 'relacio' && (
        <p className="relacio">{q.statements[0]} <b>MERT</b> {q.statements[1]}</p>
      )}

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
              <kbd>{i + 1}</kbd>{q.type === 'relacio' ? `${o}) ${RELACIO[o]}` : o}
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

      {q.type === 'tobbszoros' && (
        <form className="multi" onSubmit={(e) => { e.preventDefault(); submit(q.statements.map((_, k) => !!marks[k])); }}>
          <p className="multi-hint">Jelöld be az összes igaz állítást (több is lehet, vagy egy sem).</p>
          {q.statements.map((st, k) => {
            const ok = answered && feedback ? !!marks[k] === st.answer : null;
            return (
              <label key={st.text} className={`multi-row ${ok === null ? '' : ok ? 'right' : 'wrong'}`}>
                <input type="checkbox" checked={!!marks[k]} disabled={answered}
                  onChange={(e) => { const m = [...marks]; m[k] = e.target.checked; setMarks(m); }} />
                <span>{st.text}</span>
                {ok !== null && <em>{st.answer ? 'Igaz' : 'Hamis'}</em>}
              </label>
            );
          })}
          <button className="btn pri" disabled={answered}><CornerDownLeft size={18} aria-hidden="true" />Beküldés</button>
        </form>
      )}

      {q.type === 'kifejtos' && (
        <form className="essay" onSubmit={(e) => { e.preventDefault(); if (!written) setWritten(true); else submit({ text, got }); }}>
          <label htmlFor={`e-${q.id}`} className="sr">Válasz</label>
          <textarea id={`e-${q.id}`} value={text} rows={6} disabled={written} onChange={(e) => setText(e.target.value)}
            placeholder="Írd le a válaszod, mintha a ZH-n lennél" />
          {written && (
            <fieldset className="essay-check" disabled={answered}>
              <legend>Pipáld ki, melyik pont van benne a válaszodban</legend>
              {q.answer.map((a, k) => (
                <label key={a} className="multi-row">
                  <input type="checkbox" checked={got.includes(k)}
                    onChange={(e) => setGot(e.target.checked ? [...got, k] : got.filter((x) => x !== k))} />
                  <span>{a}</span>
                </label>
              ))}
            </fieldset>
          )}
          <button className="btn pri" disabled={answered || (!written && !text.trim())}>
            <CornerDownLeft size={18} aria-hidden="true" />{written ? 'Pontozás' : 'Mintaválasz megnézése'}
          </button>
        </form>
      )}

      {calc && (
        <form className={`calc${q.fields.some((f) => f.label.length > 8) ? ' long' : ''}`} onSubmit={(e) => { e.preventDefault(); submit(nums); }}>
          {q.fields.map((f) => {
            const ok = answered && feedback ? fieldCorrect(f, nums[f.label]) : null;
            return (
              <label key={f.label} className="calc-row">
                <span>{f.label}</span>
                <input value={nums[f.label] ?? ''} disabled={answered} inputMode={f.accept === 'text' ? 'text' : 'decimal'} autoComplete="off"
                  aria-describedby={`fmt-${q.id}-${f.label}`} onChange={(e) => setNums({ ...nums, [f.label]: e.target.value })} />
                {ok !== null && (ok ? <CheckCircle2 className="tick ok" size={22} aria-label="Helyes" /> : <XCircle className="tick bad" size={22} aria-label="Hibás" />)}
                {ok === false && <em className="calc-key">Helyes: {f.answer}</em>}
                <small id={`fmt-${q.id}-${f.label}`}>{f.format}</small>
              </label>
            );
          })}
          <button className="btn pri" disabled={answered}><CornerDownLeft size={18} aria-hidden="true" />Ellenőrzés</button>
        </form>
      )}

      {answered && feedback && (
        <div className={`fb ${correct ? 'right' : 'wrong'}`} role="status">
          <b>{correct ? <CheckCircle2 size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}
            {calc ? (correct ? `Helyes, ${q.points} pont` : 'Nem minden mező jó, 0 pont')
              : q.type === 'kifejtos' ? `${response.got.length} / ${q.answer.length} pont van meg a válaszodban`
              : q.type === 'tobbszoros' ? `${q.statements.filter((st, k) => response[k] === st.answer).length} / ${q.statements.length} állítás jó`
              : correct ? 'Helyes válasz' : 'Nem jó válasz'}</b>
          {(!correct || q.type === 'rovid-valasz') && !calc && !['tobbszoros', 'kifejtos'].includes(q.type) && (
            <p className="fb-answer"><span>{q.type === 'rovid-valasz' ? 'Mintaválasz' : 'A helyes válasz'}:</span> {correctText(q)}</p>
          )}
          {calc && <Steps q={q} />}
          <p>{q.explanation}</p>
          {q.why && <Why q={q} picked={response} />}
          <small>Forrás: {q.source}</small>
          {/* The check can't know every wording, so the student can count a right answer given in other words. */}
          {q.type === 'rovid-valasz' && !correct && onOverride && (
            <button className="btn sec override" onClick={() => { setOverridden(true); onOverride(); }}>
              <CheckCircle2 size={18} aria-hidden="true" />Más szavakkal, de ugyanezt írtam
            </button>
          )}
        </div>
      )}

      {answered && feedback && (
        <div className="qnext">
          <Report q={q} />
          <button ref={nextRef} className="btn pri" onClick={onNext}>{nextLabel}<CornerDownLeft size={18} aria-hidden="true" /></button>
        </div>
      )}
    </article>
  );
}
