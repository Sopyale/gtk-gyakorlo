import { ArrowRight, ArrowUpRight, CalendarClock, ExternalLink, Flame, FolderOpen, Play } from 'lucide-react';
import HeroPlot from '../components/HeroPlot.jsx';
import Count from '../components/Count.jsx';
import Ring from '../components/Ring.jsx';
import SubjectArt from '../components/SubjectArt.jsx';
import { getGlossary, getQuestions, getScope, getSubject, scopeQuestions, subjects } from '../lib/data.js';
import { daysBetween, schedule, today } from '../lib/plan.js';
import { due, streak } from '../lib/quiz.js';
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

const dayLabel = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('hu-HU', { month: 'long', day: 'numeric', weekday: 'long' });
const names = (list) => (list.length > 3 ? `${list.slice(0, 3).join(', ')} és még ${list.length - 3}` : list.join(', '));
const inDays = (n) => (n === 0 ? 'Ma' : n === 1 ? 'Holnap' : `${n} nap múlva`);

// Every active ZH with questions that is still ahead, nearest first; the student's own Ütemterv date wins.
function upcoming(now) {
  return subjects.filter((s) => s.active)
    .flatMap((s) => s.exams.filter((e) => e.active).map((e) => getScope(s, e.id)))
    .map((sc) => ({ sc, qs: scopeQuestions(sc), plan: load(`plan:${sc.path}`, null) }))
    .map((x) => ({ ...x, date: x.plan?.date || x.sc.exam.date }))
    .filter((x) => x.date && x.date >= now && x.qs.length)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// "Ma" panel: today's Ütemterv chapters (plans the student made, plus the next ZH), what Ismétlés has due, the streak.
function Today({ exams, now }) {
  const days = streak(now);
  const plans = exams.filter((x, i) => x.plan || i === 0).map((x) => {
    const weights = x.sc.chapters.map((c) => ({ n: c.n, weight: x.qs.filter((q) => q.chapter === c.n).length }));
    const plan = { done: {}, ...x.plan, date: x.date, start: x.plan?.start || now };
    const s = schedule(weights, plan, now);
    const day = s.upcoming[0]?.date === now ? s.upcoming[0] : null;
    return { ...x, day, done: s.done.some((d) => d.date === now) };
  }).filter((x) => x.day || x.done);
  const dues = exams.map((x) => ({ ...x, n: due(x.qs, now).length })).filter((x) => x.n);
  const short = (x, n) => x.sc.chapters.find((c) => c.n === n)?.short;
  return (
    <section className="wrap today" aria-labelledby="today-h">
      <div className="today-head">
        <h2 id="today-h">Ma</h2>
        <span className={`streak-day ${days ? 'on' : ''}`}><Flame size={18} aria-hidden="true" />
          {days ? `${days} napos sorozat` : 'Válaszolj ma egy kérdésre, és indul a sorozatod.'}</span>
      </div>
      <div className="today-grid">
        {plans.map((x) => (
          <a key={x.sc.path} className="card today-card glow" href={x.day?.chapters ? `${href(x.sc.path, 'gyakorlas')}?ch=${x.day.chapters.join(',')}` : href(x.sc.path, 'utemterv')}>
            <small>{x.sc.title} · Ütemterv</small>
            <b>{x.done ? 'A mai rész kész' : x.day.chapters ? names(x.day.chapters.map((n) => short(x, n))) : 'Ismétlés és ZH-szimuláció'}</b>
            <span>{x.done ? 'Holnap folytatjuk.' : 'Mai fejezetek gyakorlása'}<ArrowRight size={16} aria-hidden="true" /></span>
          </a>
        ))}
        {dues.map((x) => (
          <a key={x.sc.path + 'r'} className="card today-card glow" href={href(x.sc.path, 'ismetles')}>
            <small>{x.sc.title} · Ismétlés</small>
            <b>{x.n} kérdés esedékes</b>
            <span>Ismétlés indítása<ArrowRight size={16} aria-hidden="true" /></span>
          </a>
        ))}
        {!plans.length && !dues.length && exams[0] && (
          <a className="card today-card glow" href={href(exams[0].sc.path, 'utemterv')}>
            <small>{exams[0].sc.title}</small>
            <b>Készíts ütemtervet</b>
            <span>Napokra bontjuk az anyagot a ZH-ig<ArrowRight size={16} aria-hidden="true" /></span>
          </a>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const now = today();
  const exams = upcoming(now);
  const next = exams[0];
  const main = next ? getSubject(next.sc.id) : subjects.find((s) => s.active);
  const qs = next ? next.qs : getQuestions(main.id);
  const answers = load('answers', {});
  const done = qs.filter((q) => answers[q.id]).length;
  const wrong = Object.keys(load('wrong', {})).length;
  const active = subjects.filter((s) => s.active);
  const total = active.reduce((n, s) => n + getQuestions(s.id).length, 0);
  const cards = active.reduce((n, s) => n + getGlossary(s.id).length, 0);
  const left = next && daysBetween(now, next.date);

  return (
    <>
      <section className="hero" data-subject={main.id}>
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="grain" aria-hidden="true" />
        <div className="wrap hero-grid">
          <div>
            <h1>Gyakorolj a ZH&#8209;ra, ne a PDF&#8209;et görgesd.</h1>
            <p className="lede">Kérdésbank az ELTE GTK első féléves tárgyaihoz, a jegyzetek és a tankönyv alapján. Azonnali visszajelzés, magyarázat és forrás minden válaszhoz.</p>
            {next && (
              <a className={`card next-zh glow ${left <= 1 ? 'soon' : ''}`} href={href(next.sc.path)}>
                <small>Következő ZH</small>
                <b>{next.sc.title}</b>
                <span><CalendarClock size={18} aria-hidden="true" />{inDays(left)}, {dayLabel(next.date)} · {next.qs.length} {next.sc.exam.mock?.perChapter ? 'feladat' : 'kérdés'}</span>
                <span className="btn pri"><Play size={18} aria-hidden="true" />Gyakorlás</span>
              </a>
            )}
            <div className="cta">
              <DriveLink className="btn sec"><FolderOpen size={18} aria-hidden="true" />Tananyagok (Google Drive)</DriveLink>
            </div>
            <p className="note">A Drive-mappához kérésre adunk hozzáférést.</p>
          </div>
          {main.id === 'kozgazdasagtan' ? <HeroPlot /> : <SubjectArt id={main.id} className="hero-plot" />}
        </div>
      </section>

      <Today exams={exams} now={now} />

      <div className="wrap bento">
        <a className="card main-card glow" href={href(next ? next.sc.path : main.id)}>
          <Ring value={qs.length ? done / qs.length : 0} label={`Haladás: ${done} / ${qs.length} kérdés helyesen megválaszolva`} />
          <h2>{next ? next.sc.title : main.name}</h2>
          <p>{main.sources}</p>
          <div className="chips">{(next ? next.sc : main).chapters.slice(0, 8).map((c) => <span key={c.n}>{c.short}</span>)}</div>
        </a>
        <div className="card stat"><b><Count to={total} /></b><span>kérdés és feladat</span></div>
        <div className="card stat acc"><b><Count to={active.length} /></b><span>tantárgy</span></div>
        <div className="card stat"><b><Count to={exams.length} /></b><span>ZH-ra gyakorolhatsz most</span></div>
        <div className="card stat"><b><Count to={cards} /></b><span>flashcard a fogalomtárakból</span></div>
        <DriveLink className="card wide drive glow">
          <div><h3>Tananyagok a Drive-on</h3><p>Jegyzetek, diák, tankönyv. Hozzáférés kérésre.</p></div>
          <span className="btn sec"><ExternalLink size={18} aria-hidden="true" />Megnyitás</span>
        </DriveLink>
        <a className="card wide stat glow" href={next ? href(next.sc.path, 'rontott') : href(main.id)}><ArrowUpRight className="go" size={22} aria-hidden="true" /><b><Count to={wrong} /></b><span>rontott kérdés vár ismétlésre</span></a>
        <div className="soon-row">
          {active.filter((s) => s !== main).map((s) => (
            <a key={s.id} className="soon-card live glow" href={href(s.id)}><span>{s.name}</span><small>{getQuestions(s.id).length} gyakorló kérdés</small></a>
          ))}
          {subjects.filter((s) => !s.active).map((s) => (
            <div key={s.id} className="soon-card" aria-disabled="true"><span>{s.name}</span><small>Hamarosan</small></div>
          ))}
        </div>
      </div>
    </>
  );
}
