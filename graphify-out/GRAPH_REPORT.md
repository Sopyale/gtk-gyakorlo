# Graph Report - gtk-gyakorlo  (2026-10-19)

## Corpus Check
- 34 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 206 nodes · 663 edges · 9 communities (7 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- SVG economics figures
- App shell and animations
- Accounts and Supabase
- Study plan and self-checks
- Questions and scoring
- Layout, nav and legal
- Data validation script

## God Nodes (most connected - your core abstractions)
1. `href()` - 26 edges
2. `Axes()` - 21 edges
3. `load()` - 21 edges
4. `L()` - 19 edges
5. `Figure()` - 19 edges
6. `sx()` - 17 edges
7. `sy()` - 17 edges
8. `App()` - 16 edges
9. `T()` - 13 edges
10. `scopeQuestions()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `Layout()`  [EXTRACTED]
  src/App.jsx → src/components/Layout.jsx
- `App()` --calls--> `Account()`  [EXTRACTED]
  src/App.jsx → src/pages/Account.jsx
- `App()` --calls--> `Mock()`  [EXTRACTED]
  src/App.jsx → src/pages/Mock.jsx
- `App()` --calls--> `Plan()`  [EXTRACTED]
  src/App.jsx → src/pages/Plan.jsx
- `App()` --calls--> `Practice()`  [EXTRACTED]
  src/App.jsx → src/pages/Practice.jsx

## Import Cycles
- None detected.

## Communities (9 total, 2 thin omitted)

### Community 0 - "SVG economics figures"
Cohesion: 0.15
Nodes (43): BudgetIncomeShift(), BudgetPriceRotate(), BudgetReadPrice(), C(), ConsumerOptimum(), DdSsBoth(), DemandShift(), Dot() (+35 more)

### Community 1 - "App shell and animations"
Cohesion: 0.13
Nodes (23): App(), Count(), HeroPlot(), Ring(), bySubject(), chapterFiles, getGlossary(), getQuestions() (+15 more)

### Community 2 - "Accounts and Supabase"
Cohesion: 0.14
Nodes (27): authStorage, completeProfile(), deleteAccount(), ELTE, EMAIL, friendly(), getClient(), listProfiles() (+19 more)

### Community 3 - "Study plan and self-checks"
Cohesion: 0.16
Nodes (17): local, remote, scopeQuestions(), addDays(), daysBetween(), planDays(), ch, today() (+9 more)

### Community 4 - "Questions and scoring"
Cohesion: 0.22
Nodes (17): KEY_TF, QuestionCard(), apportion(), correctText(), drawMock(), groupBy(), isCorrect(), isTrueFalse() (+9 more)

### Community 5 - "Layout, nav and legal"
Cohesion: 0.29
Nodes (14): AccountButton(), AdminLink(), Layout(), SubjectLinks(), systemDark(), ThemeToggle(), LEGAL, LegalBanner() (+6 more)

### Community 6 - "Data validation script"
Cohesion: 0.18
Nodes (7): errors, figures, root, strict, subjects, TYPES, warnings

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `href()` connect `Layout, nav and legal` to `App shell and animations`, `Accounts and Supabase`, `Study plan and self-checks`, `Questions and scoring`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `App shell and animations` be split into smaller, more focused modules?**
  _Cohesion score 0.13277310924369748 - nodes in this community are weakly interconnected._
- **Why does `load()` connect `Study plan and self-checks` to `App shell and animations`, `Accounts and Supabase`, `Questions and scoring`, `Layout, nav and legal`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `Accounts and Supabase` be split into smaller, more focused modules?**
  _Cohesion score 0.14260249554367202 - nodes in this community are weakly interconnected._