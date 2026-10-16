import { useEffect, useRef } from 'react';

// Counts up to `to` once on mount, writing the text node directly so React does not re-render every frame.
export default function Count({ to, ms = 1100 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf, t0;
    const step = (t) => {
      t0 ??= t;
      const k = Math.min((t - t0) / ms, 1);
      el.textContent = Math.round(to * (1 - (1 - k) ** 3));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); el.textContent = to; };
  }, [to]);
  return <><span ref={ref} aria-hidden="true">{to}</span><span className="sr">{to}</span></>;
}
