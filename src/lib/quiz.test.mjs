// Self-check for the quiz helpers: node src/lib/quiz.test.mjs
import assert from 'node:assert/strict';
globalThis.localStorage = undefined; // exercise the memory fallback
const { normalize, isCorrect, apportion, record, correctText, schedule, due } = await import('./quiz.js');
const { load } = await import('./storage.js');

assert.equal(normalize('  Ceteris   Páribus! '), 'ceteris paribus');
assert.ok(isCorrect({ type: 'rovid-valasz', answer: ['ceteris paribus'] }, 'CETERIS paribus'));
assert.ok(!isCorrect({ type: 'rovid-valasz', answer: ['ceteris paribus'] }, 'ceteris'));
assert.ok(isCorrect({ type: 'rovid-valasz', answer: ['hosszú mintaválasz'], keywords: ['jobb minőség'] }, 'Mert jobb minőségre következtetnek'));
assert.ok(!isCorrect({ type: 'rovid-valasz', answer: ['hosszú mintaválasz'], keywords: ['jobb minőség'] }, 'mert drága'));
assert.ok(isCorrect({ type: 'igaz-hamis', answer: false }, false));
assert.ok(!isCorrect({ type: 'igaz-hamis', answer: false }, null));
assert.ok(isCorrect({ type: 'parositas', answer: [['a', '1'], ['b', '2']] }, { a: '1', b: '2' }));
assert.ok(!isCorrect({ type: 'parositas', answer: [['a', '1'], ['b', '2']] }, { a: '2', b: '1' }));
assert.equal(correctText({ type: 'abra', answer: true }), 'Igaz');
assert.deepEqual(apportion({ 1: 10, 2: 10, 3: 5 }, 5), { 1: 2, 2: 2, 3: 1 });
assert.equal(Object.values(apportion({ 1: 3, 2: 3, 3: 3 }, 16)).reduce((a, b) => a + b), 16);

const q = { id: 'x' };
record(q, false); assert.equal(load('wrong', {}).x, 0);
record(q, true); assert.equal(load('wrong', {}).x, 1);
record(q, false); assert.equal(load('wrong', {}).x, 0);
record(q, true); record(q, true); assert.ok(!('x' in load('wrong', {})));

// Ismétlés: miss -> due in 1 day; right answers on due days -> 3 days, 7 days, then done; early answers change nothing.
const y = { id: 'y' }, r = () => load('review', {}).y;
schedule('y', false, '2026-10-01'); assert.deepEqual(r(), { step: 0, due: '2026-10-02' });
assert.equal(due([y], '2026-10-01').length, 0); assert.equal(due([y], '2026-10-02').length, 1);
schedule('y', true, '2026-10-01'); assert.equal(r().due, '2026-10-02');
schedule('y', true, '2026-10-02'); assert.deepEqual(r(), { step: 1, due: '2026-10-05' });
schedule('y', true, '2026-10-05'); assert.deepEqual(r(), { step: 2, due: '2026-10-12' });
schedule('y', true, '2026-10-12'); assert.equal(r(), undefined);
console.log('quiz helpers ok');
