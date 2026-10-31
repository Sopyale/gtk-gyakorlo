// One small line drawing per subject, drawn in with the hero animation classes (hp-*). Decoration only.
const O = [36, 214];
const pt = (x, y) => `${(O[0] + x).toFixed(1)} ${(O[1] - y).toFixed(1)}`;
const ic = (k) => {
  const xs = [];
  for (let x = k / 196; x <= 268; x += 4) xs.push(x);
  return 'M' + xs.map((x) => pt(x, k / x)).join('L');
};
// Normal density, mean 160, sd 46, scaled to 170 px high.
const bell = (dx = 0) => 'M' + Array.from({ length: 69 }, (_, i) => {
  const x = i * 4;
  return pt(x, 170 * Math.exp(-((x - 160 - dx) ** 2) / (2 * 46 ** 2)) + 6);
}).join('L');

const ART = {
  kozgazdasagtan: (
    <>
      <path className="hp-axis" pathLength="1" d={`M${pt(0, 204)}V${O[1]}H${O[0] + 276}`} />
      <path className="hp-ic" pathLength="1" d={ic(6000)} />
      <path className="hp-ic hot" pathLength="1" d={ic(10800)} />
      <path className="hp-ic" pathLength="1" d={ic(17000)} />
      <path className="hp-budget" pathLength="1" d={`M${pt(0, 180)}L${pt(240, 0)}`} />
      <circle className="hp-dot" cx={O[0] + 120} cy={O[1] - 90} r="6" />
    </>
  ),
  matematika: (
    <>
      <path className="hp-axis" pathLength="1" d={`M${pt(0, 204)}V${O[1]}H${O[0] + 276}`} />
      <path className="hp-ic" pathLength="1" d={bell(-40)} />
      <path className="hp-ic hot" pathLength="1" d={bell()} />
      <path className="hp-budget" pathLength="1" d={`M${pt(160, 0)}V${O[1] - 176}`} />
      <circle className="hp-dot" cx={O[0] + 160} cy={O[1] - 176} r="6" />
    </>
  ),
  szamvitel: (
    <>
      <path className="hp-axis" pathLength="1" d="M40 46H280M160 46V214" />
      <path className="hp-ic" pathLength="1" d="M60 86H140M60 116H130M60 146H140" />
      <path className="hp-ic hot" pathLength="1" d="M180 86H260M180 116H250" />
      <path className="hp-budget" pathLength="1" d="M60 186H140M180 186H260" />
      <circle className="hp-dot" cx="160" cy="46" r="6" />
    </>
  ),
  marketing: (
    <>
      <path className="hp-axis" pathLength="1" d="M40 40H280L230 100H90Z" />
      <path className="hp-ic hot" pathLength="1" d="M90 112H230L196 160H124Z" />
      <path className="hp-ic" pathLength="1" d="M124 172H196L176 206H144Z" />
      <path className="hp-budget" pathLength="1" d="M160 206V230" />
      <circle className="hp-dot" cx="160" cy="232" r="6" />
    </>
  ),
  menedzsment: (
    <>
      <path className="hp-axis" pathLength="1" d="M128 30H192V66H128ZM160 66V96M70 96H250M70 96V122M160 96V122M250 96V122" />
      <path className="hp-ic hot" pathLength="1" d="M44 122H96V154H44ZM134 122H186V154H134ZM224 122H276V154H224Z" />
      <path className="hp-ic" pathLength="1" d="M70 154V176M50 176H90M250 154V176M230 176H270" />
      <path className="hp-budget" pathLength="1" d="M160 154V200" />
      <circle className="hp-dot" cx="160" cy="204" r="6" />
    </>
  ),
  'kozosseg-es-egyen': (
    <>
      <path className="hp-axis" pathLength="1" d="M160 120L80 60M160 120L250 70M160 120L70 180M160 120L240 196M80 60L250 70" />
      <path className="hp-ic hot" pathLength="1" d="M160 120L160 34M70 180L240 196" />
      <path className="hp-budget" pathLength="1" d="M250 70L240 196" />
      {[[80, 60], [250, 70], [70, 180], [240, 196], [160, 34]].map(([x, y]) => <circle key={x} className="hp-node" cx={x} cy={y} r="9" />)}
      <circle className="hp-dot" cx="160" cy="120" r="10" />
    </>
  ),
};

export default function SubjectArt({ id, className }) {
  return <svg className={className} viewBox="0 0 320 240" aria-hidden="true">{ART[id] ?? ART.kozgazdasagtan}</svg>;
}
