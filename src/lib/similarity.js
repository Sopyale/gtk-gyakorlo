// Optional meaning check for typed definitions: a small multilingual sentence model (Hungarian included) that runs
// in the student's browser. The library and the model (~120 MB, cached by the browser after the first time) load
// only when the student turns the check on, so the site itself stays light.
const LIB = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/dist/transformers.min.js';
const MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

let model;
export function loadModel(onProgress) {
  model ??= import(/* @vite-ignore */ LIB)
    .then(({ pipeline }) => pipeline('feature-extraction', MODEL, { dtype: 'q8', progress_callback: onProgress }))
    .catch((e) => { model = undefined; throw e; });
  return model;
}

// Cosine similarity (0–1) of the two texts' meaning.
export async function similarity(a, b) {
  const embed = await loadModel();
  const [x, y] = (await embed([a, b], { pooling: 'mean', normalize: true })).tolist();
  return Math.max(0, x.reduce((s, v, i) => s + v * y[i], 0));
}
