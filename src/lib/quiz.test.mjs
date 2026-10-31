// Self-check for the quiz helpers: node src/lib/quiz.test.mjs
import assert from 'node:assert/strict';
globalThis.localStorage = undefined; // exercise the memory fallback
const { normalize, isCorrect, apportion, record, correctText, schedule, due, drawMock, fieldCorrect, MOCK_MIX, zhLevel, forgive, checkDefinition, definitionVerdict, score, markDay, streak } = await import('./quiz.js');
const { load } = await import('./storage.js');

assert.equal(normalize('  Ceteris   Páribus! '), 'ceteris paribus');
assert.ok(isCorrect({ type: 'rovid-valasz', answer: ['ceteris paribus'] }, 'CETERIS paribus'));
assert.ok(!isCorrect({ type: 'rovid-valasz', answer: ['ceteris paribus'] }, 'ceteris'));
assert.ok(isCorrect({ type: 'rovid-valasz', answer: ['hosszú mintaválasz'], keywords: ['jobb minőség'] }, 'Mert jobb minőségre következtetnek'));
assert.ok(!isCorrect({ type: 'rovid-valasz', answer: ['hosszú mintaválasz'], keywords: ['jobb minőség'] }, 'mert drága'));
// Other wording of a term: endings, an article, one typo, extra words.
const term = { type: 'rovid-valasz', answer: ['mikroökonómia'] };
for (const ok of ['mikroökonómiát', 'a mikroökonomia', 'mikroökonómai', 'Mikroökonómia.']) assert.ok(isCorrect(term, ok), ok);
for (const bad of ['makroökonómia', 'mikro', 'közgazdaságtan']) assert.ok(!isCorrect(term, bad), bad);
assert.ok(isCorrect({ type: 'rovid-valasz', answer: ['evolúciós csökevény'] }, 'csökevények, evolúciós'));
assert.ok(!isCorrect({ type: 'rovid-valasz', answer: ['evolúciós csökevény'] }, 'evolúció'));
assert.ok(!isCorrect({ type: 'rovid-valasz', answer: ['határtermék'] }, 'határtermék-bevétel'));
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
record(q, false); forgive(q); assert.ok(!('x' in load('wrong', {})) && !('x' in load('review', {})) && load('answers', {}).x);

// Mock ZH: full mix, ZH-level when there are enough, otherwise falls back to the whole pool.
const bank = Object.keys(MOCK_MIX).flatMap((type) => Array.from({ length: 30 }, (_, k) => ({ id: `${type}${k}`, type, chapter: 1 + (k % 3), difficulty: k < 10 ? 2 : 3 })));
const mock = drawMock(bank);
assert.equal(mock.length, Object.values(MOCK_MIX).reduce((a, b) => a + b));
assert.ok(mock.every(zhLevel));
assert.equal(drawMock(bank.map((q) => ({ ...q, difficulty: 2 }))).length, mock.length);

// Ismétlés: miss -> due in 1 day; right answers on due days -> 3 days, 7 days, then done; early answers change nothing.
const y = { id: 'y' }, r = () => load('review', {}).y;
schedule('y', false, '2026-10-01'); assert.deepEqual(r(), { step: 0, due: '2026-10-02' });
assert.equal(due([y], '2026-10-01').length, 0); assert.equal(due([y], '2026-10-02').length, 1);
schedule('y', true, '2026-10-01'); assert.equal(r().due, '2026-10-02');
schedule('y', true, '2026-10-02'); assert.deepEqual(r(), { step: 1, due: '2026-10-05' });
schedule('y', true, '2026-10-05'); assert.deepEqual(r(), { step: 2, due: '2026-10-12' });
schedule('y', true, '2026-10-12'); assert.equal(r(), undefined);
(await import('./storage.js')).save('streak', { last: '', count: 0 }); // record() above already marked today
markDay('2026-11-01'); markDay('2026-11-01'); markDay('2026-11-02');
assert.equal(streak('2026-11-02'), 2); assert.equal(streak('2026-11-03'), 2, 'yesterday still counts');
assert.equal(streak('2026-11-04'), 0); markDay('2026-11-05'); assert.equal(streak('2026-11-05'), 1, 'a gap restarts it');
console.log('quiz helpers ok');

// Typed definitions
{
  const card = { concepts: [['vágy', 'hiányérzet'], ['jószág', 'termék'], ['cselekvés', 'késztet'], ['fogyasztás', 'kielégít']] };
  const a = checkDefinition(card, 'Hiányérzet egy termék iránt, ami cselekvésre késztet, és fogyasztással elégül ki.');
  assert.deepEqual(a.found, [true, true, true, true]);
  assert.equal(definitionVerdict(a.share, null), 'jo');
  const b = checkDefinition(card, 'Amikor valami nagyon kell.');
  assert.equal(b.share, 0);
  assert.equal(definitionVerdict(b.share, null), 'rossz');
  assert.equal(definitionVerdict(0.5, 0.85), 'jo');
  assert.equal(definitionVerdict(0.25, 0.72), 'reszben');
  const c = checkDefinition({ concepts: [['nem etikus', 'etikátlan']] }, 'önző és etikus');
  assert.equal(c.share, 0);
}
console.log('definition checks ok');

