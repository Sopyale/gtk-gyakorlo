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

// Feedback every 3 days from the anchor (registration or first visit).
const { feedbackDue } = await import('./account.js');
const D = 864e5;
assert.equal(feedbackDue(0, 0, 2.9 * D), false);         // first 3 days: nothing
assert.equal(feedbackDue(0, 0, 3 * D), true);            // day 3: due
assert.equal(feedbackDue(0, 3.5 * D, 4 * D), false);     // answered in this period
assert.equal(feedbackDue(0, 3.5 * D, 6.1 * D), true);    // next period
assert.equal(feedbackDue(0, 2 * D, 10 * D), true);       // long away: asked once
console.log('feedback schedule ok');
