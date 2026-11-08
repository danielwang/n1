import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Bell, FolderPlus, Menu, Trash2 } from '../../components/ui/solar-icons';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/OneChatPage';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import { ProjectActions } from '../projects/ProjectActions';
import { projectArt } from '../projects/project-art';
import { projectDate } from '../projects/project-data';
import { courseStorageKey, loadCourses, type Course } from './course-data';
import '../projects/projects.css';
import './courses.css';

type CourseDialog = { type: 'create' } | { type: 'overview' | 'edit' | 'delete'; courseId: string };

function CourseCard({ course, onOpen, onEdit, onArchive, onDelete }: {
  course: Course; onOpen: () => void; onEdit: () => void; onArchive: () => void; onDelete: () => void;
}) {
  return <article className="pj-project-card" aria-label={course.name}>
    <div className="pj-card-top"><span className={`pj-project-icon pj-project-icon--${course.glyph}`}><img src={projectArt[course.glyph]} alt="" /></span>
      <h2><button className="pj-project-link" onClick={onOpen}>{course.name}</button></h2>
    </div>
    <p className="pj-card-description">{course.description || 'A space for lessons, notes, and assignments.'}</p>
    <footer><time dateTime={course.updatedAt} title={`Updated ${new Date(course.updatedAt).toLocaleString()}`}>{projectDate(course.updatedAt)}</time></footer>
    <ProjectActions itemLabel="course" name={course.name} onRename={onEdit} onArchive={onArchive} onDelete={onDelete} archived={course.archived} />
  </article>;
}

function CourseEditor({ course, onSave, onClose }: { course?: Course; onSave: (name: string, description: string) => void; onClose: () => void }) {
  const [name, setName] = useState(course?.name || '');
  const [description, setDescription] = useState(course?.description || '');
  const [error, setError] = useState('');
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) { setError('Enter a course name.'); input.current?.focus(); return; }
    onSave(name.trim(), description.trim());
  };
  return <Dialog title={course ? 'Rename course' : 'Create course'} className="pj-dialog" onClose={onClose}>{close => <form className="pj-form" onSubmit={submit} noValidate>
    <p>Keep lessons, notes, and assignments in one place.</p>
    <label htmlFor={`${id}-name`}>Course name <span>Required</span></label>
    <input autoFocus ref={input} id={`${id}-name`} value={name} maxLength={80} required aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} placeholder="e.g. Introduction to Biology" onChange={event => { setName(event.target.value); setError(''); }} />
    <Feedback id={`${id}-error`} message={error} tone="error" />
    <label htmlFor={`${id}-description`}>Description <span>Optional</span></label>
    <textarea id={`${id}-description`} value={description} maxLength={240} rows={3} placeholder="What will you study?" onChange={event => setDescription(event.target.value)} />
    <p className="pj-form-note">Saved in this browser. No learning platform is connected.</p>
    <div className="pj-dialog-actions"><Button variant="outline" onClick={close}>Cancel</Button><Button variant="default" type="submit">{course ? 'Save changes' : 'Create course'}</Button></div>
  </form>}</Dialog>;
}

