# Task plan

Four stages; stop, report in Hungarian and wait for approval after each.

## Stage 1 – Analysis and plan ✅ (awaiting approval)
- [x] Read note (HTML/PDF), textbook, 38 official questions
- [x] Section list with ★ marks; classify the official questions
- [x] Coverage plan (`docs/coverage-plan.md`) and figure list
- [x] Report open key issues (Q4, Q8, Q36, derived keys, source gaps)
- [x] SPEC.md, this plan

## Stage 2 – Design and skeleton
- [ ] 2–3 home-page visual directions as screenshots → owner picks one
- [ ] Vite + React scaffold, base path, hash routing
- [ ] Menu (top bar / phone drawer) with the six subjects; "Hamarosan" state
- [ ] Home page: intro, bento subject cards, Drive button + note
- [ ] Subject page: mode cards, chapter and type filters, progress
- [ ] Question renderer for all five types; one sample question per type
- [ ] Gyakorlás, Rontott kérdéseim, ZH-szimuláció, Flashcardok with the samples
- [ ] Storage wrapper with in-memory fallback; "Haladás törlése"
- [ ] Legal notice footer + first-visit banner; noindex meta + robots.txt
- [ ] Light/dark theme with system default and toggle
- [ ] PWA manifest, icons, service worker
- [ ] GitHub Actions deploy to Pages
- [ ] Playwright screenshots at 360/1280 px, both themes; code review; report + live URL

## Stage 3 – Question bank
- [ ] Import 37 official questions (official, derivedKey where needed)
- [ ] Write ~250 new questions chapter by chapter per the coverage plan
- [ ] Draw all SVG figures
- [ ] glossary.json from the Fogalomtár
- [ ] `check-data` script; passes
- [ ] Near-duplicate check vs the official questions and each other; rewrite and count
- [ ] Re-verify every key against its cited section; contradiction check
- [ ] Report: totals, coverage table, derived keys, rewrites, gaps

## Stage 4 – Polish and release
- [ ] Click through every mode (desktop + phone) with Playwright; fix layout/a11y
- [ ] Lighthouse ≥ 90 (performance, accessibility, best practices)
- [ ] README in Hungarian (add questions, add a subject, deploy)
- [ ] Copy to D:\Claude\School\Weboldal\gtk-gyakorlo
- [ ] Final report: URL and manual checks
