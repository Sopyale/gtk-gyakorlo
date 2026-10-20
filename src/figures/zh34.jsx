import { Axes, Figure, path, sx, sy } from './kit.jsx';

// Figures for the ZH-style questions (book summary figures), redrawn from scratch. Plot units: x, y in 0..200.
const L = ({ a, b, className = 'fig-curve' }) => <path className={className} d={`M${sx(a[0])} ${sy(a[1])}L${sx(b[0])} ${sy(b[1])}`} />;
const T = ({ at, children, anchor = 'start', dx = 4, dy = -4 }) => <text x={sx(at[0]) + dx} y={sy(at[1]) + dy} textAnchor={anchor}>{children}</text>;
const Dot = ({ at, label, dx, dy }) => <><circle className="fig-dot" cx={sx(at[0])} cy={sy(at[1])} r="3.4" />{label && <T at={at} dx={dx} dy={dy}>{label}</T>}</>;

// ICC where good a turns inferior: parallel budget lines (slope −0.9), short indifference-curve arcs at the tangencies.
const S = 0.9;
const ICC_PTS = [[30, 22], [56, 44], [74, 74], [76, 104], [66, 132]];
const ic = ([x0, y0]) => (x) => y0 * (x0 / x) ** ((S * x0) / y0);

// Giffen decomposition: A on the old line, B on A's curve at the new price ratio, C on the new line right of A.
const NEW = 170 / 110, A = [95, 85], B = [Math.sqrt(8075 / NEW), Math.sqrt(8075 / NEW) * NEW], C = [100, 170 - NEW * 100];
const lowIc = (x) => C[1] - NEW * 60 + (NEW * 3600) / (x - 40); // shifted hyperbola tangent to the new line at C

export default {
  'zh34-engel-three': () => (
    <Figure label="Három Engel-görbe a jövedelem és a fogyasztott mennyiség síkján: az 1-es végig emelkedik, a 2-es csak egy jövedelemszint fölött indul és laposan fut, a 3-as egy jövedelemszint fölött visszafordul">
      <Axes x="Qa" y="I" />
      <path className="fig-bold" d={path((x) => 0.006 * x * x + 0.2 * x, 0, 165)} />
      <path className="fig-bold" d={`M${sx(0)} ${sy(70)}C${sx(30)} ${sy(95)} ${sx(90)} ${sy(110)} ${sx(190)} ${sy(120)}`} />
      <path className="fig-bold" d={`M${sx(0)} ${sy(0)}C${sx(70)} ${sy(40)} ${sx(100)} ${sy(90)} ${sx(85)} ${sy(130)}S${sx(50)} ${sy(170)} ${sx(40)} ${sy(190)}`} />
      <T at={[165, 196]} anchor="end" dx={-6} dy={4}>1</T>
      <T at={[190, 120]} anchor="end" dy={-8}>2</T>
      <T at={[40, 190]} dx={8} dy={4}>3</T>
    </Figure>
  ),
  'zh34-icc-inferior': () => (
    <Figure label="Párhuzamos szaggatott költségvetési egyenesek és az érintési pontokat összekötő vastag görbe, amely előbb jobbra fölfelé halad, majd egy ponttól balra fölfelé fordul">
      <Axes />
      {ICC_PTS.map((p, i) => (
        <g key={i}>
          <path className="fig-curve" d={path(ic(p), p[0] - 16, p[0] + 24, 16)} />
          <path className="fig-dash" d={path((x) => p[1] - S * (x - p[0]), 0, Math.min(200, p[0] + p[1] / S), 2)} />
          <circle className="fig-dot" cx={sx(p[0])} cy={sy(p[1])} r="3.2" />
        </g>
      ))}
      <path className="fig-bold" d={'M' + [[0, 0], ...ICC_PTS].map(([x, y]) => `${sx(x)} ${sy(y)}`).join('L')} />
    </Figure>
  ),
  'zh34-giffen': () => (
    <Figure label="Az a jószág drágul: A az eredeti optimum, B az új árarány mellett az eredeti közömbösségi görbén, balra A-tól; C az új optimum az alacsonyabb görbén, A-tól jobbra">
      <Axes />
      <path className="fig-curve" d={path((x) => 8075 / x, 8075 / 196, 196)} />
      <path className="fig-curve" d={path(lowIc, 76, 40 + (NEW * 3600) / (NEW * 60 - C[1]))} />
      <L a={[0, 170]} b={[190, 0]} className="fig-dash" />
      <L a={[0, 170]} b={[110, 0]} className="fig-bold" />
      <L a={[0, B[1] + NEW * B[0]]} b={[(B[1] + NEW * B[0]) / NEW, 0]} className="fig-dash" />
      <Dot at={A} label="A" dx={6} dy={-6} /><Dot at={B} label="B" dx={6} dy={-4} /><Dot at={C} label="C" dx={6} dy={-6} />
    </Figure>
  ),
  'zh34-demand-move': () => (
    <Figure label="Egyetlen keresleti görbe (D), rajta egy magasabb árhoz tartozó A pont és egy alacsonyabb árhoz tartozó B pont">
      <Axes x="Q" y="P" />
      <L a={[20, 180]} b={[180, 20]} className="fig-bold" />
      <T at={[180, 20]} anchor="end" dy={-8}>D</T>
      {[[60, 140, 'A'], [130, 70, 'B']].map(([x, y, n]) => (
        <g key={n}><path className="fig-dash" d={`M${sx(0)} ${sy(y)}H${sx(x)}V${sy(0)}`} /><Dot at={[x, y]} label={n} dx={6} dy={-6} /></g>
      ))}
    </Figure>
  ),
  'zh34-demand-left': () => (
    <Figure label="A keresleti görbe D0-ból balra, D1-be tolódott">
      <Axes x="Q" y="P" />
      <L a={[60, 180]} b={[190, 20]} /><L a={[10, 180]} b={[140, 20]} className="fig-bold" />
      <T at={[190, 20]} anchor="end" dy={-12}>D0</T><T at={[140, 20]} dy={-6}>D1</T>
    </Figure>
  ),
  'zh34-ppf-two': () => (
    <Figure label="Kati 80 kenyeret vagy 40 kalácsot, Laci 60 kenyeret vagy 60 kalácsot tud sütni; a két termelési lehetőség egyenes metszi egymást">
      <Axes x="kalács (db)" y="kenyér (db)" />
      <L a={[0, 160]} b={[80, 0]} className="fig-bold" /><L a={[0, 120]} b={[120, 0]} />
      <T at={[0, 160]}>80</T><T at={[0, 120]}>60</T><T at={[80, 0]} dy={14} anchor="middle">40</T><T at={[120, 0]} dy={14} anchor="middle">60</T>
      <T at={[15, 130]} dx={8}>Kati</T><T at={[95, 25]} dx={8}>Laci</T>
    </Figure>
  ),
};