// Calculation tasks (Matematika)
{
  const f = (accept, answer) => ({ label: 'a)', accept, answer });
  for (const ok of ['13/24', '0,5417', '0.542', ' 0,5417 ']) assert.ok(fieldCorrect(f('frac', '13/24'), ok), ok);
  for (const bad of ['0,54', '54,17', '', 'abc']) assert.ok(!fieldCorrect(f('frac', '13/24'), bad), bad);
  assert.ok(fieldCorrect(f('frac', '-21/2'), '−10,5'));
  assert.ok(fieldCorrect(f('dec', '0,5714'), '0,5714'));
  assert.ok(!fieldCorrect(f('dec', '0,5714'), '4/7'));
  assert.ok(!fieldCorrect(f('dec', '0,5714'), '57,14'));
  assert.ok(fieldCorrect(f('int', '500 000'), '500000'));
  assert.ok(fieldCorrect(f('int', '17 576 000'), '17 576 000'));
  assert.ok(!fieldCorrect(f('int', '500 000'), '500000,4'));
  for (const ok of ['1,11', '1,114', '1,1136']) assert.ok(fieldCorrect(f('round', '1,1136'), ok), ok);
  for (const bad of ['1,1', '1,12', '1']) assert.ok(!fieldCorrect(f('round', '1,1136'), bad), bad);
  const q = { type: 'szamolas', fields: [f('dec', '0,23'), { label: 'b)', accept: 'dec', answer: '0,28' }] };
  assert.ok(isCorrect(q, { 'a)': '0,23', 'b)': '0.28' }));
  assert.ok(!isCorrect(q, { 'a)': '0,23', 'b)': '0,27' }), 'no partial credit');
  const mock = drawMock([1, 1, 2, 2, 3].map((chapter, i) => ({ id: i, chapter })), { perChapter: 1 });
  assert.deepEqual(mock.map((x) => x.chapter), [1, 2, 3]);
  const some = drawMock([1, 1, 2, 2, 3].map((chapter, i) => ({ id: i, chapter })), { perChapter: 1, chapters: [1, 3] });
  assert.deepEqual(some.map((x) => x.chapter).sort(), [1, 3]);
  // Typed effects keep their signs: Eszk+ Erd- is not Eszk- Erd-.
  const eff = { accept: 'text', answer: 'Eszk+ Erd-', alts: ['Erd- Eszk+'] };
  assert.ok(fieldCorrect(eff, 'erd- eszk+') && fieldCorrect(eff, 'Eszk+ Erd-'));
  assert.ok(!fieldCorrect(eff, 'Eszk- Erd-') && !fieldCorrect(eff, 'Eszk+ Erd+'));
}
console.log('calculation checks ok');

// New ZH types: többszörös választás, relációanalízis, kifejtős, text fields (Számvitel), mock mix per exam
{
  const multi = { type: 'tobbszoros', points: 5, statements: [true, false, true, false, true].map((answer, k) => ({ text: `s${k}`, answer })) };
  assert.ok(isCorrect(multi, [true, false, true, false, true]));
  assert.ok(!isCorrect(multi, [true, false, true, false, false]));
  assert.equal(score(multi, [true, false, true, false, false]), 4, 'one point per statement');
  assert.equal(score(multi, null), 0);
  const rel = { type: 'relacio', answer: 'C', statements: ['a', 'b'] };
  assert.ok(isCorrect(rel, 'C') && !isCorrect(rel, 'A'));
  assert.match(correctText(rel), /^C\) Az első állítás igaz/);
  const essay = { type: 'kifejtos', points: 9, answer: ['def', 'jell', 'pelda', 'kapcs'] };
  assert.ok(isCorrect(essay, { text: 'x', got: [0, 1, 2, 3] }));
  assert.ok(!isCorrect(essay, { text: 'x', got: [0, 1] }));
  assert.equal(score(essay, { text: 'x', got: [0, 1] }), 4.5);
  assert.equal(score(essay, { text: 'x', got: [0] }), 2, 'rounded down to half points');
  const acc = { label: '1. T', accept: 'text', answer: 'Áruk', alts: ['26', '261'] };
  for (const ok of ['áruk', 'Aruk', ' 26 ', '261']) assert.ok(fieldCorrect(acc, ok), ok);
  for (const bad of ['', 'anyagok', '2']) assert.ok(!fieldCorrect(acc, bad), bad);
  assert.equal(score({ type: 'igaz-hamis', answer: true }, true), 1);
  const bank2 = ['tobbszoros', 'kifejtos', 'igaz-hamis'].flatMap((type) => Array.from({ length: 5 }, (_, k) => ({ id: `${type}${k}`, type, chapter: 1, difficulty: 3 })));
  const m2 = drawMock(bank2, { mix: { tobbszoros: 2, kifejtos: 1 } });
  assert.equal(m2.length, 3);
  assert.ok(m2.every((x) => x.type !== 'igaz-hamis'));
}
console.log('new ZH type checks ok');
