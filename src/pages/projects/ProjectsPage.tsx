import { useEffect, useRef, useState } from 'react';
import { Bell, Folder, FolderPlus, Menu } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/OneChatPage';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import { projectDate, projectUrl, type Project, type ProjectFile } from './project-data';
import { projectArt } from './project-art';
import { detailArt } from './detail-art';
import { useProjects } from './useProjects';
import { ProjectActions } from './ProjectActions';
import { ProjectDetail } from './ProjectDetail';
import { DeleteProjectDialog, ProjectConversationDialog, ProjectEditor, RemoveFileDialog, ShareProjectDialog } from './ProjectDialogs';
import './projects.css';

type ProjectDialog =
  | { type: 'create' }
  | { type: 'rename' | 'delete'; projectId: string }
  | { type: 'share'; projectId: string }
  | { type: 'remove-file'; projectId: string; file: ProjectFile }
  | { type: 'conversation'; projectId: string; conversationId?: string };

function ProjectCard({ project, onRename, onDelete, onArchive }: { project: Project; onRename: () => void; onDelete: () => void; onArchive: () => void }) {
  const glyph = project.glyph || 'project';
  return <article className="pj-project-card" aria-label={project.name}>
    <div className="pj-card-top"><span className={`pj-project-icon pj-project-icon--${glyph}`}><img src={projectArt[glyph]} alt="" /></span>
      <h2><a className="pj-project-link" href={projectUrl(project.id)} aria-description={`${project.conversations.length} conversations, ${project.files.length} file references`}>{project.name}</a></h2>
    </div>
    <p className="pj-card-description">{project.description || 'A new space for related conversations and reference material.'}</p>
    <footer><time dateTime={project.updatedAt} title={`Updated ${new Date(project.updatedAt).toLocaleString()}`}>{projectDate(project.updatedAt)}</time></footer>
    <ProjectActions name={project.name} onRename={onRename} onDelete={onDelete} onArchive={onArchive} archived={project.archived} />
  </article>;
}

