import Layout from './components/Layout.jsx';
import Flashcards from './pages/Flashcards.jsx';
import Home from './pages/Home.jsx';
import Mock from './pages/Mock.jsx';
import Practice from './pages/Practice.jsx';
import Subject from './pages/Subject.jsx';
import { getSubject } from './lib/data.js';
import { useRoute } from './lib/route.js';

export default function App() {
  const { parts: [id, mode], params } = useRoute();
  const subject = id && getSubject(id);
  let page = <Home />;
  if (subject?.active) {
    if (!mode) page = <Subject subject={subject} />;
    else if (mode === 'gyakorlas' || mode === 'rontott') page = <Practice subject={subject} mode={mode} params={params} />;
    else if (mode === 'zh') page = <Mock subject={subject} />;
    else if (mode === 'flashcard') page = <Flashcards subject={subject} />;
  }
  return <Layout current={subject?.id} calm={Boolean(mode)}>{page}</Layout>;
}
