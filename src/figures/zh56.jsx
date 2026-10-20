import { Axes, Figure, path, sx, sy } from './kit.jsx';

// Figures for the ZH-style questions (book summary figures), redrawn from scratch. Plot units: x, y in 0..200.
const L = ({ a, b, className = 'fig-curve' }) => <path className={className} d={`M${sx(a[0])} ${sy(a[1])}L${sx(b[0])} ${sy(b[1])}`} />;
const T = ({ at, children, anchor = 'start', dx = 4, dy = -4 }) => <text x={sx(at[0]) + dx} y={sy(at[1]) + dy} textAnchor={anchor}>{children}</text>;
const Dot = ({ at, label, dx, dy }) => <><circle className="fig-dot" cx={sx(at[0])} cy={sy(at[1])} r="3.4" />{label && <T at={at} dx={dx} dy={dy}>{label}</T>}</>;
// Dashed guides from a point to both axes, with optional axis labels.
const Guide = ({ at, x, y }) => (
  <>
    <path className="fig-dash" d={`M${sx(0)} ${sy(at[1])}H${sx(at[0])}V${sy(0)}`} />
    {y && <text x={sx(0) - 4} y={sy(at[1]) + 4} textAnchor="end">{y}</text>}
    {x && <text x={sx(at[0])} y={sy(0) + 14} textAnchor="middle">{x}</text>}
  </>
);
// Isoquant x·y = k, drawn inside the plot.
const Iso = ({ k, className = 'fig-curve' }) => <path className={className} d={path((x) => k / x, k / 196, 196)} />;

