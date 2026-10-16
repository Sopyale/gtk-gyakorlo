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
