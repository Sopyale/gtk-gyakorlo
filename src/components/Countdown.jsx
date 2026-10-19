import { CalendarClock } from 'lucide-react';
import { daysBetween, today } from '../lib/plan.js';
import { load } from '../lib/storage.js';

// Days left until a ZH; the student's own Ütemterv date wins over the date in subjects.json.
export default function Countdown({ subject, exam }) {
  const date = load(`plan:${subject.id}/${exam.id}`, {}).date || exam.date;
  const left = date ? daysBetween(today(), date) : -1;
  if (left < 0) return null;
  const the = /^[15]/.test(exam.name) ? 'az' : 'a';
  const day = new Date(`${date}T12:00:00`).toLocaleDateString('hu-HU', { month: 'long', day: 'numeric', weekday: 'long' });
  return (
    <p className={`countdown ${left <= 1 ? 'soon' : ''}`}>
      <CalendarClock size={22} aria-hidden="true" />
      {left === 0 ? <><b>Ma</b><span>van {the} {exam.name}. Sok sikert!</span></>
        : left === 1 ? <><b>Holnap</b><span>lesz {the} {exam.name}<small>{day}</small></span></>
        : <><b>{left}</b><span>nap {the} {exam.name}-ig<small>{day}</small></span></>}
    </p>
  );
}