export default {
  'zh56-isoquant-map': () => (
    <Figure label="Három egyenlőtermék-görbe a TA–TB síkon; az 1-es az origóhoz legközelebb, a 3-as a legtávolabb">
      <Axes x="TA" y="TB" />
      {[1800, 4200, 8000].map((k, i) => <g key={k}><Iso k={k} /><T at={[190, k / 190]} anchor="end" dy={-6}>{i + 1}</T></g>)}
    </Figure>
  ),
  'zh56-isocost-lines': () => (
    <Figure label="Három párhuzamos, lejtő egyenes a TA–TB síkon; az 1-es az origóhoz legközelebb, a 3-as a legtávolabb">
      <Axes x="TA" y="TB" />
      {[60, 120, 180].map((a, i) => <g key={a}><L a={[0, (a * 2) / 3]} b={[a, 0]} /><T at={[a / 2, a / 3]} dx={6} dy={-2}>{i + 1}</T></g>)}
    </Figure>
  ),
  'zh56-isocost-read': () => (
    <Figure label="Egy egyenlőköltség-egyenes: a TB tengelyt 30-nál, a TA tengelyt 60-nál metszi">
      <Axes x="TA" y="TB" />
      <L a={[0, 150]} b={[180, 0]} className="fig-bold" />
      <text x={sx(0) - 4} y={sy(150) + 4} textAnchor="end">30</text>
      <text x={sx(180)} y={sy(0) + 14} textAnchor="middle">60</text>
    </Figure>
  ),
  // Tangency: old line slope −1 at (70, 70); new, steeper line slope −2.25 at (46.7, 105), both on x·y = 4900.
  'zh56-factor-price-rise': () => (
    <Figure label="Egy egyenlőtermék-görbe két érintő egyenlőköltség-egyenessel: a 0-s pontban az eredeti, az 1-es pontban egy meredekebb egyenes érinti; TA1 kisebb TA0-nál, TB1 nagyobb TB0-nál">
      <Axes x="TA" y="TB" />
      <Iso k={4900} className="fig-bold" />
      <L a={[0, 140]} b={[140, 0]} className="fig-dash" />
      <L a={[4.4, 200]} b={[93.3, 0]} />
      <Guide at={[70, 70]} x="TA0" y="TB0" /><Guide at={[46.7, 105]} x="TA1" y="TB1" />
      <Dot at={[70, 70]} label="0" dx={6} dy={-4} /><Dot at={[46.7, 105]} label="1" dx={6} dy={-4} />
    </Figure>
  ),
  'zh56-factor-demand': () => (
    <Figure label="Csökkenő görbe; függőleges tengely: az A tényező ára (PA), vízszintes tengely: az A tényező felhasznált mennyisége (TA)">
      <Axes x="TA" y="PA" />
      <path className="fig-bold" d={path((x) => 6000 / (x + 20) - 10, 10, 190)} />
    </Figure>
  ),
  'zh56-mp-curve': () => (
    <Figure label="Az A tényező határterméke (MP) az A felhasznált mennyiségének (TA) növelésével egyre kisebb, a többi tényező változatlan">
      <Axes x="TA" y="MP" />
      <path className="fig-bold" d={path((x) => 180 - 150 * (x / 190) ** 0.7, 5, 190)} />
      <T at={[190, 30]} anchor="end" dy={-8}>MP</T>
    </Figure>
  ),
  // S: P = Q; D0: P + Q = 160 → (80, 80); D1: P + Q = 240 → (120, 120).
  'zh56-demand-rise': () => (
    <Figure label="A keresleti görbe D0-ból D1-be jobbra tolódott, a kínálati görbe (S) helyben maradt; az ár P0-ról P1-re, a mennyiség Q0-ról Q1-re nőtt">
      <Axes x="Q" y="P" />
      <L a={[20, 20]} b={[185, 185]} /><L a={[20, 140]} b={[140, 20]} /><L a={[60, 180]} b={[180, 60]} className="fig-bold" />
      <T at={[185, 185]} anchor="end" dx={-6}>S</T><T at={[140, 20]} dy={-6}>D0</T><T at={[180, 60]} dy={-6}>D1</T>
      <Guide at={[80, 80]} x="Q0" y="P0" /><Guide at={[120, 120]} x="Q1" y="P1" />
      <Dot at={[80, 80]} /><Dot at={[120, 120]} />
    </Figure>
  ),
  // D: P + Q = 200; S0: P = Q + 40 → (80, 120); S1: P = Q − 40 → (120, 80).
  'zh56-supply-rise': () => (
    <Figure label="A kínálati görbe S0-ból S1-be jobbra tolódott, a keresleti görbe (D) helyben maradt; az ár P0-ról P1-re csökkent, a mennyiség Q0-ról Q1-re nőtt">
      <Axes x="Q" y="P" />
      <L a={[20, 180]} b={[180, 20]} /><L a={[10, 50]} b={[150, 190]} /><L a={[50, 10]} b={[190, 150]} className="fig-bold" />
      <T at={[180, 20]} anchor="end" dy={-6}>D</T><T at={[150, 190]} anchor="end" dx={-6}>S0</T><T at={[190, 150]} anchor="end" dx={-6}>S1</T>
      <Guide at={[80, 120]} x="Q0" y="P0" /><Guide at={[120, 80]} x="Q1" y="P1" />
      <Dot at={[80, 120]} /><Dot at={[120, 80]} />
    </Figure>
  ),
  // SA: P = 2q, SB: P = q, S = SA + SB horizontally: Q = 1.5P. At P = 60: 30 + 60 = 90.
  'zh56-market-supply-sum': () => (
    <Figure label="Két egyéni kínálati görbe (SA, SB) és a piaci kínálati görbe (S); 60-as árnál SA 30, SB 60 egységet kínál, S-nél a mennyiség kérdőjellel jelölve">
      <Axes x="Q" y="P" />
      <L a={[0, 0]} b={[95, 190]} /><L a={[0, 0]} b={[190, 190]} /><L a={[0, 0]} b={[200, 133.3]} className="fig-bold" />
      <T at={[95, 190]} anchor="end" dx={-6}>SA</T><T at={[190, 190]} anchor="end" dx={-6}>SB</T><T at={[200, 133.3]} anchor="end" dy={-8}>S</T>
      <path className="fig-dash" d={`M${sx(0)} ${sy(60)}H${sx(90)}`} />
      <text x={sx(0) - 4} y={sy(60) + 4} textAnchor="end">60</text>
      {[[30, '30'], [60, '60'], [90, '?']].map(([q, t]) => (
        <g key={q}><path className="fig-dash" d={`M${sx(q)} ${sy(60)}V${sy(0)}`} /><Dot at={[q, 60]} /><text x={sx(q)} y={sy(0) + 14} textAnchor="middle">{t}</text></g>
      ))}
    </Figure>
  ),
};
