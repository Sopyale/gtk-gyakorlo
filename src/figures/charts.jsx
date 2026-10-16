import { Axes, Figure, path, sx, sy } from './kit.jsx';

// The note's diagrams, redrawn from scratch. Plot units: x, y in 0..200.
const L = ({ a, b, className = 'fig-curve' }) => <path className={className} d={`M${sx(a[0])} ${sy(a[1])}L${sx(b[0])} ${sy(b[1])}`} />;
const T = ({ at, children, anchor = 'start', dx = 4, dy = -4 }) => <text x={sx(at[0]) + dx} y={sy(at[1]) + dy} textAnchor={anchor}>{children}</text>;
const Dot = ({ at, label, dx, dy }) => <><circle className="fig-dot" cx={sx(at[0])} cy={sy(at[1])} r="3.4" />{label && <T at={at} dx={dx} dy={dy}>{label}</T>}</>;
// Indifference curve x·y = k (tangent to a line of slope −y0/x0 at (x0, y0)).
const hyper = (k, from = k / 196, to = 196) => path((x) => k / x, Math.max(from, k / 196), to);
const C = ({ k, className = 'fig-curve', to }) => <path className={className} d={hyper(k, undefined, to)} />;
const Grid = () => (
  <g className="fig-grid">{[20, 40, 60, 80, 100, 120, 140, 160, 180].map((v) => (
    <path key={v} d={`M${sx(v)} ${sy(0)}V${sy(200)}M${sx(0)} ${sy(v)}H${sx(200)}`} />))}
  </g>
);

export const TuMu = () => (
  <Figure label="A teljes hasznosság (TU) egyre lassabban nő, csúcsa ott van, ahol a határhaszon (MU) eléri a nullát">
    <Axes x="Q" y="TU, MU" />
    <path className="fig-bold" d={path((x) => 170 - 170 * (1 - x / 140) ** 2, 0, 190)} />
    <L a={[0, 120]} b={[140, 0]} className="fig-curve" />
    <path className="fig-dash" d={`M${sx(140)} ${sy(0)}V${sy(170)}`} />
    <T at={[184, 156]} anchor="end" dy={-10}>TU</T><T at={[30, 98]}>MU</T>
  </Figure>
);

export const IndifferenceMap = () => (
  <Figure label="Közömbösségi térkép: három közömbösségi görbe, U1 az origóhoz legközelebb, U3 a legtávolabb">
    <Axes />
    {[1800, 4200, 8000].map((k, i) => <g key={k}><C k={k} /><T at={[190, k / 190]} anchor="end" dy={-6}>{`U${i + 1}`}</T></g>)}
  </Figure>
);

export const IcComplements = () => (
  <Figure label="Három L alakú közömbösségi görbe">
    <Axes />
    {[40, 80, 120].map((v) => <path key={v} className="fig-curve" d={`M${sx(v)} ${sy(196)}V${sy(v)}H${sx(196)}`} />)}
  </Figure>
);

export const IcSubstitutes = () => (
  <Figure label="Három párhuzamos, egyenes közömbösségi görbe">
    <Axes />
    {[70, 120, 170].map((v) => <L key={v} a={[0, v]} b={[v, 0]} />)}
  </Figure>
);

export const BudgetReadPrice = () => (
  <Figure label="Költségvetési egyenes rácson: a Qb tengelyt kb. kétszer olyan magasan metszi, mint ahol a Qa tengelyt">
    <Grid /><Axes />
    <L a={[0, 160]} b={[80, 0]} className="fig-bold" />
  </Figure>
);

export const BudgetIncomeShift = () => (
  <Figure label="Az eredeti szaggatott költségvetési egyenes párhuzamosan kifelé tolódott">
    <Axes />
    <L a={[0, 110]} b={[100, 0]} className="fig-dash" />
    <L a={[0, 160]} b={[145, 0]} className="fig-bold" />
  </Figure>
);

export const BudgetPriceRotate = () => (
  <Figure label="A költségvetési egyenes a Qb tengelymetszet körül befelé fordult, a Qa tengelymetszet csökkent">
    <Axes />
    <L a={[0, 140]} b={[170, 0]} className="fig-dash" />
    <L a={[0, 140]} b={[90, 0]} className="fig-bold" />
  </Figure>
);

export const ConsumerOptimum = () => {
  // Budget line from (0, 170) to (190, 0); tangency at its midpoint.
  const A = [95, 85], kLow = 4300;
  const bx = (() => { let x = 1; while (x < 95 && kLow / x > 170 - (170 / 190) * x) x += 0.25; return x; })();
  return (
    <Figure label="Költségvetési egyenes, három közömbösségi görbe; A az érintési pont, B a metszéspont az alsó görbével, C a felső görbén, az egyenes fölött">
      <Axes />
      <C k={kLow} /><C k={A[0] * A[1]} /><C k={12500} />
      <L a={[0, 170]} b={[190, 0]} className="fig-bold" />
      <Dot at={A} label="A" dx={6} dy={-6} />
      <Dot at={[bx, kLow / bx]} label="B" dx={6} dy={2} />
      <Dot at={[125, 100]} label="C" dx={6} dy={-4} />
    </Figure>
  );
};

