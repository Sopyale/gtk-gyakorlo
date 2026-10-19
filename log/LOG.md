# Change log

Newest first. Every shipped change gets an entry and a version (see [docs/RULES.md](../docs/RULES.md)).
Each version is tagged `vX.Y.Z` in git and published as a GitHub release.

## 1.0.0 – 2026-10-19

First saved version: everything built so far.

- **Practice:** Közgazdaságtan 1. ZH with 294 questions in five types, 23 own SVG figures and 74 glossary flashcards.
  Modes: Gyakorlás (filter by chapter and type, explanation and source after every answer), Rontott kérdéseim,
  20-minute ZH-szimuláció in the real ZH mix, Flashcardok.
- **Ütemterv:** splits the chapters over the days until the ZH by question count; the last day is review.
- **Accounts (Supabase):** sign-up with Neptun code, password and the student's own non-ELTE e-mail, or Google sign-in.
  One e-mail per Neptun code. Self-service password reset. Progress syncs across devices.
  The Drive link asks for sign-in first, so the owner can match Drive access requests to Neptun codes.
- **Admin tab:** only for admins; lists every account's Neptun code, e-mail, sign-in method, activity,
  Drive clicks and progress.
- **Privacy notice** (#/adatkezeles) explaining why the data is collected and how to delete an account.
- **Design:** "Aurora" look with the live optimum curve in the hero; pointer light, tilt and ripple on every panel and
  button; pages float in on navigation; animations always on.
- **Platform:** installable PWA that works offline and reloads itself after a deploy; light and dark theme;
  footer shows the live version.

Development history before 1.0.0 (commits on `main`):

| Commit | Change |
|---|---|
| adb5b78 | Admin tab in the header for admins only |
| 36f2797 | Accounts on; real non-ELTE e-mail per Neptun code, self-service password reset |
| f760e44 | Accounts: Neptun or Google sign-in, progress sync, admin view |
| 68edb59 | Study plan (Ütemterv) per ZH |
| 489bc94 | Animate regardless of the reduced-motion setting |
| 49bb699 | Deployed version in the footer |
| 2e2d130 | Auto-reload when a new deploy's service worker takes over |
| 638f052 | Animated hero diagram, pages float in on navigation |
| 6e454b0 | Stage 4: interaction layer, animated counters, README |
| 2f24d7c | Stage 3: question bank, glossary and figures |
| 60e69e8 | Közgazdaságtan practice grouped under a 1. ZH card |
| 0026598 | Stage 2: app skeleton, four practice modes, PWA, Pages deploy |
| 0115f93 | Stage 1: spec, coverage plan and task plan |
