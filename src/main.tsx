import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationProvider } from './components/notifications/NotificationProvider';
import { ReleaseNotesPage } from './components/notifications/NotificationPanel';
import { OneChatPage } from './pages/onechat/OneChatPage';
import { AgentChatPage } from './pages/onechat/AgentChatPage';
import { AgentDirectoryPage } from './pages/onechat/AgentDirectoryPage';
import { ArtifactsPage } from './pages/onechat/ArtifactsPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { LoginPage } from './pages/login/LoginPage';
import { ConnectingPage } from './pages/login/ConnectingPage';
import { AgentNavigationProvider } from './pages/onechat/AgentNavigationState';
import './styles.css';
import './styles.module.css';
import './motion.css';
import './components/ui/button.css';

function Root() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const keyboard = () => { document.documentElement.dataset.input = 'keyboard'; };
    const pointer = () => { if (document.documentElement.dataset.input !== 'pointer') document.documentElement.dataset.input = 'pointer'; };
    const onHashChange = () => setHash(window.location.hash);
    document.addEventListener('keydown', keyboard, true);
    document.addEventListener('pointerdown', pointer, true);
    document.addEventListener('pointermove', pointer, true);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      document.removeEventListener('keydown', keyboard, true);
      document.removeEventListener('pointerdown', pointer, true);
      document.removeEventListener('pointermove', pointer, true);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  if (!hash || hash === '#' || hash === '#/' || hash === '#/login' || hash === '#/login/') return <LoginPage />;
  if (hash === '#/connecting' || hash === '#/connecting/') return <ConnectingPage />;
  if (hash === '#/onechat/projects' || hash === '#/onechat/projects/') return <ProjectsPage />;
  if (hash.startsWith('#/onechat/projects/')) {
    const segment = hash.slice('#/onechat/projects/'.length).replace(/\/$/, '');
    let projectId = segment;
    try { projectId = decodeURIComponent(segment); } catch { /* Invalid links use the project-not-found state. */ }
    return <ProjectsPage projectId={projectId} />;
  }
  if (hash === '#/onechat/artifacts' || hash === '#/onechat/artifacts/') return <ArtifactsPage />;
  if (hash === '#/onechat/agents' || hash === '#/onechat/agents/') return <AgentDirectoryPage />;
  if (hash === '#/release-notes') return <ReleaseNotesPage />;
  if (hash === '#/onechat/agent' || hash === '#/onechat/agent/') return <AgentChatPage />;
  return <OneChatPage />;
}

createRoot(document.getElementById('root')!).render(
  <NotificationProvider>
    <AgentNavigationProvider>
      <Root />
    </AgentNavigationProvider>
  </NotificationProvider>,
);
