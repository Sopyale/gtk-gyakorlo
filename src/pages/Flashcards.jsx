import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, RotateCw, X } from 'lucide-react';
import { scopeGlossary } from '../lib/data.js';
import { shuffle } from '../lib/quiz.js';
import { href } from '../lib/route.js';
import { load, save } from '../lib/storage.js';

// Unknown cards go back to the end of the deck until the student knows them.
export default function Flashcards({ subject }) {
  const glossary = useMemo(() => scopeGlossary(subject), [subject.path]);
  const [deck, setDeck] = useState(() => {
    const known = load('cards', {});
    return shuffle(glossary.filter((g) => !known[g.term])).concat(shuffle(glossary.filter((g) => known[g.term])));
  });
  const [flipped, setFlipped] = useState(false);
  const card = deck[0];

  const answer = (knew) => {
    save('cards', { ...load('cards', {}), [card.term]: knew });
    setFlipped(false);
    setDeck(knew ? deck.slice(1) : [...deck.slice(1), card]);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (!card) return;
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
      {card ? (
        <>
          <p className="count">{glossary.length - deck.length} / {glossary.length} fogalom megy már</p>
          <button className={`flash ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}
            aria-label={flipped ? `${card.term}: ${card.definition}` : `${card.term}. Megfordítás`}>
            <span className="face front"><b>{card.term}</b><small><RotateCw size={15} aria-hidden="true" />Koppints vagy nyomd meg a szóközt</small></span>
            <span className="face rear"><span>{card.definition}</span><small>Jegyzet {card.section}</small></span>
          </button>
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
