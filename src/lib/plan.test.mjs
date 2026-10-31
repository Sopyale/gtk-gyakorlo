// Self-check for the study plan: node src/lib/plan.test.mjs
import assert from 'node:assert/strict';
import { addDays, daysBetween, planDays, schedule, tick } from './plan.js';

const ch = [64, 71, 51, 34, 36, 38].map((weight, i) => ({ n: i + 1, weight }));
const covered = (plan) => new Set(plan.flat());
for (const days of [1, 2, 3, 5, 6, 9, 14]) {
  const plan = planDays(ch, days);
  assert.equal(plan.length, days);
  assert.equal(covered(plan).size, 6, `every chapter appears with ${days} days`);
  assert.ok(plan.every((d) => d.length), `no empty day with ${days} days`);
  assert.deepEqual(plan.flat(), [...plan.flat()].sort((a, b) => a - b), 'chapters stay in order');
}
assert.deepEqual(planDays(ch, 1), [[1, 2, 3, 4, 5, 6]]);
assert.equal(daysBetween('2026-10-19', '2026-10-21'), 2);
assert.equal(addDays('2026-10-31', 1), '2026-11-01');

// Ütemterv: getting ahead re-spreads the rest; ticked days keep what was done.
const six = ch.map((c) => ({ ...c }));
let st = { date: '2026-11-10', start: '2026-11-01', done: {} };
let sc = schedule(six, st, '2026-11-01');
assert.equal(sc.upcoming.length, 9);
assert.equal(sc.upcoming.at(-1).chapters, null, 'last day is review');
st = tick(st, sc.upcoming[0].chapters, '2026-11-01');
st = tick(st, schedule(six, st, '2026-11-01').upcoming[0].chapters, '2026-11-01'); // ahead: tomorrow's part too
sc = schedule(six, st, '2026-11-01');
assert.equal(sc.done.length, 1);
assert.equal(sc.upcoming[0].date, '2026-11-02', 'today is ticked, the rest starts tomorrow');
assert.equal(sc.upcoming.length, 8);
const rest = new Set(sc.upcoming.flatMap((d) => d.chapters ?? []));
assert.ok(sc.done[0].chapters.every((n) => !rest.has(n)), 'done chapters are not planned again');
for (const n of [1, 2, 3, 4, 5, 6]) assert.ok(rest.has(n) || sc.done[0].chapters.includes(n), `chapter ${n} is somewhere`);
assert.deepEqual(schedule(six, { date: '2026-11-05', start: '2026-11-03', done: { '2026-11-01': true } }, '2026-11-01').upcoming[0].date, '2026-11-03', 'a later start day wins');
assert.ok(schedule(six, { date: '2026-11-05', start: '2026-11-01', done: { '2026-11-02': [1, 2, 3, 4, 5, 6] } }, '2026-11-03').upcoming.every((d) => d.chapters === null), 'all done: only review');
console.log('plan ok');
