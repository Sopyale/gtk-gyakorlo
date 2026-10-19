# Graph Report - gtk-gyakorlo  (2026-10-19)

## Corpus Check
- 57 files · ~41,495 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 311 nodes · 847 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f9c2106c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- charts.jsx
- App.jsx
- account.js
- account.test.mjs
- QuestionCard.jsx
- href
- check-data.mjs
- package.json
- Tasks
- gtk-gyakorlo – specification
- Coverage plan – Közgazdaságtan (stage 1)
- Changelog.jsx

## God Nodes (most connected - your core abstractions)
1. `href()` - 32 edges
2. `load()` - 23 edges
3. `Axes()` - 21 edges
4. `L()` - 19 edges
5. `Figure()` - 19 edges
6. `App()` - 18 edges
7. `sx()` - 17 edges
8. `sy()` - 17 edges
9. `useAccount()` - 17 edges
10. `lucide-react` - 16 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `Layout()`  [EXTRACTED]
  src/App.jsx → src/components/Layout.jsx
- `App()` --calls--> `Account()`  [EXTRACTED]
  src/App.jsx → src/pages/Account.jsx
- `App()` --calls--> `Admin()`  [EXTRACTED]
  src/App.jsx → src/pages/Admin.jsx
- `App()` --calls--> `Changelog()`  [EXTRACTED]
  src/App.jsx → src/pages/Changelog.jsx
- `App()` --calls--> `Mock()`  [EXTRACTED]
  src/App.jsx → src/pages/Mock.jsx

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "charts.jsx"
Cohesion: 0.16
Nodes (42): BudgetIncomeShift(), BudgetPriceRotate(), BudgetReadPrice(), C(), ConsumerOptimum(), DdSsBoth(), DemandShift(), Dot() (+34 more)

### Community 1 - "App.jsx"
Cohesion: 0.11
Nodes (41): lucide-react, react, App(), Count(), Countdown(), HeroPlot(), Ring(), bySubject() (+33 more)

### Community 2 - "account.js"
Cohesion: 0.11
Nodes (39): @supabase/supabase-js, authStorage, completeProfile(), deleteAccount(), ELTE, EMAIL, friendly(), getClient() (+31 more)

### Community 3 - "account.test.mjs"
Cohesion: 0.33
Nodes (3): local, remote, q

### Community 4 - "QuestionCard.jsx"
Cohesion: 0.20
Nodes (17): KEY_TF, QuestionCard(), figures, state, apportion(), correctText(), drawMock(), groupBy() (+9 more)

### Community 5 - "href"
Cohesion: 0.23
Nodes (18): AccountButton(), AdminLink(), DrawerAdmin(), Layout(), SubjectLinks(), systemDark(), ThemeToggle(), TicketLink() (+10 more)

### Community 6 - "check-data.mjs"
Cohesion: 0.18
Nodes (7): errors, figures, root, strict, subjects, TYPES, warnings

### Community 7 - "package.json"
Cohesion: 0.07
Nodes (27): dependencies, @fontsource-variable/bricolage-grotesque, @fontsource-variable/figtree, lucide-react, react, react-dom, @supabase/supabase-js, devDependencies (+19 more)

### Community 8 - "Tasks"
Cohesion: 0.06
Nodes (33): Content and copyright, Design, Language, Plugins, Privacy and secrets, Project rules, Workflow for every change, 1.0.0 (+25 more)

### Community 9 - "gtk-gyakorlo – specification"
Cohesion: 0.12
Nodes (16): 10. Commands, 11. Testing, 12. Boundaries, 13. Success criteria, 1. Objective, 2. Scope, 3. Tech stack, 4. Pages and modes (+8 more)

### Community 10 - "Coverage plan – Közgazdaságtan (stage 1)"
Cohesion: 0.33
Nodes (5): Coverage plan – Közgazdaságtan (stage 1), Figures (inline SVG components), Glossary / flashcards, New questions per chapter and type, New questions per section

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `account.js`, `QuestionCard.jsx`, `href`, `package.json`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11073446327683616 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `App.jsx` to `account.js`, `QuestionCard.jsx`, `href`, `package.json`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `account.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1091581868640148 - nodes in this community are weakly interconnected._
- **Why does `href()` connect `href` to `App.jsx`, `account.js`, `QuestionCard.jsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06818181818181818 - nodes in this community are weakly interconnected._
- **Should `Tasks` be split into smaller, more focused modules?**
  _Cohesion score 0.05832147937411095 - nodes in this community are weakly interconnected._