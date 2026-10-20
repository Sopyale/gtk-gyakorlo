import { Axes, Figure, path, sx, sy } from './kit.jsx';

// Figures for the ZH-style questions (book summary figures), redrawn from scratch. Plot units: x, y in 0..200.
const L = ({ a, b, className = 'fig-curve' }) => <path className={className} d={`M${sx(a[0])} ${sy(a[1])}L${sx(b[0])} ${sy(b[1])}`} />;
const T = ({ at, children, anchor = 'start', dx = 4, dy = -4 }) => <text x={sx(at[0]) + dx} y={sy(at[1]) + dy} textAnchor={anchor}>{children}</text>;
const Dot = ({ at, label, dx = 6, dy = -6 }) => <><circle className="fig-dot" cx={sx(at[0])} cy={sy(at[1])} r="3.4" />{label && <T at={at} dx={dx} dy={dy}>{label}</T>}</>;
const ic = (k) => path((x) => k / x, k / 196, 196); // indifference curve x·y = k

export default {
  // Book fig. 2: two points of one indifference curve and the secant between them.
  'zh12-ic-secant': () => (
    <Figure label="Közömbösségi görbe A és B ponttal; A-ból B-be Qb csökken, Qa nő, a két pontot egy egyenes köti össze">
      <Axes />
      <path className="fig-curve" d={ic(8000)} />
      <L a={[50, 160]} b={[100, 80]} className="fig-bold" />
      <path className="fig-dash" d={`M${sx(50)} ${sy(160)}V${sy(80)}H${sx(100)}`} />
      <Dot at={[50, 160]} label="A" /><Dot at={[100, 80]} label="B" />
      <T at={[50, 120]} anchor="end" dx={-4} dy={4}>ΔQb</T>
      <T at={[75, 80]} anchor="middle" dx={0} dy={14}>ΔQa</T>
      <T at={[190, 8000 / 190]} anchor="end" dy={-6}>U</T>
    </Figure>
  ),
  // Book fig. 3: tangent at A, its slope is the MRS.
  'zh12-ic-tangent': () => (
    <Figure label="Közömbösségi görbe, az A pontjában húzott érintővel; az érintő meredeksége −dQb/dQa">
      <Axes />
      <path className="fig-curve" d={ic(8000)} />
      <L a={[24, 170]} b={[150, 12.5]} className="fig-bold" />
      <path className="fig-dash" d={`M${sx(0)} ${sy(100)}H${sx(80)}V${sy(0)}`} />
      <Dot at={[80, 100]} label="A" />
      <T at={[0, 100]} anchor="end" dx={-2} dy={4}>Qb0</T>
      <T at={[80, 0]} anchor="middle" dx={0} dy={14}>Qa0</T>
      <T at={[118, 52]}>−dQb/dQa</T>
      <T at={[190, 8000 / 190]} anchor="end" dy={-6}>U</T>
    </Figure>
  ),
  // Book fig. 7: good a causes negative utility, so the curves rise.
  'zh12-ic-bad': () => (
    <Figure label="Három emelkedő, felfelé ívelő közömbösségi görbe">
      <Axes />
      {[30, 80, 130].map((c) => <path key={c} className="fig-curve" d={path((x) => c + 0.0028 * x * x, 0, Math.min(190, Math.sqrt((195 - c) / 0.0028)))} />)}
    </Figure>
  ),
  // Book fig. 8: budget line and the hatched set of affordable bundles.
  'zh12-budget-set': () => (
    <Figure label="Költségvetési egyenes I/Pb és I/Pa tengelymetszettel, alatta besraffozott terület">
      <Axes />
      <g className="fig-grid">
        {[15, 30, 45, 60, 75, 90, 105, 120, 135].map((x) => <path key={x} d={`M${sx(x)} ${sy(0)}V${sy(160 - (160 / 150) * x)}`} />)}
      </g>
      <L a={[0, 160]} b={[150, 0]} className="fig-bold" />
      <T at={[0, 160]} anchor="end" dx={-2} dy={4}>I/Pb</T>
      <T at={[150, 0]} anchor="middle" dx={0} dy={14}>I/Pa</T>
    </Figure>
  ),
  // Book fig. 11: general change, both intercepts and the slope change.
  'zh12-budget-general': () => (
    <Figure label="Az eredeti szaggatott költségvetési egyenes helyett egy új: mindkét tengelymetszet és a meredekség is megváltozott">
      <Axes />
      <L a={[0, 120]} b={[160, 0]} className="fig-dash" />
      <L a={[0, 170]} b={[90, 0]} className="fig-bold" />
    </Figure>
  ),
  // Book fig. 12: utility-maximising choice at the tangency point A.
  'zh12-optimum': () => (
    <Figure label="Költségvetési egyenes I/Pb és I/Pa tengelymetszettel, egy közömbösségi görbe érinti az A pontban">
      <Axes />
      <path className="fig-curve" d={ic(80 * 85)} />
      <L a={[0, 170]} b={[160, 0]} className="fig-bold" />
      <path className="fig-dash" d={`M${sx(0)} ${sy(85)}H${sx(80)}V${sy(0)}`} />
      <Dot at={[80, 85]} label="A" />
      <T at={[0, 170]} anchor="end" dx={-2} dy={4}>I/Pb</T>
      <T at={[160, 0]} anchor="middle" dx={0} dy={14}>I/Pa</T>
    </Figure>
  ),
};
