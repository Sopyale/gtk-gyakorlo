import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, CircleCheck, CircleX, RotateCw, X } from 'lucide-react';
import { scopeGlossary } from '../lib/data.js';
import { checkDefinition, definitionVerdict, shuffle } from '../lib/quiz.js';
import { href } from '../lib/route.js';
import { load, save } from '../lib/storage.js';
import { loadModel, similarity } from '../lib/similarity.js';

const VERDICT = { jo: 'Jó definíció', reszben: 'Részben jó', rossz: 'Ez még hiányos' };

// Unknown cards go back to the end of the deck until the student knows them.
export default function Flashcards({ subject }) {
  const glossary = useMemo(() => scopeGlossary(subject), [subject.path]);
  const [deck, setDeck] = useState(() => {
    const known = load('cards', {});
    return shuffle(glossary.filter((g) => !known[g.term])).concat(shuffle(glossary.filter((g) => known[g.term])));
  });
  const [flipped, setFlipped] = useState(false);
  const [write, setWrite] = useState(() => load('defWrite', false));
  const [smart, setSmart] = useState(() => load('defModel', false));
  const [modelState, setModelState] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const card = deck[0];

  const answer = (knew) => {
    save('cards', { ...load('cards', {}), [card.term]: knew });
    setFlipped(false); setText(''); setResult(null);
    setDeck(knew ? deck.slice(1) : [...deck.slice(1), card]);
  };

  const toggleModel = (on) => {
    setSmart(on); save('defModel', on); setModelState('');
    if (!on) return;
    setModelState('Nyelvi modell betöltése…');
    loadModel((p) => p.status === 'progress' && p.file.endsWith('.onnx') && setModelState(`Nyelvi modell betöltése: ${Math.round(p.progress)}%`))
      .then(() => setModelState(''))
      .catch(() => { setSmart(false); save('defModel', false); setModelState('A nyelvi modell nem töltődött be, ezért csak a kulcsfogalmakat nézem.'); });
  };
  useEffect(() => { if (smart && write) toggleModel(true); }, [write]);

  const check = async () => {
    if (!text.trim()) return;
    const { found, share } = checkDefinition(card, text);
    setResult({ found, share, verdict: definitionVerdict(share, null) });
    setFlipped(true);
    if (!smart) return;
    const sim = await similarity(text, card.definition).catch(() => null);
    if (sim !== null) setResult({ found, share, sim, verdict: definitionVerdict(share, sim) });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!card || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped((f) => !f); }
      else if (flipped && e.key === '1') answer(true);
      else if (flipped && e.key === '2') answer(false);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  return (
    <div className="wrap page narrow">
      <a className="back" href={href(subject.path)}><ArrowLeft size={18} aria-hidden="true" />{subject.title}</a>
      <h1 className="page-title">Flashcardok</h1>
      <div className="chips">
        <button className="chip" aria-pressed={!write} onClick={() => { setWrite(false); save('defWrite', false); }}>Megfordítom</button>
        <button className="chip" aria-pressed={write} onClick={() => { setWrite(true); save('defWrite', true); }}>Leírom a definíciót</button>
        {write && <button className="chip" aria-pressed={smart} onClick={() => toggleModel(!smart)}>Okos ellenőrzés</button>}
      </div>
      {write && <p className="def-note">{modelState || (smart
        ? 'Az okos ellenőrzés egy magyarul is értő nyelvi modellel azt is nézi, mennyire egyezik a jelentés.'
        : 'A kulcsfogalmakat nézem. Az okos ellenőrzés a jelentést is figyeli (első bekapcsoláskor kb. 120 MB letöltés).')}</p>}
      {card ? (
        <>
          <p className="count">{glossary.length - deck.length} / {glossary.length} fogalom megy már</p>
          {write ? (
            <div className="def">
              <b className="def-term">{card.term}</b>
              <textarea value={text} rows={4} maxLength={1000} disabled={!!result} aria-label={`${card.term}: írd le a definíciót`}
                placeholder="Írd le a saját szavaiddal, mit jelent." onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) check(); }} />
              {!result && <button className="btn pri" disabled={!text.trim()} onClick={check}>Ellenőrzés</button>}
              {result && (
                <div className={`fb ${result.verdict === 'jo' ? 'right' : 'wrong'}`}>
                  <b>{result.verdict === 'jo' ? <CircleCheck size={20} aria-hidden="true" /> : <CircleX size={20} aria-hidden="true" />}{VERDICT[result.verdict]}</b>
                  <ul className="def-concepts">
                    {card.concepts.map((c, k) => (
                      <li key={k} className={result.found[k] ? 'hit' : 'miss'}>
                        {result.found[k] ? <Check size={15} aria-label="benne van" /> : <X size={15} aria-label="hiányzik" />}{c[0]}
                      </li>
                    ))}
                  </ul>
                  <p>{result.found.filter(Boolean).length} / {result.found.length} kulcsfogalom
                    {result.sim !== undefined && `, jelentésbeli egyezés: ${Math.round(result.sim * 100)}%`}
                    {smart && result.sim === undefined && ', a jelentést még nézem…'}</p>
                  <p className="fb-answer"><span>A jegyzet definíciója:</span> {card.definition}</p>
                  <small>Döntsd el te: tudtad?</small>
                </div>
              )}
            </div>
          ) : <button className={`flash ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}
            aria-label={flipped ? `${card.term}: ${card.definition}` : `${card.term}. Megfordítás`}>
            <span className="face front"><b>{card.term}</b><small><RotateCw size={15} aria-hidden="true" />Koppints vagy nyomd meg a szóközt</small></span>
            <span className="face rear"><span>{card.definition}</span><small>Jegyzet {card.section}</small></span>
          </button>}
          <div className="opts two">
            <button className="opt right-ghost" disabled={!flipped} onClick={() => answer(true)}><kbd>1</kbd><Check size={18} aria-hidden="true" />Tudtam</button>
            <button className="opt wrong-ghost" disabled={!flipped} onClick={() => answer(false)}><kbd>2</kbd><X size={18} aria-hidden="true" />Nem tudtam</button>
          </div>
        </>
      ) : (
        <div className="empty"><h2>Minden fogalom megy.</h2>
          <button className="btn pri" onClick={() => { save('cards', {}); setDeck(shuffle(glossary)); }}>Újrakezdés</button></div>
      )}
    </div>
  );
}