const Engel = ({ label, d }) => (
  <Figure label={label}><Axes x="Qa" y="I" /><path className="fig-bold" d={d} /></Figure>
);
export const EngelNormal = () => <Engel label="Engel-görbe: a jövedelem növekedésével nő a fogyasztott mennyiség" d={path((x) => 0.006 * x * x + 0.2 * x, 0, 165)} />;
export const EngelInferior = () => (
  <Engel label="Az Engel-görbe egy jövedelemszint fölött visszafordul: a fogyasztott mennyiség csökken"
    d={`M${sx(0)} ${sy(0)}C${sx(110)} ${sy(50)} ${sx(150)} ${sy(110)} ${sx(120)} ${sy(150)}S${sx(70)} ${sy(185)} ${sx(55)} ${sy(195)}`} />
);
export const EngelLuxury = () => (
  <Engel label="Az Engel-görbe csak egy jövedelemszint fölött indul, utána a fogyasztás a jövedelemnél gyorsabban nő"
    d={`M${sx(0)} ${sy(80)}C${sx(30)} ${sy(110)} ${sx(90)} ${sy(130)} ${sx(190)} ${sy(140)}`} />
);

export const Pcc = () => {
  const pts = [[35, 85], [60, 85], [95, 85]];
  return (
    <Figure label="Egy pont körül forduló költségvetési egyenesek, érintési pontok és az ezeket összekötő vastag görbe">
      <Axes />
      {pts.map((p) => <g key={p[0]}><C k={p[0] * p[1]} /><L a={[0, 170]} b={[2 * p[0], 0]} className="fig-dash" /><Dot at={p} /></g>)}
      <path className="fig-bold" d={`M${sx(10)} ${sy(85)}H${sx(120)}`} />
    </Figure>
  );
};

export const SubstIncome = () => {
  const A = [95, 85], C2 = [55, 85], s = 170 / 110, bx = Math.sqrt((95 * 85) / s), B = [bx, bx * s];
  return (
    <Figure label="Az a jószág drágul: A az eredeti optimum, B az új árarány mellett az eredeti közömbösségi görbén, C az új optimum az alacsonyabb görbén">
      <Axes />
      <C k={95 * 85} /><C k={55 * 85} />
      <L a={[0, 170]} b={[190, 0]} className="fig-dash" />
      <L a={[0, 170]} b={[110, 0]} className="fig-bold" />
      <L a={[0, B[1] + s * B[0]]} b={[(B[1] + s * B[0]) / s, 0]} className="fig-dash" />
      <Dot at={A} label="A" dx={6} dy={-6} /><Dot at={B} label="B" dx={6} dy={-4} /><Dot at={C2} label="C" dx={-14} dy={-6} />
    </Figure>
  );
};

export const MarketDemandSum = () => {
  // Four small panels: three individual demands and their horizontal sum.
  const panels = [['DA', 40], ['DB', 30], ['DC', 20], ['D', 90]];
  const pw = 115, h = 150;
  return (
    <svg className="fig fig-wide" viewBox="0 0 520 190" role="img" aria-label="Három egyéni keresleti görbe és a piaci keresleti görbe; azonos árnál a piaci mennyiség az egyéniek összege">
      {panels.map(([name, q], i) => {
        const x0 = 18 + i * (pw + 10), y0 = 20, bottom = y0 + h, P = 70, maxQ = name === 'D' ? 100 : 50;
        const qx = (v) => x0 + 6 + (v / maxQ) * (pw - 12);
        return (
          <g key={name}>
            <path className="fig-axis" d={`M${x0} ${y0}V${bottom}H${x0 + pw}`} />
            <path className="fig-bold" d={`M${x0} ${y0 + 10}L${qx(q)} ${bottom}`} />
            <text x={x0 + pw - 4} y={y0 + 20} textAnchor="end">{name}</text>
            <path className="fig-dash" d={`M${x0} ${y0 + P}H${x0 + pw}`} />
            <text x={x0 + pw / 2} y={bottom + 16} textAnchor="middle">Q</text>
          </g>
        );
      })}
      <text x="8" y="16">P</text>
    </svg>
  );
};

