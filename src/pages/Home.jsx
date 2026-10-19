import { ArrowUpRight, ExternalLink, FolderOpen, Play } from 'lucide-react';
import HeroPlot from '../components/HeroPlot.jsx';
import Count from '../components/Count.jsx';
import Countdown from '../components/Countdown.jsx';
import Ring from '../components/Ring.jsx';
import { getGlossary, getQuestions, subjects } from '../lib/data.js';
import { href } from '../lib/route.js';
import { load } from '../lib/storage.js';
import { accountsEnabled, recordDriveClick, useAccount } from '../lib/account.js';

export const DRIVE = 'https://drive.google.com/drive/folders/15-MBuk89WvQ-HQwPefg7sUawg0LdZi-0?usp=drive_link';

// With accounts on, the Drive link asks for sign-in first so access requests can be matched to a Neptun code.
function DriveLink({ className, children }) {
  const { profile } = useAccount();
  if (accountsEnabled && !profile?.neptun) return <a className={className} href={href('fiok') + '?drive=1'}>{children}</a>;
  return <a className={className} href={DRIVE} target="_blank" rel="noreferrer" onClick={recordDriveClick}>{children}</a>;
}

export default function Home() {
  const main = subjects.find((s) => s.active);
  const qs = getQuestions(main.id);
  const answers = load('answers', {});
  const done = qs.filter((q) => answers[q.id]).length;
  const wrong = Object.keys(load('wrong', {})).length;

  return (
    <>
      <section className="hero">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="grain" aria-hidden="true" />
        <div className="wrap hero-grid">
          <div>
            <h1>Gyakorolj a ZH&#8209;ra, ne a PDF&#8209;et görgesd.</h1>
            <p className="lede">Kérdésbank az ELTE GTK első féléves tárgyaihoz, a jegyzetek és a tankönyv alapján. Azonnali visszajelzés, magyarázat és forrás minden válaszhoz.</p>
            <div className="cta">
              <a className="btn pri" href={href(main.id)}><Play size={18} aria-hidden="true" />{main.name} gyakorlása</a>
              <DriveLink className="btn sec"><FolderOpen size={18} aria-hidden="true" />Tananyagok (Google Drive)</DriveLink>
            </div>
            <p className="note">A Drive-mappához kérésre adunk hozzáférést.</p>
            {main.exams.filter((e) => e.active).map((e) => <Countdown key={e.id} subject={main} exam={e} />)}
          </div>
          <HeroPlot />
        </div>
      </section>

      <div className="wrap bento">
        <a className="card main-card glow" href={href(main.id)}>
          <Ring value={qs.length ? done / qs.length : 0} label={`Haladás: ${done} / ${qs.length} kérdés helyesen megválaszolva`} />
          <h2>{main.name}</h2>
          <p>{main.sources}</p>
          <div className="chips">{main.chapters.map((c) => <span key={c.n}>{c.short}</span>)}</div>
        </a>
        <div className="card stat"><b><Count to={qs.length} /></b><span>kérdés</span></div>
        <div className="card stat acc"><b><Count to={qs.filter((q) => q.official).length} /></b><span>valódi gyakorló ZH-kérdés</span></div>
        <div className="card stat"><b><Count to={20} /></b><span>perces ZH-szimuláció</span></div>
        <div className="card stat"><b><Count to={getGlossary(main.id).length} /></b><span>flashcard a fogalomtárból</span></div>
        <DriveLink className="card wide drive glow">
          <div><h3>Tananyagok a Drive-on</h3><p>Jegyzetek, diák, tankönyv. Hozzáférés kérésre.</p></div>
          <span className="btn sec"><ExternalLink size={18} aria-hidden="true" />Megnyitás</span>
        </DriveLink>
        <a className="card wide stat glow" href={href(main.id, main.exams[0].id, 'rontott')}><ArrowUpRight className="go" size={22} aria-hidden="true" /><b><Count to={wrong} /></b><span>rontott kérdés vár ismétlésre</span></a>
        <div className="soon-row">
          {subjects.filter((s) => !s.active).map((s) => (
            <div key={s.id} className="soon-card" aria-disabled="true"><span>{s.name}</span><small>Hamarosan</small></div>
          ))}
        </div>
      </div>
    </>
  );
}
