import { Axes, Figure, path, sx, sy } from './kit.jsx';

// Income-consumption curve: parallel budget lines, their tangency points, the curve joining them.
const SLOPE = 0.9;
const POINTS = [[34, 26], [62, 50], [88, 82], [108, 122], [122, 166]];
// Indifference curve through (x0, y0) with slope -SLOPE there: y = y0 (x0 / x)^s.
const ic = ([x0, y0]) => (x) => y0 * (x0 / x) ** ((SLOPE * x0) / y0);
// x where the curve leaves the top of the plot.
const icStart = ([x0, y0]) => x0 * (y0 / 200) ** (y0 / (SLOPE * x0));
const budget = ([x0, y0]) => (x) => y0 - SLOPE * (x - x0);

export default function Icc() {
  return (
    <Figure label="Közömbösségi görbék, párhuzamos szaggatott költségvetési egyenesek és az érintési pontokat összekötő vastag görbe">
      <Axes />
      {POINTS.map((p, i) => (
        <g key={i}>
          <path className="fig-curve" d={path(ic(p), icStart(p), 196)} />
          <path className="fig-dash" d={path(budget(p), Math.max(0, p[0] - (200 - p[1]) / SLOPE), Math.min(200, p[0] + p[1] / SLOPE), 2)} />
          <circle className="fig-dot" cx={sx(p[0])} cy={sy(p[1])} r="3.2" />
        </g>
      ))}
      <path className="fig-bold" d={'M' + [[0, 0], ...POINTS].map(([x, y]) => `${sx(x)} ${sy(y)}`).join('L')} />
    </Figure>
  );
}
