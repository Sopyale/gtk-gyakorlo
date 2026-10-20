// Validates the question bank: format per type, duplicate ids/texts, section coverage. Exits 1 on errors.
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const root = new URL('../src/data/', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const subjects = read('subjects.json');
const TYPES = ['igaz-hamis', 'feleletvalasztos', 'rovid-valasz', 'parositas', 'abra'];
const figDir = new URL('../src/figures/', import.meta.url);
const figures = readdirSync(figDir).map((f) => readFileSync(new URL(f, figDir), 'utf8')).join('\n');
const strict = process.argv.includes('--strict'); // stage 3+: missing sections become errors
const errors = [], warnings = [];
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();

for (const s of subjects.filter((x) => x.active)) {
  const dir = new URL(`${s.id}/`, root);
  const files = readdirSync(dir).filter((f) => /^ch\d+\.json$/.test(f));
  const ids = new Map(), texts = new Map(), bySection = {}, byType = {}, byChapter = {};
  for (const f of files) {
    const chapter = +f.match(/\d+/)[0];
    for (const q of read(`${s.id}/${f}`)) {
      const at = `${f} ${q.id ?? '?'}`;
      const err = (m) => errors.push(`${at}: ${m}`);
      if (!/^kg-\d-\d{3}$/.test(q.id ?? '')) err('id must look like kg-3-017');
      else if (+q.id[3] !== chapter) err('id chapter does not match file');
      if (ids.has(q.id)) err(`duplicate id (also in ${ids.get(q.id)})`); else ids.set(q.id, f);
      if (!TYPES.includes(q.type)) err(`unknown type ${q.type}`);
      if (q.chapter !== chapter) err('chapter field does not match file');
      if (!new RegExp(`^${chapter}\\.\\d+$`).test(q.section ?? '')) err('section must look like 3.4');
      for (const k of ['question', 'explanation', 'source']) if (typeof q[k] !== 'string' || !q[k].trim()) err(`missing ${k}`);
      if (typeof q.official !== 'boolean') err('official must be boolean');
      if (![1, 2, 3].includes(q.difficulty)) err('difficulty must be 1, 2 or 3');
      if (q.type === 'igaz-hamis' && typeof q.answer !== 'boolean') err('igaz-hamis answer must be boolean');
      if (q.type === 'feleletvalasztos' || q.type === 'abra') {
        if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) err('needs 2–4 options');
        else if (q.options[0] !== q.answer) err('first option must be the answer');
        else if (new Set(q.options).size !== q.options.length) err('duplicate options');
      }
      if (q.type === 'abra' && !figures.includes(`${q.figure}:`) && !figures.includes(`'${q.figure}':`)) err(`unknown figure ${q.figure}`);
      if (q.type === 'rovid-valasz' && !(Array.isArray(q.answer) && q.answer.length && q.answer.every((a) => typeof a === 'string' && a.trim()))) err('short answer must be a list of accepted answers, model answer first');
      if (q.keywords !== undefined && !(Array.isArray(q.keywords) && q.keywords.every((k) => typeof k === 'string' && k.trim().length >= 3))) err('keywords must be strings of 3+ characters');
      if (q.type === 'parositas' && !(Array.isArray(q.answer) && q.answer.length >= 2 && q.answer.every((p) => p.length === 2))) err('matching needs [[left, right], ...]');
      const t = norm(q.question ?? '');
      if (texts.has(t)) err(`duplicate question text (also ${texts.get(t)})`); else texts.set(t, q.id);
      bySection[q.section] = (bySection[q.section] ?? 0) + 1;
      byType[q.type] = (byType[q.type] ?? 0) + 1;
      byChapter[chapter] = (byChapter[chapter] ?? 0) + 1;
    }
  }
  // Every section listed in the coverage plan must have at least one question.
  const plan = new URL('../docs/coverage-plan.md', import.meta.url);
  const sections = existsSync(plan) ? [...readFileSync(plan, 'utf8').matchAll(/^\| (\d\.\d+) /gm)].map((m) => m[1]) : [];
  const missing = sections.filter((x) => !bySection[x]);
  if (missing.length) (strict ? errors : warnings).push(`${s.id}: ${missing.length} section(s) without questions: ${missing.join(', ')}`);

  const glossary = read(`${s.id}/glossary.json`);
  glossary.forEach((g, k) => { if (!g.term || !g.definition || !g.section) errors.push(`${s.id} glossary #${k}: needs term, definition, section`); });

  console.log(`${s.name}: ${ids.size} questions, ${glossary.length} glossary terms`);
  console.log('  by chapter:', Object.entries(byChapter).map(([k, v]) => `${k}: ${v}`).join(', '));
  console.log('  by type:', Object.entries(byType).map(([k, v]) => `${k}: ${v}`).join(', '));
}
warnings.forEach((w) => console.warn('warning:', w));
errors.forEach((e) => console.error('error:', e));
console.log(errors.length ? `${errors.length} error(s)` : 'data ok');
process.exit(errors.length ? 1 : 0);
