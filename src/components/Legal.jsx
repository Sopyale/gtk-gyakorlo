import { useState } from 'react';
import { X } from 'lucide-react';
import { load, save } from '../lib/storage.js';

export const LEGAL =
  'Kizárólag saját felhasználásra – nem terjeszthető. Ez a weboldal kizárólag az ELTE Gazdaságtudományi Kar első féléves hallgatói (Pénzügy és számvitel, Nemzetközi gazdálkodás, Gazdálkodási és menedzsment szak) számára, saját tanulási célra készült. Az ELTE belső oktatási anyagaira épül, amelyekhez csak a kurzus hallgatói férnek hozzá, ezért hivatalosan nem osztható meg: tilos nyilvánosan közzétenni, továbbítani, feltölteni vagy a kurzuson kívüli személyeknek átadni. Az eredeti anyagok szerzői joga az oktatókat és az ELTE GTK-t illeti.';

// First visit: one short line; the full text is one tap away and always in the footer.
export function LegalBanner() {
  const [open, setOpen] = useState(() => !load('legalSeen', false));
  const [more, setMore] = useState(false);
  if (!open) return null;
  return (
    <div className={`legal-banner ${more ? 'more' : ''}`} role="region" aria-label="Jogi tudnivaló">
      <p>{more ? LEGAL : <>{LEGAL.split(' – ')[0]} – nem terjeszthető.{' '}
        <button className="text-btn" aria-expanded="false" onClick={() => setMore(true)}>Részletek</button></>}</p>
      <button className="btn pri" onClick={() => { save('legalSeen', true); setOpen(false); }}>
        <X size={18} aria-hidden="true" />Értem
      </button>
    </div>
  );
}
