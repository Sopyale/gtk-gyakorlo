import Layout from './components/Layout.jsx';
import Flashcards from './pages/Flashcards.jsx';
import Home from './pages/Home.jsx';
import Hub from './pages/Hub.jsx';
import Mock from './pages/Mock.jsx';
import Practice from './pages/Practice.jsx';
import Subject from './pages/Subject.jsx';
import { getScope, getSubject } from './lib/data.js';
import { useRoute } from './lib/route.js';

export default function App() {
  const { parts: [id, examId, mode], params } = useRoute();
  const subject = id && getSubject(id);
  const scope = subject?.active && examId && getScope(subject, examId);
  let page = <Home />;
  if (scope) {
    if (!mode) page = <Subject subject={scope} />;
    else if (mode === 'gyakorlas' || mode === 'rontott') page = <Practice subject={scope} mode={mode} params={params} />;
    else if (mode === 'szimulacio') page = <Mock subject={scope} />;
    else if (mode === 'flashcard') page = <Flashcards subject={scope} />;
  } else if (subject?.active) page = <Hub subject={subject} />;
  return <Layout current={subject?.id} calm={Boolean(scope && mode)}>{page}</Layout>;
}
