import { useMemo, useState } from 'react';
import { ArrowLeft, Flame, PartyPopper } from 'lucide-react';
import Confetti from '../components/Confetti.jsx';
import Focus from '../components/Focus.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import { scopeQuestions } from '../lib/data.js';
import { due, forgive, record, shuffle, zhLevel } from '../lib/quiz.js';
import { href } from '../lib/route.js';
import { load } from '../lib/storage.js';

// Gyakorlás (filtered random queue), Rontott kérdéseim (the wrong list) and Ismétlés (questions due today) share this view.
export default function Practice({ subject, mode, params }) {
  const queue = useMemo(() => {
    const ch = params.get('ch')?.split(',').map(Number);
    const t = params.get('t')?.split(',');
    const zh = params.get('zh') === '1';
    const all = scopeQuestions(subject);
    if (mode === 'ismetles') return shuffle(due(all));
    if (mode === 'rontott') {
      const wrong = load('wrong', {});
      return shuffle(all.filter((q) => q.id in wrong));
    }
    return shuffle(all.filter((q) => (!ch || ch.includes(q.chapter)) && (!t || t.includes(q.type)) && (!zh || zhLevel(q))));
  }, [subject.path, mode, params]);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const title = { rontott: 'Rontott kérdéseim', ismetles: 'Ismétlés' }[mode] ?? 'Gyakorlás';
  const back = <a className="back" href={href(subject.path)}><ArrowLeft size={18} aria-hidden="true" />{subject.title}</a>;

  if (!queue.length) {
    return (
      <div className="wrap page narrow">{back}
        <div className="empty"><h1>{title}</h1>
          <p>{{ rontott: 'Nincs rontott kérdésed. Gyakorolj, és ide gyűlnek azok, amiket elrontasz.',
            ismetles: 'Mára nincs ismételnivalód. Az elrontott kérdések 1, 3 és 7 nap múlva jönnek vissza ide.' }[mode]
            ?? 'Ezekkel a szűrőkkel nincs kérdés. Válassz más fejezetet vagy típust.'}</p>
          <a className="btn pri" href={href(subject.path)}>Vissza</a></div>
      </div>
    );
  }

  if (i >= queue.length) {
    return (
      <div className="wrap page narrow">{back}
        <div className="empty"><PartyPopper size={36} aria-hidden="true" /><h1>Kör vége</h1>
          <p>{queue.length} kérdésből {score} helyes.</p>
          <div className="cta"><button className="btn pri" onClick={() => { setI(0); setScore(0); setStreak(0); }}>Újra</button>
            <a className="btn sec" href={href(subject.path)}>Vissza</a></div></div>
      </div>
    );
  }

  return (
    <div className="wrap page narrow">
      <div className="run-head">{back}
        <span className="focus-tools">
          {streak >= 3 && <span key={streak} className="streak"><Flame size={16} aria-hidden="true" />{streak} helyes sorban</span>}
          <Focus />
        </span>
      </div>
      {streak > 0 && streak % 5 === 0 && <Confetti key={streak} />}
      <div className="progress" role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={i + 1}>
        <i style={{ width: `${((i + 1) / queue.length) * 100}%` }} />
      </div>
      <p className="count">{title}: {i + 1} / {queue.length}</p>
      <QuestionCard key={i} q={queue[i]} feedback
        onAnswer={(ok) => { record(queue[i], ok); setScore((s) => s + ok); setStreak((s) => (ok ? s + 1 : 0)); }}
        onOverride={() => { forgive(queue[i]); setScore((s) => s + 1); setStreak((s) => s + 1); }}
        onNext={() => setI(i + 1)} nextLabel={i + 1 < queue.length ? 'Következő' : 'Eredmény'} />
    </div>
  );
}
