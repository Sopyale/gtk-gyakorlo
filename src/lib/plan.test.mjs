// Self-check for the study plan: node src/lib/plan.test.mjs
import assert from 'node:assert/strict';
import { addDays, daysBetween, planDays } from './plan.js';

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
console.log('plan ok');
