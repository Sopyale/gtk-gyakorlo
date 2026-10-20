# Graph Report - gtk-gyakorlo  (2026-10-20)

## Corpus Check
- 61 files · ~58,895 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 351 nodes · 968 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d489010`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- charts.jsx
- href
- account.js
- account.test.mjs
- App.jsx
- Plan.jsx
- check-data.mjs
- package.json
- Tasks
- gtk-gyakorlo – specification
- Coverage plan – Közgazdaságtan (stage 1)

## God Nodes (most connected - your core abstractions)
1. `href()` - 34 edges
2. `sx()` - 30 edges
3. `sy()` - 30 edges
4. `load()` - 27 edges
5. `Axes()` - 24 edges
6. `Figure()` - 22 edges
7. `App()` - 19 edges
8. `L()` - 19 edges
9. `lucide-react` - 17 edges
10. `react` - 17 edges

## Surprising Connections (you probably didn't know these)
- `QuestionCard()` --calls--> `state`  [EXTRACTED]
  src/components/QuestionCard.jsx → src/lib/account.js
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

## Communities (12 total, 1 thin omitted)

### Community 0 - "charts.jsx"
Cohesion: 0.10
Nodes (59): BudgetIncomeShift(), BudgetPriceRotate(), BudgetReadPrice(), C(), ConsumerOptimum(), DdSsBoth(), DemandShift(), Dot() (+51 more)

### Community 1 - "href"
Cohesion: 0.12
Nodes (47): lucide-react, react, AccountButton(), AdminLink(), DrawerAdmin(), Layout(), SubjectLinks(), systemDark() (+39 more)

### Community 2 - "account.js"
Cohesion: 0.11
Nodes (40): @supabase/supabase-js, authStorage, completeProfile(), deleteAccount(), ELTE, EMAIL, friendly(), getClient() (+32 more)

### Community 3 - "account.test.mjs"
Cohesion: 0.20
Nodes (6): local, remote, bank, mock, q, y

### Community 4 - "App.jsx"
Cohesion: 0.10
Nodes (28): App(), Count(), HeroPlot(), Ring(), bySubject(), chapterFiles, getGlossary(), getQuestions() (+20 more)

### Community 5 - "Plan.jsx"
Cohesion: 0.36
Nodes (8): Countdown(), addDays(), daysBetween(), planDays(), ch, today(), label(), Plan()

### Community 6 - "check-data.mjs"
Cohesion: 0.17
Nodes (8): errors, figDir, figures, root, strict, subjects, TYPES, warnings

### Community 7 - "package.json"
Cohesion: 0.07
Nodes (27): dependencies, @fontsource-variable/bricolage-grotesque, @fontsource-variable/figtree, lucide-react, react, react-dom, @supabase/supabase-js, devDependencies (+19 more)

### Community 8 - "Tasks"
Cohesion: 0.05
Nodes (39): Content and copyright, Design, Language, Plugins, Privacy and secrets, Project rules, Workflow for every change, 1.0.0 (+31 more)

### Community 9 - "gtk-gyakorlo – specification"
Cohesion: 0.12
Nodes (16): 10. Commands, 11. Testing, 12. Boundaries, 13. Success criteria, 1. Objective, 2. Scope, 3. Tech stack, 4. Pages and modes (+8 more)

### Community 10 - "Coverage plan – Közgazdaságtan (stage 1)"
Cohesion: 0.33
Nodes (5): Coverage plan – Közgazdaságtan (stage 1), Figures (inline SVG components), Glossary / flashcards, New questions per chapter and type, New questions per section

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `href` to `account.js`, `App.jsx`, `Plan.jsx`, `package.json`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `charts.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10144927536231885 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `href` to `account.js`, `App.jsx`, `Plan.jsx`, `package.json`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `href` be split into smaller, more focused modules?**
  _Cohesion score 0.12156633547632963 - nodes in this community are weakly interconnected._
- **Why does `href()` connect `href` to `account.js`, `App.jsx`, `Plan.jsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `account.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10549645390070922 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10384615384615385 - nodes in this community are weakly interconnected._