# Graph Report - gtk-gyakorlo  (2026-10-19)

## Corpus Check
- 58 files · ~42,589 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 321 nodes · 890 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0885bd24`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- charts.jsx
- App.jsx
- account.js
- account.test.mjs
- Home.jsx
- href
- check-data.mjs
- package.json
- Tasks
- gtk-gyakorlo – specification
- Coverage plan – Közgazdaságtan (stage 1)

## God Nodes (most connected - your core abstractions)
1. `href()` - 34 edges
2. `load()` - 27 edges
3. `Axes()` - 21 edges
4. `App()` - 19 edges
5. `L()` - 19 edges
6. `Figure()` - 19 edges
7. `lucide-react` - 17 edges
8. `react` - 17 edges
9. `sx()` - 17 edges
10. `sy()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `Layout()`  [EXTRACTED]
  src/App.jsx → src/components/Layout.jsx
- `App()` --calls--> `Account()`  [EXTRACTED]
  src/App.jsx → src/pages/Account.jsx
- `App()` --calls--> `Admin()`  [EXTRACTED]
  src/App.jsx → src/pages/Admin.jsx
- `App()` --calls--> `Home()`  [EXTRACTED]
  src/App.jsx → src/pages/Home.jsx
- `App()` --calls--> `Tickets()`  [EXTRACTED]
  src/App.jsx → src/pages/Tickets.jsx

## Import Cycles
- None detected.

## Communities (12 total, 1 thin omitted)

### Community 0 - "charts.jsx"
Cohesion: 0.15
Nodes (43): BudgetIncomeShift(), BudgetPriceRotate(), BudgetReadPrice(), C(), ConsumerOptimum(), DdSsBoth(), DemandShift(), Dot() (+35 more)

### Community 1 - "App.jsx"
Cohesion: 0.10
Nodes (49): lucide-react, react, App(), Countdown(), LegalBanner(), Ring(), getScope(), getSubject() (+41 more)

### Community 2 - "account.js"
Cohesion: 0.12
Nodes (35): authStorage, completeProfile(), deleteAccount(), ELTE, EMAIL, friendly(), getClient(), listProfiles() (+27 more)

### Community 3 - "account.test.mjs"
Cohesion: 0.25
Nodes (4): local, remote, q, y

### Community 4 - "Home.jsx"
Cohesion: 0.17
Nodes (14): Count(), HeroPlot(), setTicketDone(), bySubject(), chapterFiles, getGlossary(), getQuestions(), glossaryFiles (+6 more)

### Community 5 - "href"
Cohesion: 0.18
Nodes (23): AccountButton(), AdminLink(), DrawerAdmin(), Layout(), SubjectLinks(), systemDark(), ThemeToggle(), TicketLink() (+15 more)

### Community 6 - "check-data.mjs"
Cohesion: 0.18
Nodes (7): errors, figures, root, strict, subjects, TYPES, warnings

### Community 7 - "package.json"
Cohesion: 0.07
Nodes (28): dependencies, @fontsource-variable/bricolage-grotesque, @fontsource-variable/figtree, lucide-react, react, react-dom, @supabase/supabase-js, devDependencies (+20 more)

### Community 8 - "Tasks"
Cohesion: 0.06
Nodes (34): Content and copyright, Design, Language, Plugins, Privacy and secrets, Project rules, Workflow for every change, 1.0.0 (+26 more)

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

- **Why does `react` connect `App.jsx` to `account.js`, `Home.jsx`, `href`, `package.json`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10187553282182438 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `App.jsx` to `account.js`, `Home.jsx`, `href`, `package.json`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `account.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1173054587688734 - nodes in this community are weakly interconnected._
- **Why does `href()` connect `href` to `App.jsx`, `account.js`, `Home.jsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0659536541889483 - nodes in this community are weakly interconnected._
- **Should `Tasks` be split into smaller, more focused modules?**
  _Cohesion score 0.05668016194331984 - nodes in this community are weakly interconnected._