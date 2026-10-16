import subjects from '../data/subjects.json';

// Every subject folder is picked up automatically: adding a subject means adding data files only.
const chapterFiles = import.meta.glob('../data/*/ch*.json', { eager: true, import: 'default' });
const glossaryFiles = import.meta.glob('../data/*/glossary.json', { eager: true, import: 'default' });

const bySubject = (files, id) =>
  Object.entries(files).filter(([path]) => path.split('/')[2] === id).flatMap(([, rows]) => rows);

export { subjects };
export const getSubject = (id) => subjects.find((s) => s.id === id);
export const getQuestions = (id) => bySubject(chapterFiles, id);
export const getGlossary = (id) => bySubject(glossaryFiles, id);

// An exam (ZH) narrows a subject to its chapters; pages take this scope in place of the subject.
export const getScope = (subject, examId) => {
  const exam = subject.exams?.find((e) => e.id === examId && e.active);
  if (!exam) return null;
  const chapters = subject.chapters.filter((c) => exam.chapters.includes(c.n));
  return { ...subject, exam, chapters, path: `${subject.id}/${exam.id}`, title: `${subject.name}, ${exam.name}` };
};
const inScope = (scope, chapter) => scope.chapters.some((c) => c.n === chapter);
export const scopeQuestions = (scope) => getQuestions(scope.id).filter((q) => inScope(scope, q.chapter));
export const scopeGlossary = (scope) => getGlossary(scope.id).filter((g) => inScope(scope, +g.section.split('.')[0]));