const DS = ({ label, children }) => <Figure label={label}><Axes x="Q" y="P" />{children}</Figure>;
export const DemandShift = () => (
  <DS label="A keresleti görbe D0-ból jobbra, D1-be tolódott">
    <L a={[10, 180]} b={[140, 20]} /><L a={[60, 180]} b={[190, 20]} className="fig-bold" />
    <T at={[140, 20]} dy={-6}>D0</T><T at={[190, 20]} anchor="end" dy={-12}>D1</T>
  </DS>
);
export const SupplyCurve = () => (
  <DS label="Emelkedő kínálati görbe"><L a={[10, 20]} b={[180, 180]} className="fig-bold" /><T at={[180, 180]} anchor="end" dx={-6}>S</T></DS>
);
export const SupplyShift = () => (
  <DS label="A kínálati görbe S0-ból jobbra, S1-be tolódott">
    <L a={[10, 30]} b={[140, 180]} /><L a={[60, 30]} b={[190, 180]} className="fig-bold" />
    <T at={[140, 180]} anchor="end" dx={-6}>S0</T><T at={[190, 180]} anchor="end" dx={-6} dy={12}>S1</T>
  </DS>
);
export const MarketEquilibrium = () => (
  <DS label="Keresleti és kínálati görbe; P0 egyensúlyi ár, P2 fölötte, P1 alatta">
    <L a={[20, 180]} b={[180, 20]} /><L a={[20, 20]} b={[180, 180]} />
    <T at={[180, 20]} anchor="end" dy={-6}>D</T><T at={[180, 180]} anchor="end" dx={-6}>S</T>
    {[[100, 'P0'], [145, 'P2'], [55, 'P1']].map(([y, n]) => (
      <g key={n}><path className="fig-dash" d={`M${sx(0)} ${sy(y)}H${sx(200 - y)}`} /><text x={sx(0) - 6} y={sy(y) + 4} textAnchor="end">{n}</text></g>
    ))}
    <Dot at={[100, 100]} />
  </DS>
);
export const DdSsBoth = () => (
  <DS label="A kereslet D0-ról D1-re és a kínálat S0-ról S1-re is jobbra tolódott; E0 az eredeti, E1 az új egyensúly">
    <L a={[10, 170]} b={[130, 30]} /><L a={[60, 180]} b={[180, 40]} className="fig-bold" />
    <L a={[10, 30]} b={[130, 170]} /><L a={[60, 20]} b={[190, 172]} className="fig-bold" />
    <T at={[130, 30]} dy={-4}>D0</T><T at={[180, 40]} dy={-4}>D1</T><T at={[130, 170]} anchor="end" dx={-6}>S0</T><T at={[190, 172]} anchor="end" dx={-6} dy={14}>S1</T>
    <Dot at={[70, 100]} label="E0" dx={-22} dy={-4} /><Dot at={[121.7, 104.3]} label="E1" dx={6} dy={-6} />
  </DS>
);

export const WinePpf = () => (
  <Figure label="A tokaji gazda 600 liter szamorodnit vagy 300 liter kékfrankost, a villányi 800 liter szamorodnit vagy 1000 liter kékfrankost tud termelni">
    <Axes x="kékfrankos (l)" y="szamorodni (l)" />
    <L a={[0, 120]} b={[60, 0]} className="fig-bold" /><L a={[0, 160]} b={[200, 0]} />
    <T at={[0, 120]}>600</T><T at={[0, 160]}>800</T><T at={[60, 0]} dy={14} anchor="middle">300</T><T at={[200, 0]} dy={14} anchor="end">1000</T>
    <T at={[30, 60]} dx={8}>tokaji</T><T at={[110, 72]} dx={8}>villányi</T>
  </Figure>
);
export const WineTrade = () => (
  <Figure label="A villányi gazda lehetőségei: szakosodás nélkül kb. 444 plusz 444 liter, szakosodás és 1:1 csere után 500 plusz 500 liter">
    <Axes x="kékfrankos (l)" y="szamorodni (l)" />
    <L a={[0, 160]} b={[200, 0]} className="fig-curve" />
    <L a={[0, 200]} b={[200, 0]} className="fig-dash" />
    <Dot at={[88.9, 88.9]} label="≈444" dx={-40} dy={-6} /><Dot at={[100, 100]} label="?" dx={6} dy={-6} />
    <T at={[0, 160]}>800</T><T at={[200, 0]} dy={14} anchor="end">1000</T>
  </Figure>
);

export const IsoquantIsocost = () => (
  <Figure label="Egyenlőtermék-görbék, párhuzamos egyenlőköltség-egyenesek, és a költségminimalizáló érintési pontokat összekötő vastag vonal">
    <Axes x="TA" y="TB" />
    {[[40, 40], [65, 65], [90, 90]].map((p) => (
      <g key={p[0]}><C k={p[0] * p[1]} /><L a={[0, 2 * p[1]]} b={[2 * p[0], 0]} className="fig-dash" /><Dot at={p} /></g>
    ))}
    <path className="fig-bold" d={`M${sx(0)} ${sy(0)}L${sx(105)} ${sy(105)}`} />
  </Figure>
);
