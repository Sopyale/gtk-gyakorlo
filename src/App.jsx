import Layout from './components/Layout.jsx';
import Account from './pages/Account.jsx';
import Admin from './pages/Admin.jsx';
import Flashcards from './pages/Flashcards.jsx';
import Home from './pages/Home.jsx';
import Hub from './pages/Hub.jsx';
import Mock from './pages/Mock.jsx';
import Plan from './pages/Plan.jsx';
import Privacy from './pages/Privacy.jsx';
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
    else if (mode === 'utemterv') page = <Plan subject={scope} />;
  } else if (subject?.active) page = <Hub subject={subject} />;
  else if (id === 'fiok') page = <Account params={params} />;
  else if (id === 'admin') page = <Admin />;
  else if (id === 'adatkezeles') page = <Privacy />;
  return (
    <Layout current={subject?.id ?? id} calm={Boolean(scope && mode)}>
      <div className="page-in" key={[id, examId, mode].join('/')}>{page}</div>
    </Layout>
  );
}
