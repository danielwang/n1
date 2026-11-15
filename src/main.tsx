import { lazy, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationProvider } from './components/notifications/NotificationProvider';
const ReleaseNotesPage = lazy(() => import('./components/notifications/NotificationPanel').then(module => ({ default: module.ReleaseNotesPage })));
const OneChatPage = lazy(() => import('./pages/onechat/OneChatPage').then(module => ({ default: module.OneChatPage })));
const AgentChatPage = lazy(() => import('./pages/onechat/AgentChatPage').then(module => ({ default: module.AgentChatPage })));
const AgentDirectoryPage = lazy(() => import('./pages/onechat/AgentDirectoryPage').then(module => ({ default: module.AgentDirectoryPage })));
const ArtifactsPage = lazy(() => import('./pages/onechat/ArtifactsPage').then(module => ({ default: module.ArtifactsPage })));
const ArtifactOpenPage = lazy(() => import('./pages/onechat/ArtifactOpenPage').then(module => ({ default: module.ArtifactOpenPage })));
const ProjectsPage = lazy(() => import('./pages/projects/ProjectsPage').then(module => ({ default: module.ProjectsPage })));
const CoursesPage = lazy(() => import('./pages/courses/CoursesPage').then(module => ({ default: module.CoursesPage })));
const CourseDetail = lazy(() => import('./pages/courses/CourseWorkspace').then(module => ({ default: module.CourseDetail })));
const PsychologyWorkspace = lazy(() => import('./pages/courses/PsychologyWorkspace').then(module => ({ default: module.PsychologyWorkspace })));
const SiblingCourseWorkspace = lazy(() => import('./pages/courses/SiblingCourseWorkspace').then(module => ({ default: module.SiblingCourseWorkspace })));
const LoginPage = lazy(() => import('./pages/login/LoginPage').then(module => ({ default: module.LoginPage })));
const ConnectingPage = lazy(() => import('./pages/login/ConnectingPage').then(module => ({ default: module.ConnectingPage })));
const AccountPage = lazy(() => import('./pages/account/AccountPage').then(module => ({ default: module.AccountPage })));
import { AgentNavigationProvider } from './pages/onechat/AgentNavigationState';
// Keep the existing stylesheet cascade stable while page JavaScript loads by route.
import './components/notifications/notifications.css';
import './pages/onechat/onechat.css';
import './pages/onechat/account-panel.css';
import './pages/onechat/agent-navigation.css';
import './pages/onechat/agent-chat.css';
import './pages/onechat/agent-directory.css';
import './pages/onechat/artifacts.css';
import './pages/onechat/artifact-open.css';
import './pages/projects/project-detail.css';
import './pages/projects/projects.css';
import './pages/courses/courses.css';
import './pages/courses/course-workspace.css';
import './components/ui/toggle-button-group.css';
import './pages/courses/psychology-workspace.css';
import './pages/courses/psychology-figma.css';
import './pages/courses/course-detail.css';
import './pages/login/login.css';
import './pages/login/connecting.css';
import './pages/account/account.css';
import './styles.css';
import './tokens.css';
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
  if (hash === '#/onechat/account' || hash === '#/onechat/account/') return <AccountPage />;
  if (hash === '#/onechat/courses' || hash === '#/onechat/courses/') return <CoursesPage />;
  if (hash.startsWith('#/onechat/courses/')) {
    const segment = hash.slice('#/onechat/courses/'.length).replace(/\/$/, '');
    let courseId = segment;
    try { courseId = decodeURIComponent(segment); } catch { /* Keep the invalid id for the not-found view. */ }
    if (courseId === 'psy201') return <PsychologyWorkspace />;
    if (courseId === 'bio101' || courseId === 'mat203' || courseId === 'eng220') return <SiblingCourseWorkspace key={courseId} courseId={courseId} />;
    return <CourseDetail courseId={courseId} />;
  }
  if (hash === '#/onechat/projects' || hash === '#/onechat/projects/') return <ProjectsPage />;
  if (hash.startsWith('#/onechat/projects/')) {
    const segment = hash.slice('#/onechat/projects/'.length).replace(/\/$/, '');
    let projectId = segment;
    try { projectId = decodeURIComponent(segment); } catch { /* Invalid links use the project-not-found state. */ }
    return <ProjectsPage projectId={projectId} />;
  }
  if (hash === '#/onechat/artifacts' || hash === '#/onechat/artifacts/') return <ArtifactsPage />;
  if (hash === '#/onechat/artifacts/interactive-demo') return <ArtifactOpenPage />;
  if (hash === '#/onechat/agents' || hash === '#/onechat/agents/') return <AgentDirectoryPage />;
  if (hash === '#/release-notes') return <ReleaseNotesPage />;
  if (hash === '#/onechat/agent' || hash === '#/onechat/agent/') return <AgentChatPage />;
  return <OneChatPage />;
}

createRoot(document.getElementById('root')!).render(
  <NotificationProvider>
    <AgentNavigationProvider>
      <Suspense fallback={null}><Root /></Suspense>
    </AgentNavigationProvider>
  </NotificationProvider>,
);
