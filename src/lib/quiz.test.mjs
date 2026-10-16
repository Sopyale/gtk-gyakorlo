// Self-check for the quiz helpers: node src/lib/quiz.test.mjs
import assert from 'node:assert/strict';
globalThis.localStorage = undefined; // exercise the memory fallback
const { normalize, isCorrect, apportion, record, correctText } = await import('./quiz.js');
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
console.log('quiz helpers ok');
