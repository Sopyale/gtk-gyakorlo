// The hero's live diagram: indifference curves, a budget line that draws itself, the optimum lighting up.
export default function HeroPlot() {
  return (
    <svg className="hero-plot" viewBox="0 0 520 420" role="img"
      aria-label="Közömbösségi görbék és költségvetési egyenes; az optimum az érintési pontban van">
      <path className="hp-axis" d="M40 20V380H500" />
      <text x="12" y="30">Qb</text>
      <text x="486" y="406">Qa</text>
      <path className="hp-ic" d="M70 60C95 230 170 320 470 350" />
      <path className="hp-ic hot" d="M110 40C135 190 210 268 490 300" />
      <path className="hp-ic" d="M170 30C200 150 270 218 500 240" />
      <path className="hp-ic" d="M240 26C270 110 330 168 500 180" />
      <line className="hp-budget" x1="44" y1="92" x2="424" y2="378" />
      <circle className="hp-dot" cx="208" cy="215" r="8" />
      <text className="hp-label" x="222" y="208">optimum: MRS = Pa/Pb</text>
    </svg>
  );
}