export function CoursesPage() {
  const navigation = useAgentNavigation();
  const notifications = useNotifications();
  const [data, setData] = useState(loadCourses);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collection, setCollection] = useState<'mine' | 'archived'>('mine');
  const [dialog, setDialog] = useState<CourseDialog | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const [status, setStatus] = useState('');
  const main = useRef<HTMLElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const courses = data.courses;
  const visible = courses.filter(course => course.archived === (collection === 'archived'));
  const archivedCount = courses.length - courses.filter(course => !course.archived).length;
  const selected = dialog && 'courseId' in dialog ? courses.find(course => course.id === dialog.courseId) : undefined;

  useEffect(() => { const previous = document.title; document.title = 'Courses · Aqua University'; return () => { document.title = previous; }; }, []);
  const save = (next: Course[]) => {
    let warning = '';
    try { localStorage.setItem(courseStorageKey, JSON.stringify(next)); }
    catch { warning = 'Browser storage is unavailable. Course changes will last only for this session.'; }
    setData({ courses: next, warning });
  };
  const update = (id: string, change: (course: Course) => Course) => save(courses.map(course => course.id === id ? { ...change(course), updatedAt: new Date().toISOString() } : course));
  const newChat = () => { window.location.hash = '/onechat'; };
  const openConversation = (conversation: Conversation) => { navigation.setPendingConversation(conversation); newChat(); };
  const openAgent = (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; };
  const sidebarProps = { onNewChat: newChat, onSelect: openConversation, onInfo: setInfo, onSelectAgent: openAgent, onNotifications: notifications.open, unreadCount: notifications.unreadCount, notificationsOpen: notifications.isOpen };
  const finish = (message: string) => { setDialog(null); setStatus(message); };

  return <div className={`onechat projects-page pj-landing courses-page ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a className="oc-skip-link" href="#cs-main" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to courses</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={collapsed} onClose={() => setCollapsed(value => !value)} /></aside>
    <main ref={main} className="oc-main pj-main" id="cs-main" tabIndex={-1}>
      <div className="pj-responsive-toolbar"><Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
        <Button size="icon" className="nf-compact-trigger" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button>
      </div>
      <div className="pj-content">
        <header className="pj-page-heading pj-library-heading"><h1 tabIndex={-1}>Courses</h1><p>Keep lessons, notes, and assignments together so you can pick up where you left off.</p></header>
        {data.warning && <div className="pj-storage-warning"><Feedback message={data.warning} tone="error" /></div>}
        <div className="pj-tabs" ref={tabs} role="tablist" aria-label="Course collections" onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 'mine' : event.key === 'End' ? 'archived' : collection === 'mine' ? 'archived' : 'mine';
          setCollection(next); tabs.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
        }}>
          <Button id="cs-tab-mine" data-tab="mine" role="tab" aria-selected={collection === 'mine'} aria-controls="cs-course-panel" tabIndex={collection === 'mine' ? 0 : -1} onClick={() => setCollection('mine')}>My Courses</Button>
          <Button id="cs-tab-archived" data-tab="archived" role="tab" aria-selected={collection === 'archived'} aria-controls="cs-course-panel" tabIndex={collection === 'archived' ? 0 : -1} onClick={() => setCollection('archived')}>Archived ({archivedCount})</Button>
        </div>
        <div id="cs-course-panel" role="tabpanel" aria-labelledby={`cs-tab-${collection}`}>
          {visible.length ? <div className="pj-project-grid">{visible.map(course => <CourseCard key={course.id} course={course}
            onOpen={() => ['bio101', 'psy201'].includes(course.id) ? window.location.hash = `/onechat/courses/${encodeURIComponent(course.id)}` : setDialog({ type: 'overview', courseId: course.id })}
            onEdit={() => setDialog({ type: 'edit', courseId: course.id })}
            onArchive={() => { update(course.id, item => ({ ...item, archived: !item.archived })); setStatus(course.archived ? 'Course restored to My Courses.' : 'Course moved to Archived.'); tabs.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus(); }}
            onDelete={() => setDialog({ type: 'delete', courseId: course.id })} />)}</div>
            : <section className="pj-empty"><span className="pj-empty-symbol"><FolderPlus size={32} /></span><h2>{collection === 'archived' ? 'No archived courses' : 'Your next course starts here'}</h2><p>{collection === 'archived' ? 'Courses you archive appear here. Restore them whenever you are ready.' : 'Create a course to organise lessons, notes, and assignments in one focused space.'}</p><Button variant={collection === 'archived' ? 'outline' : 'default'} onClick={() => collection === 'archived' ? setCollection('mine') : setDialog({ type: 'create' })}>{collection === 'archived' ? 'View My Courses' : 'Create your first course'}</Button></section>}
        </div>
        <span role="status" className="oc-sr-only">{visible.length} courses shown.</span>
      </div>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {dialog?.type === 'create' && <CourseEditor onClose={() => setDialog(null)} onSave={(name, description) => {
      const now = new Date().toISOString();
      save([{ id: crypto.randomUUID(), name, description, glyph: 'book', updatedAt: now, archived: false, modules: [] }, ...courses]);
      setCollection('mine'); finish('Course created in this local workspace.');
    }} />}
    {dialog?.type === 'edit' && selected && <CourseEditor course={selected} onClose={() => setDialog(null)} onSave={(name, description) => { update(selected.id, course => ({ ...course, name, description })); finish('Course updated.'); }} />}
    {dialog?.type === 'overview' && selected && <Dialog title={selected.name} className="pj-dialog cs-overview" onClose={() => setDialog(null)}>
      <p>{selected.description || 'A local course for organising study material.'}</p>
      <h3>Modules</h3>
      {selected.modules.length ? <ol>{selected.modules.map(module => <li key={module}>{module}</li>)}</ol> : <p>No modules have been added to this local course.</p>}
      <p className="pj-form-note">Course content is sample data. No learning platform is connected.</p>
      <div className="pj-dialog-actions"><Button variant="default" onClick={() => setDialog(null)}>Done</Button></div>
    </Dialog>}
    {dialog?.type === 'delete' && selected && <Dialog title="Delete course?" className="pj-dialog" onClose={() => setDialog(null)}>{close => <>
      <div className="pj-delete-symbol"><Trash2 size={24} /></div><p>Delete <strong>{selected.name}</strong> from this local demo? This cannot be undone.</p>
      <div className="pj-dialog-actions"><Button autoFocus variant="outline" onClick={close}>Cancel</Button><Button className="pj-danger" onClick={() => { save(courses.filter(course => course.id !== selected.id)); finish('Course deleted from this local workspace.'); }}>Delete course</Button></div>
    </>}</Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
    <Feedback message={status} tone="success" toast onDismiss={() => setStatus('')} />
  </div>;
}