export function ProjectsPage({ projectId }: { projectId?: string }) {
  const store = useProjects();
  const navigation = useAgentNavigation();
  const notifications = useNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collection, setCollection] = useState<'mine' | 'archived'>('mine');
  const [dialog, setDialog] = useState<ProjectDialog | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const [status, setStatus] = useState('');
  const main = useRef<HTMLElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const project = store.projects.find(item => item.id === projectId);
  const dialogProject = dialog && 'projectId' in dialog ? store.projects.find(item => item.id === dialog.projectId) : undefined;
  const archivedCount = store.projects.filter(item => item.archived).length;
  const visible = store.projects.filter(item => Boolean(item.archived) === (collection === 'archived'));
  useEffect(() => {
    const previous = document.title;
    document.title = `${projectId ? project?.name || 'Project' : 'Projects'} · Aqua University`;
    return () => { document.title = previous; };
  }, [projectId, project?.name]);
  useEffect(() => {
    setDialog(null); setMobileOpen(false);
    if (!store.loading) {
      main.current?.scrollTo(0, 0);
      main.current?.querySelector<HTMLElement>('h1')?.focus();
    }
  }, [projectId, store.loading]);
  const newChat = () => { window.location.hash = '/onechat'; };
  const openConversation = (conversation: Conversation) => { navigation.setPendingConversation(conversation); newChat(); };
  const openAgent = (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; };
  const sidebarProps = { onNewChat: newChat, onSelect: openConversation, onInfo: setInfo, onSelectAgent: openAgent, onNotifications: notifications.open, unreadCount: notifications.unreadCount, notificationsOpen: notifications.isOpen };
  const finish = (message: string) => { setDialog(null); setStatus(message); };
  const archive = async (item: Project) => {
    await store.setArchived(item.id, !item.archived); setStatus(item.archived ? 'Project restored to My Projects.' : 'Project moved to Archived.');
    requestAnimationFrame(() => { if (!projectId) tabs.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus(); });
  };
  const actions = (item: Project) => <ProjectActions name={item.name} onRename={() => setDialog({ type: 'rename', projectId: item.id })} onDelete={() => setDialog({ type: 'delete', projectId: item.id })} onArchive={() => { void archive(item); }} archived={item.archived} icon={projectId ? detailArt.dots : undefined} />;

  return <div className={`onechat projects-page ${!projectId ? 'pj-landing' : 'pd-page'} ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a className="oc-skip-link" href="#pj-main" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to projects</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar" hidden={collapsed}><SidebarContent {...sidebarProps} onClose={() => setCollapsed(true)} /></aside>
    <main ref={main} className="oc-main pj-main" id="pj-main" tabIndex={-1}>
      {!projectId && <div className="pj-responsive-toolbar"><Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
        {collapsed && <Button className="oc-desktop-menu" size="icon" aria-label="Expand navigation" onClick={() => setCollapsed(false)}><Menu size={22} /></Button>}
        <Button size="icon" className="nf-compact-trigger" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button>
      </div>}
      <div className="pj-content">
        {store.loading ? <div className="pj-loading" aria-busy="true"><Feedback message="Loading your projects…" tone="loading" /></div>
          : store.error ? <section className="pj-empty"><h1 tabIndex={-1}>Projects unavailable</h1><Feedback message={store.error} tone="error" /><Button variant="outline" onClick={() => { void store.reload(); }}>Try again</Button></section>
          : projectId && !project ? <section className="pj-empty"><Folder size={32} /><h1 tabIndex={-1}>Project not found</h1><p>This project may have been deleted, or the link belongs to another browser’s local demo.</p><a className="ui-button ui-button--outline" href={projectUrl()}>Back to projects</a></section>
          : <>
            {!project && <header className="pj-page-heading pj-library-heading"><h1 tabIndex={-1}>Projects</h1><p>Keep related chats, files, and context together so AI understands the work you're doing.</p><Button className="pj-new-project" variant="default" onClick={() => setDialog({ type: 'create' })}>New Projects</Button></header>}
            {store.warning && <div className="pj-storage-warning"><Feedback message={store.warning} tone="error" /></div>}
            {project ? <ProjectDetail key={project.id} project={project}
              actions={actions(project)} onShare={() => setDialog({ type: 'share', projectId: project.id })} onInfo={setInfo}
              navigationControls={<>{<Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>}{collapsed && <Button className="oc-desktop-menu" size="icon" aria-label="Expand navigation" onClick={() => setCollapsed(false)}><Menu size={22} /></Button>}</>}
              notificationControl={<Button size="icon" className="pd-notification" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button>}
              onStartConversation={async text => {
                const message = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() };
                const chat = { id: crypto.randomUUID(), title: text.split('\n')[0].slice(0, 72), updatedAt: message.createdAt, messages: [message] };
                await store.addConversation(project.id, chat); setDialog({ type: 'conversation', projectId: project.id, conversationId: chat.id });
              }}
              onSaveInstructions={async instructions => { await store.saveInstructions(project.id, instructions); }}
              onConversation={chat => setDialog({ type: 'conversation', projectId: project.id, conversationId: chat.id })}
              onAddFiles={async files => { await store.addFiles(project.id, files); setStatus(`${files.length} local file ${files.length === 1 ? 'reference' : 'references'} added. File contents were not uploaded.`); }}
              onRemoveFile={file => setDialog({ type: 'remove-file', projectId: project.id, file })}
            /> : <>
              <div className="pj-tabs" ref={tabs} role="tablist" aria-label="Project collections" onKeyDown={event => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === 'Home' ? 'mine' : event.key === 'End' ? 'archived' : collection === 'mine' ? 'archived' : 'mine';
                setCollection(next); tabs.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
              }}>
                <Button id="pj-tab-mine" data-tab="mine" role="tab" aria-selected={collection === 'mine'} aria-controls="pj-project-panel" tabIndex={collection === 'mine' ? 0 : -1} onClick={() => setCollection('mine')}>My Projects</Button>
                <Button id="pj-tab-archived" data-tab="archived" role="tab" aria-selected={collection === 'archived'} aria-controls="pj-project-panel" tabIndex={collection === 'archived' ? 0 : -1} onClick={() => setCollection('archived')}>Archived ({archivedCount})</Button>
              </div>
              <div id="pj-project-panel" role="tabpanel" aria-labelledby={`pj-tab-${collection}`}>
                {visible.length ? <div className="pj-project-grid">{visible.map(item => <ProjectCard key={item.id} project={item} onRename={() => setDialog({ type: 'rename', projectId: item.id })} onDelete={() => setDialog({ type: 'delete', projectId: item.id })} onArchive={() => { void archive(item); }} />)}</div>
                  : <section className="pj-empty"><span className="pj-empty-symbol"><FolderPlus size={32} /></span><h2>{collection === 'archived' ? 'No archived projects' : 'Your next idea starts here'}</h2><p>{collection === 'archived' ? 'Projects you archive appear here. Restore them whenever you want to continue.' : 'Create a project to bring conversations, instructions, and file references into one focused space.'}</p><Button variant={collection === 'archived' ? 'outline' : 'default'} onClick={() => collection === 'archived' ? setCollection('mine') : setDialog({ type: 'create' })}>{collection === 'archived' ? 'View My Projects' : 'Create your first project'}</Button></section>}
              </div>
              <span role="status" className="oc-sr-only">{visible.length} projects shown.</span>
            </>}
          </>}
      </div>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {dialog?.type === 'create' && <ProjectEditor onClose={() => setDialog(null)} onSave={async (name, description) => {
      const created = await store.create(name, description); setCollection('mine'); finish('Project created in this local workspace.'); window.location.hash = projectUrl(created.id).slice(1);
    }} />}
    {dialog?.type === 'rename' && dialogProject && <ProjectEditor project={dialogProject} onClose={() => setDialog(null)} onSave={async (name, description) => { await store.rename(dialogProject.id, name, description); finish('Project updated.'); }} />}
    {dialog?.type === 'delete' && dialogProject && <DeleteProjectDialog project={dialogProject} onClose={() => setDialog(null)} onDelete={async () => {
      await store.remove(dialogProject.id); finish('Project deleted from this local workspace.');
      if (projectId === dialogProject.id) window.location.hash = projectUrl().slice(1);
      requestAnimationFrame(() => main.current?.querySelector<HTMLElement>('h1')?.focus());
    }} />}
    {dialog?.type === 'share' && dialogProject && <ShareProjectDialog project={dialogProject} onClose={() => setDialog(null)} />}
    {dialog?.type === 'remove-file' && dialogProject && <RemoveFileDialog file={dialog.file} onClose={() => setDialog(null)} onRemove={async () => {
      await store.removeFile(dialogProject.id, dialog.file.id); finish('File reference removed. The original file is unchanged.');
      requestAnimationFrame(() => main.current?.querySelector<HTMLButtonElement>('.pj-add-files')?.focus());
    }} />}
    {dialog?.type === 'conversation' && dialogProject && <ProjectConversationDialog project={dialogProject} conversation={dialogProject.conversations.find(chat => chat.id === dialog.conversationId)} onClose={() => setDialog(null)} onMessage={async text => {
      const message = { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() };
      if (dialog.conversationId) await store.appendMessage(dialogProject.id, dialog.conversationId, message);
      else {
        const chat = { id: crypto.randomUUID(), title: text.split('\n')[0].slice(0, 72), updatedAt: message.createdAt, messages: [message] };
        await store.addConversation(dialogProject.id, chat); setDialog({ type: 'conversation', projectId: dialogProject.id, conversationId: chat.id });
      }
    }} />}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
    <Feedback message={status} tone="success" toast onDismiss={() => setStatus('')} />
  </div>;
}
