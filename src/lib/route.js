import { useEffect, useState } from 'react';

// Hash routing (#/kozgazdasagtan/gyakorlas?ch=1,2) so deep links work on GitHub Pages.
const parse = () => {
  const [path, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
  return { parts: path.split('/').filter(Boolean), params: new URLSearchParams(query) };
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onHash = () => {
      const update = () => { setRoute(parse()); window.scrollTo(0, 0); };
      if (document.startViewTransition) {
        document.startViewTransition(update);
      } else update();
    };
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

export const href = (...parts) => '#/' + parts.filter(Boolean).join('/');
