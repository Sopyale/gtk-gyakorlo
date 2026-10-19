// Study plan: spreads chapters over the days left before the ZH, weighted by question count.
// Each day covers an equal slice of the total weight; a chapter shows on every day its slice
// overlaps meaningfully, and always on the day that holds its midpoint.
export function planDays(chapters, days) {
  const total = chapters.reduce((s, c) => s + c.weight, 0);
  const out = Array.from({ length: days }, () => []);
  let start = 0;
  for (const c of chapters) {
    const a = (start / total) * days, b = ((start + c.weight) / total) * days;
    start += c.weight;
    for (let d = Math.floor(a); d < Math.min(days, Math.ceil(b)); d++) {
      const overlap = Math.min(b, d + 1) - Math.max(a, d);
      if (overlap >= 0.25 || d === Math.min(days - 1, Math.floor((a + b) / 2))) out[d].push(c.n);
    }
  }
  return out;
}

// Calendar days from `from` to `to` (both "YYYY-MM-DD"), not counting `to`.
export function daysBetween(from, to) {
  return Math.round((Date.parse(to) - Date.parse(from)) / 864e5);
}

export function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Today's date in the student's own time zone.
export const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
