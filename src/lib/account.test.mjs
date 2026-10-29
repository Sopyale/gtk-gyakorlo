// Self-check for the progress merge on sign-in: node src/lib/account.test.mjs
import assert from 'node:assert/strict';
const { mergeProgress } = await import('./account.js');

const remote = { answers: { a: true, b: false }, wrong: { b: 0 }, 'plan:x': { date: 'r' } };
const local = { answers: { b: true, c: true }, cards: { t: true }, 'plan:x': { date: 'l' }, 'plan:y': { date: 'y' } };
assert.deepEqual(mergeProgress(remote, local), {
  answers: { a: true, b: true, c: true }, wrong: { b: 0 }, cards: { t: true },
  'plan:x': { date: 'l' }, 'plan:y': { date: 'y' },
});
assert.deepEqual(mergeProgress({}, {}), {});
console.log('account merge ok');
