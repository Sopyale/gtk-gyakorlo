# Graph Report - gtk-gyakorlo  (2026-10-21)

## Corpus Check
- 63 files · ~57,957 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 376 nodes · 1015 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65b2b1fe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- charts.jsx
- quiz.js
- account.js
- account.test.mjs
- App.jsx
- href
- check-data.mjs
- package.json
- Tasks
- gtk-gyakorlo – specification
- Coverage plan – Közgazdaságtan (stage 1)
- QuestionCard.jsx
- Change log
- Project rules
- GTK gyakorló
- 1. Server-based AI on our own machine for checking typed definitions

## God Nodes (most connected - your core abstractions)
1. `href()` - 34 edges
2. `sx()` - 30 edges
3. `sy()` - 30 edges
4. `load()` - 28 edges
5. `Axes()` - 24 edges
6. `Figure()` - 22 edges
7. `App()` - 19 edges
8. `L()` - 19 edges
9. `lucide-react` - 17 edges
10. `react` - 17 edges

## Surprising Connections (you probably didn't know these)
- `4. Pages and modes` --references--> `checkDefinition()`  [INFERRED]
  SPEC.md → src/lib/quiz.js
- `App()` --calls--> `Layout()`  [EXTRACTED]
  src/App.jsx → src/components/Layout.jsx
- `App()` --calls--> `Account()`  [EXTRACTED]
  src/App.jsx → src/pages/Account.jsx
- `App()` --calls--> `Admin()`  [EXTRACTED]
  src/App.jsx → src/pages/Admin.jsx
- `App()` --calls--> `Flashcards()`  [EXTRACTED]
  src/App.jsx → src/pages/Flashcards.jsx

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "charts.jsx"
Cohesion: 0.10
Nodes (58): BudgetIncomeShift(), BudgetPriceRotate(), BudgetReadPrice(), C(), ConsumerOptimum(), DdSsBoth(), DemandShift(), Dot() (+50 more)

### Community 1 - "quiz.js"
Cohesion: 0.10
Nodes (48): lucide-react, Countdown(), LegalBanner(), bySubject(), chapterFiles, getGlossary(), getQuestions(), glossaryFiles (+40 more)

### Community 2 - "account.js"
Cohesion: 0.11
Nodes (38): @supabase/supabase-js, authStorage, completeProfile(), deleteAccount(), ELTE, EMAIL, friendly(), getClient() (+30 more)

### Community 3 - "account.test.mjs"
Cohesion: 0.18
Nodes (7): local, remote, bank, mock, q, term, y

### Community 4 - "App.jsx"
Cohesion: 0.19
Nodes (14): App(), Ring(), getScope(), getSubject(), parse(), useRoute(), Changelog(), day() (+6 more)

### Community 5 - "href"
Cohesion: 0.19
Nodes (20): react, Count(), HeroPlot(), AccountButton(), AdminLink(), DrawerAdmin(), Layout(), SubjectLinks() (+12 more)

### Community 6 - "check-data.mjs"
Cohesion: 0.17
Nodes (8): errors, figDir, figures, root, strict, subjects, TYPES, warnings

### Community 7 - "package.json"
Cohesion: 0.07
Nodes (27): dependencies, @fontsource-variable/bricolage-grotesque, @fontsource-variable/figtree, lucide-react, react, react-dom, @supabase/supabase-js, devDependencies (+19 more)

### Community 8 - "Tasks"
Cohesion: 0.12
Nodes (16): 1.0.0, 1.1.0, 1.2.0, 1.2.1, 1.3.0, 1.4.0, 1.5.0, 1.5.1 (+8 more)

### Community 9 - "gtk-gyakorlo – specification"
Cohesion: 0.12
Nodes (16): 10. Commands, 11. Testing, 12. Boundaries, 13. Success criteria, 1. Objective, 2. Scope, 3. Tech stack, 4. Pages and modes (+8 more)

### Community 10 - "Coverage plan – Közgazdaságtan (stage 1)"
Cohesion: 0.33
Nodes (5): Coverage plan – Közgazdaságtan (stage 1), Figures (inline SVG components), Glossary / flashcards, New questions per chapter and type, New questions per section

### Community 11 - "QuestionCard.jsx"
Cohesion: 0.22
Nodes (14): KEY_TF, QuestionCard(), Report(), figures, sendTicket(), state, correctText(), isCorrect() (+6 more)

### Community 13 - "Change log"
Cohesion: 0.14
Nodes (14): 1.0.0 – 2026-10-19, 1.1.0 – 2026-10-19, 1.2.0 – 2026-10-19, 1.2.1 – 2026-10-19, 1.3.0 – 2026-10-19, 1.4.0 – 2026-10-19, 1.5.0 – 2026-10-19, 1.5.1 – 2026-10-19 (+6 more)

### Community 14 - "Project rules"
Cohesion: 0.25
Nodes (8): Content and copyright, Design, Language, Plugins, Privacy and secrets, Project rules, Question bank for every subject and ZH (owner's rule), Workflow for every change

### Community 15 - "GTK gyakorló"
Cohesion: 0.25
Nodes (8): Accounts setup, Adding a subject or a ZH, Deploying and versions, Editing questions, Features, GTK gyakorló, Running locally, Tech

### Community 16 - "1. Server-based AI on our own machine for checking typed definitions"
Cohesion: 0.33
Nodes (5): 1.1 Where the model can run, 1.2 Hardware for 200 students clicking "Ellenőrzés" at the same moment, answer in at most 1 second, 1.3 Store of answers already judged, 1. Server-based AI on our own machine for checking typed definitions, Ideas

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `gtk-gyakorlo – specification` connect `gtk-gyakorlo – specification` to `RULES.md`?**
  _High betweenness centrality (0.313) - this node is a cross-community bridge._
- **Should `charts.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10403863037752414 - nodes in this community are weakly interconnected._
- **Why does `checkDefinition()` connect `quiz.js` to `gtk-gyakorlo – specification`, `QuestionCard.jsx`, `check-data.mjs`?**
  _High betweenness centrality (0.311) - this node is a cross-community bridge._
- **Should `quiz.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09882232462877624 - nodes in this community are weakly interconnected._
- **Why does `4. Pages and modes` connect `gtk-gyakorlo – specification` to `quiz.js`?**
  _High betweenness centrality (0.304) - this node is a cross-community bridge._
- **Should `account.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11014492753623188 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06818181818181818 - nodes in this community are weakly interconnected._