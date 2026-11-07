import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { Bell, BookOpen, Bot, Check, ChevronDown, ChevronLeft, ChevronRight, FileText, GripVertical, LayoutPanelLeft, Maximize2, Menu, MessageCircle, Minimize2, PanelLeftClose, PanelRightClose, Search, Send, Sparkles, Undo2, X } from '../../components/ui/solar-icons';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/OneChatPage';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import { loadCourses } from './course-data';
import { materials, materialBody, type Material } from './course-workspace-data';
import { makeDemoAnswer, makeStudyOutput, outputName, outputOptions, refineStudyOutput, type SourceReference, type StudyOutput } from './course-study-data';
import './course-detail.css';

type Pane = 'explorer' | 'chat';
type Message = { id: number; role: 'student' | 'assistant'; text: string; references?: SourceReference[] };
const LIMITS = { explorer: { min: 216, default: 264, max: 360 }, chat: { min: 280, default: 352, max: 460 } };
const STORAGE = 'n1-course-workspace-v1';
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const kindIcon = (kind: Material['kind']) => kind === 'lab' || kind === 'quiz' ? <Check size={15} /> : <FileText size={15} />;

function loadLayout(): { explorer: number; chat: number } {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || '{}') as Record<string, number>;
    return { explorer: clamp(saved.explorer || LIMITS.explorer.default, LIMITS.explorer.min, LIMITS.explorer.max), chat: clamp(saved.chat || LIMITS.chat.default, LIMITS.chat.min, LIMITS.chat.max) };
  } catch { return { explorer: 264, chat: 352 }; }
}

export function CourseDetail({ courseId }: { courseId: string }) {
  const navigation = useAgentNavigation();
  const notifications = useNotifications();
  const course = loadCourses().courses.find(item => item.id === courseId);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const [width, setWidth] = useState(() => window.innerWidth);
  const [sizes, setSizes] = useState(loadLayout);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [maximized, setMaximized] = useState(false);
  const [drawer, setDrawer] = useState<Pane | null>(null);
  const [activeRail, setActiveRail] = useState<'materials' | 'chats' | 'artifacts'>('materials');
  const [openModules, setOpenModules] = useState<string[]>(['Week 2 · Cell structure']);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [artifact, setArtifact] = useState(false);
  const [artifactType, setArtifactType] = useState<StudyOutput>('guide');
  const [artifactSources, setArtifactSources] = useState<string[]>([]);
  const [artifactRevision, setArtifactRevision] = useState(1);
  const [artifactHistory, setArtifactHistory] = useState<string[]>([]);
  const [refining, setRefining] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<StudyOutput>('guide');
  const [createSources, setCreateSources] = useState<string[]>(['cell-reading']);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [fileQuery, setFileQuery] = useState('');
  const [workspaceView, setWorkspaceView] = useState<'file' | 'artifact'>('file');
  const [artifactText, setArtifactText] = useState('Cell structure study guide\n\nKey idea: a cell’s structure supports its function.\n\n• The plasma membrane controls what enters and leaves.\n• The nucleus stores genetic instructions.\n• Mitochondria provide usable energy.\n\nNext: compare these structures in plant and animal cells.');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState('');
  const shell = useRef<HTMLDivElement>(null);
  const fileScroll = useRef<HTMLDivElement>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const chatScroll = useRef<HTMLDivElement>(null);
  const chatPosition = useRef(0);
  const drawerElement = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const messageId = useRef(0);
  const citationTarget = useRef<SourceReference | null>(null);
  const hasFile = Boolean(activeFile);
  const desktop = width >= 980;
  const showArtifact = artifact && workspaceView === 'artifact';
  const showFile = hasFile && !showArtifact;
  const chatPrimary = !hasFile && !showArtifact;
  const showExplorer = desktop && explorerOpen && !maximized && (chatPrimary || width >= 1200 || !chatOpen);
  const showChat = desktop && chatOpen && (hasFile || showArtifact) && !maximized;
  const activeMaterial = materials.find(item => item.id === activeFile);
  const shownSources = selectedSources.map(id => materials.find(item => item.id === id)).filter((item): item is Material => Boolean(item));
  const sourceIds = [...new Set([...(showFile && activeFile ? [activeFile] : []), ...selectedSources])];
  const composerSources = refining ? artifactSources : sourceIds;
  const fileMatches = activeFile && fileQuery.trim() ? materialBody[activeFile].sections.map((section, index) => ({ section, index })).filter(({ section }) => `${section.title} ${section.text}`.toLowerCase().includes(fileQuery.trim().toLowerCase())) : [];
  const fileOverviewMatch = Boolean(activeFile && fileQuery.trim() && `${activeMaterial?.detail} ${materialBody[activeFile].heading} ${materialBody[activeFile].intro}`.toLowerCase().includes(fileQuery.trim().toLowerCase()));

  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    if (shell.current) observer.observe(shell.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.title = `${course?.name || 'Course not found'} · Aqua University`;
    return () => { document.title = 'Aqua University'; };
  }, [course?.name]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(sizes)); } catch { /* Layout still works in memory. */ }
  }, [sizes]);
  useLayoutEffect(() => {
    if (!fileScroll.current || !activeFile) return;
    if (citationTarget.current?.materialId === activeFile) {
      const target = fileScroll.current.querySelector<HTMLElement>(`[data-section-index="${citationTarget.current.sectionIndex}"]`);
      target?.scrollIntoView({ block: 'start', behavior: 'instant' });
      target?.focus({ preventScroll: true });
      citationTarget.current = null;
    } else fileScroll.current.scrollTop = scrollPositions.current[activeFile] || 0;
  }, [activeFile, showFile, showExplorer, maximized]);
  useLayoutEffect(() => {
    if (chatScroll.current) chatScroll.current.scrollTop = chatPosition.current;
  }, [showChat, chatPrimary, drawer, maximized]);
  useEffect(() => {
    if (!drawer) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    drawerElement.current?.querySelector<HTMLElement>('button')?.focus();
    const keyboard = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setDrawer(null);
      if (event.key !== 'Tab' || !drawerElement.current) return;
      const focusable = [...drawerElement.current.querySelectorAll<HTMLElement>('button:not([disabled]), input, textarea')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => { document.removeEventListener('keydown', keyboard); previousFocus.current?.focus(); };
  }, [drawer]);

  const openFile = (id: string) => {
    setOpenFiles(files => files.includes(id) ? files : [...files, id]);
    setActiveFile(id);
    setFileQuery('');
    setWorkspaceView('file');
    setDrawer(null);
    setStatus(`${materials.find(item => item.id === id)?.title} opened.`);
  };
  const jumpToSection = (index: number) => {
    const target = fileScroll.current?.querySelector<HTMLElement>(`[data-section-index="${index}"]`);
    target?.scrollIntoView({ block: 'start' });
    target?.focus({ preventScroll: true });
  };
  const jumpToReference = (reference: SourceReference) => {
    citationTarget.current = reference;
    openFile(reference.materialId);
    setStatus(`Opened ${materials.find(item => item.id === reference.materialId)?.title} at the cited section.`);
  };
  const openCreate = () => {
    setCreateSources([...new Set([...selectedSources, ...(activeFile ? [activeFile] : []), ...(!selectedSources.length && !activeFile ? ['cell-reading'] : [])])]);
    setCreateType('guide');
    setCreateOpen(true);
  };
  const createArtifact = () => {
    if (!createSources.length) return;
    setArtifactType(createType);
    setArtifactSources(createSources);
    setArtifactText(makeStudyOutput(createType, createSources));
    setArtifactRevision(1);
    setArtifactHistory([]);
    setArtifact(true);
    setWorkspaceView('artifact');
    setCreateOpen(false);
    setDrawer(null);
    setStatus(`${outputName(createType)} created from ${createSources.length} sample source${createSources.length === 1 ? '' : 's'}.`);
  };
  const startRefining = () => {
    setRefining(true);
    setChatOpen(true);
    if (!desktop || maximized) setDrawer('chat');
    requestAnimationFrame(() => document.getElementById('cd-message')?.focus());
  };
  const closeFile = (id: string) => {
    const next = openFiles.filter(file => file !== id);
    setOpenFiles(next);
    if (activeFile === id) {
      setActiveFile(next[next.length - 1] || null);
      if (!next.length && artifact) setWorkspaceView('artifact');
    }
  };
  const toggleSource = (id: string) => setSelectedSources(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]);
  const updateSize = (pane: Pane, next: number) => {
    const room = width - 64 - 360 - 12 - (pane === 'explorer' ? (showChat ? sizes.chat : 0) : (showExplorer ? sizes.explorer : 0));
    setSizes(current => ({ ...current, [pane]: clamp(next, LIMITS[pane].min, Math.min(LIMITS[pane].max, Math.max(LIMITS[pane].min, room))) }));
  };
  const startResize = (pane: Pane, event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const startX = event.clientX;
    const original = sizes[pane];
    const sign = pane === 'explorer' ? 1 : -1;
    const move = (next: globalThis.PointerEvent) => updateSize(pane, original + (next.clientX - startX) * sign);
    const end = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); document.body.style.cursor = ''; };
    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end, { once: true });
  };
  const resizeKey = (pane: Pane, event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Home') { event.preventDefault(); updateSize(pane, LIMITS[pane].min); }
    else if (event.key === 'End') { event.preventDefault(); updateSize(pane, LIMITS[pane].max); }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      updateSize(pane, sizes[pane] + (event.key === 'ArrowRight' ? 1 : -1) * (pane === 'explorer' ? 1 : -1) * (event.shiftKey ? 32 : 10));
    }
  };
  const divider = (pane: Pane, label: string) => <div className="cd-divider" role="separator" tabIndex={0} aria-orientation="vertical" aria-label={label} aria-valuemin={LIMITS[pane].min} aria-valuemax={LIMITS[pane].max} aria-valuenow={sizes[pane]} onPointerDown={event => startResize(pane, event)} onKeyDown={event => resizeKey(pane, event)}><GripVertical size={15} aria-hidden="true" /></div>;
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;
    const answer = makeDemoAnswer(question, refining && artifact ? artifactSources : sourceIds);
    if (refining && artifact) {
      setArtifactHistory(history => [...history, artifactText]);
      setArtifactText(text => refineStudyOutput(text, question, artifactType, artifactSources, artifactRevision + 1));
      setArtifactRevision(revision => revision + 1);
      setWorkspaceView('artifact');
      setRefining(false);
    }
    setMessages(items => [...items, { id: ++messageId.current, role: 'student', text: question }, { id: ++messageId.current, role: 'assistant', text: refining && artifact ? `Updated ${outputName(artifactType).toLowerCase()} · revision ${artifactRevision + 1}. Review the changed output and check its source sections below.` : answer.text, references: answer.references }]);
    setDraft('');
    setStatus(refining && artifact ? 'Demo artifact revision added.' : 'Demo response added.');
    requestAnimationFrame(() => { if (chatScroll.current) { chatScroll.current.scrollTop = chatScroll.current.scrollHeight; chatPosition.current = chatScroll.current.scrollTop; } });
  };
  const newChat = () => { window.location.hash = '/onechat'; };
  const sidebarProps = {
    onNewChat: newChat,
    onSelect: (conversation: Conversation) => { navigation.setPendingConversation(conversation); newChat(); },
    onInfo: setInfo,
    onSelectAgent: (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; },
    onNotifications: notifications.open,
    unreadCount: notifications.unreadCount,
    notificationsOpen: notifications.isOpen,
  };

  if (!course) return <main className="cd-not-found"><h1>Course not found</h1><p>This course may have been removed from this browser.</p><Button variant="default" onClick={() => { window.location.hash = '/onechat/courses'; }}>Back to courses</Button></main>;

  const explorer = <div className="cd-explorer-inner">
    <div className="cd-pane-heading"><div><span className="cd-overline">COURSE EXPLORER</span><h2>{activeRail === 'materials' ? 'Materials' : activeRail === 'chats' ? 'Chats' : 'Artifacts'}</h2></div><Button size="icon" aria-label="Collapse explorer" title="Collapse explorer" onClick={() => { setExplorerOpen(false); setDrawer(null); }}><PanelLeftClose size={18} /></Button></div>
    {activeRail === 'materials' ? <>
      <div className="cd-week-card"><div className="cd-week-heading"><span>UP NEXT</span><span>WEEK 02</span></div><strong>Keep the momentum going</strong><button onClick={() => openFile('cell-lab')}><span className="cd-task-mark">◌</span><span>Lab 2 · Exploring cells<small>Due Friday, 11:59 pm</small></span><ChevronRight size={16} /></button></div>
      <div className="cd-tree-heading"><span>COURSE CONTENT</span><span>{materials.length} items</span></div>
      <button className="cd-syllabus" onClick={() => openFile('syllabus')}><BookOpen size={16} /> Syllabus</button>
      {['Week 2 · Cell structure', 'Week 3 · Genetics'].map(module => <div className="cd-module" key={module}>
        <button className="cd-module-toggle" aria-expanded={openModules.includes(module)} onClick={() => setOpenModules(items => items.includes(module) ? items.filter(item => item !== module) : [...items, module])}>{openModules.includes(module) ? <ChevronDown size={15} /> : <ChevronRight size={15} />}<span>{module}</span><small>{materials.filter(item => item.module === module).length}</small></button>
        {openModules.includes(module) && <ul>{materials.filter(item => item.module === module).map(item => <li key={item.id} className={activeFile === item.id ? 'is-active' : ''}><label className="cd-source-check" title={`Use ${item.title} as AI source`}><input type="checkbox" checked={selectedSources.includes(item.id)} onChange={() => toggleSource(item.id)} aria-label={`Use ${item.title} as AI source`} /></label><button className="cd-material" onClick={() => openFile(item.id)}>{kindIcon(item.kind)}<span>{item.title}<small>{item.detail}</small></span></button></li>)}</ul>}
      </div>)}
    </> : activeRail === 'chats' ? <div className="cd-rail-panel"><MessageCircle size={22} /><strong>Course conversation</strong><p>Your current chat stays available while you review materials.</p><Button variant="outline" onClick={() => { setChatOpen(true); if (!desktop || maximized) setDrawer('chat'); }}>Open chat</Button></div> : <div className="cd-rail-panel"><Sparkles size={22} /><strong>{artifact ? outputName(artifactType) : 'Make something useful'}</strong><p>{artifact ? 'Your study material is ready to reopen.' : 'Create a study output from your course material.'}</p>{artifact && <Button variant="outline" onClick={() => { setWorkspaceView('artifact'); setDrawer(null); }}>Open {outputName(artifactType).toLowerCase()}</Button>}<Button variant="outline" onClick={openCreate}>{artifact ? 'Replace output' : 'Create new output'}</Button></div>}
  </div>;

  const chat = <div className="cd-chat-inner">
    <div className="cd-pane-heading cd-chat-heading"><div><span className="cd-overline">YOUR STUDY PARTNER</span><h2><span className="cd-ai-dot"><Sparkles size={15} /></span> Course chat</h2></div>{!chatPrimary && <Button size="icon" aria-label="Collapse chat" title="Collapse chat" onClick={() => { setChatOpen(false); setDrawer(null); }}><PanelRightClose size={18} /></Button>}</div>
    <div className="cd-chat-messages" ref={chatScroll} onScroll={event => { chatPosition.current = event.currentTarget.scrollTop; }}>
      {messages.length === 0 ? <div className="cd-chat-welcome">
        {chatPrimary && <div className="cd-landing-brief"><div><span className="cd-overline">UP NEXT · WEEK 02</span><strong>Lab 2 · Exploring cells</strong><small>Due Friday, 11:59 pm · Sample course data</small></div><div className="cd-landing-actions"><Button variant="outline" onClick={() => openFile('cell-lab')}>Open lab</Button><Button variant="outline" onClick={() => { setSelectedSources(['cell-lab']); setDraft('Help me prepare for Lab 2'); }}>Ask for help</Button></div></div>}
        {chatPrimary && <div className="cd-landing-update"><span>UPDATED TODAY · Cell structure lecture slides</span><button onClick={() => openFile('cell-slides')}>Open slides <ChevronRight size={14} /></button></div>}
        <div className="cd-welcome-icon"><Sparkles size={23} /></div><span className="cd-overline">READY WHEN YOU ARE</span><h3>{showFile && activeMaterial ? `Explore ${activeMaterial.title}` : 'What would you like to explore?'}</h3><p>{showFile ? 'Ask about the open material. Its source will appear with your answer.' : 'Ask about a concept, or choose course materials to ground an answer.'}</p>
        <div className="cd-suggestions"><button onClick={() => setDraft('Explain how organelles work together in a cell')}>Explain a concept <ChevronRight size={15} /></button><button onClick={openCreate}>Create study material <ChevronRight size={15} /></button></div>
      </div> : <div className="cd-message-list">{messages.map(message => <div key={message.id} className={`cd-message cd-message--${message.role}`}><span>{message.role === 'student' ? 'You' : 'N1 AI · Demo'}</span><p>{message.text}</p>{message.references && message.references.length > 0 && <div className="cd-citation-list" aria-label="Source references">{message.references.map((reference, index) => <button key={`${message.id}-${reference.materialId}`} onClick={() => jumpToReference(reference)}><BookOpen size={14} /><span>{index + 1}. {materials.find(item => item.id === reference.materialId)?.title} · {materialBody[reference.materialId].sections[reference.sectionIndex].title}</span><ChevronRight size={14} /></button>)}</div>}</div>)}</div>}
    </div>
    <form className="cd-composer" onSubmit={submit}>
      {refining && <div className="cd-refine-banner"><span>Refining {outputName(artifactType).toLowerCase()} · revision {artifactRevision + 1}</span><button type="button" onClick={() => setRefining(false)}>Cancel</button></div>}
      <div className="cd-composer-top">{composerSources.length ? <><span className="cd-overline">{refining ? 'ARTIFACT SOURCES' : `USING ${composerSources.length} SOURCE${composerSources.length === 1 ? '' : 'S'}`}</span><div className="cd-source-pills">{showFile && activeMaterial && !selectedSources.includes(activeMaterial.id) && !refining && <span className="cd-open-source">Open file · {activeMaterial.title}</span>}{refining ? artifactSources.map(id => <span className="cd-open-source" key={id}>{materials.find(item => item.id === id)?.title}</span>) : shownSources.map(item => <button type="button" key={item.id} onClick={() => toggleSource(item.id)} aria-label={`Remove ${item.title} from sources`}>{item.title}<X size={13} /></button>)}</div></> : <span className="cd-composer-hint">Choose materials in the explorer for a course-grounded answer</span>}</div>
      <label className="cd-sr-only" htmlFor="cd-message">{refining ? `Describe how to refine ${outputName(artifactType).toLowerCase()}` : 'Ask about this course'}</label><textarea id="cd-message" rows={3} value={draft} placeholder={refining ? 'Describe what to change in this study material...' : 'Ask about this course...'} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
      <div className="cd-composer-bottom"><button type="button" className="cd-policy-link" onClick={() => setPolicyOpen(true)}>Sample AI guidance</button><span>Local demo · no AI service</span><Button variant="default" size="icon" aria-label={refining ? 'Refine study material' : 'Send message'} disabled={!draft.trim()} type="submit"><Send size={17} /></Button></div>
    </form>
  </div>;

  return <div className={`onechat cd-shell ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={collapsed} onClose={() => setCollapsed(value => !value)} /></aside>
    <div className="oc-main cd-page-main"><div className="cd-app" ref={shell}>
    <a className="cd-skip" href="#cd-main">Skip to workspace</a>
    <header className="cd-topbar"><div className="cd-course-title"><Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button><Button size="icon" aria-label="Back to courses" onClick={() => { window.location.hash = '/onechat/courses'; }}><ChevronLeft size={19} /></Button><div><span className="cd-overline">AQUA UNIVERSITY <span aria-hidden="true">/</span> FALL 2026</span><h1>{course.name}</h1></div></div><div className="cd-top-actions"><Button className="cd-mobile-notifications" size="icon" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button></div></header>
    <div className="cd-layout" style={{ gridTemplateColumns: `64px ${showExplorer ? `${sizes.explorer}px 6px` : ''} minmax(0, 1fr) ${showChat ? `6px ${sizes.chat}px` : ''}` }}>
      <nav className="cd-rail" aria-label="Course sections"><Button className={activeRail === 'materials' ? 'is-active' : ''} aria-label="Materials" aria-current={activeRail === 'materials' ? 'page' : undefined} onClick={() => { setActiveRail('materials'); setExplorerOpen(true); if (!showExplorer && (width < 1200 || !desktop)) setDrawer('explorer'); }}><BookOpen size={20} /><span>Materials</span></Button><Button className={activeRail === 'chats' ? 'is-active' : ''} aria-label="Chats" aria-current={activeRail === 'chats' ? 'page' : undefined} onClick={() => { setActiveRail('chats'); setExplorerOpen(true); if (!showExplorer && (width < 1200 || !desktop)) setDrawer('explorer'); }}><MessageCircle size={20} /><span>Chats</span></Button><Button className={activeRail === 'artifacts' ? 'is-active' : ''} aria-label="Artifacts" aria-current={activeRail === 'artifacts' ? 'page' : undefined} onClick={() => { setActiveRail('artifacts'); setExplorerOpen(true); if (!showExplorer && (width < 1200 || !desktop)) setDrawer('explorer'); }}><Sparkles size={20} /><span>Artifacts</span></Button><div className="cd-rail-spacer" /><Button aria-label="Toggle explorer" title="Toggle explorer" onClick={() => showExplorer ? setExplorerOpen(false) : width < 1200 || !desktop ? setDrawer('explorer') : setExplorerOpen(true)}><LayoutPanelLeft size={20} /><span>Explorer</span></Button></nav>
      {showExplorer && <><aside className="cd-explorer" aria-label="Course explorer">{explorer}</aside>{divider('explorer', 'Resize course explorer')}</>}
      <main id="cd-main" className="cd-workspace" tabIndex={-1}>
        <div className="cd-workspace-toolbar"><div className="cd-workspace-tools">{!showExplorer && <Button size="icon" aria-label="Open explorer" title="Open explorer" onClick={() => width < 1200 || !desktop ? setDrawer('explorer') : setExplorerOpen(true)}><Menu size={19} /></Button>}<span className="cd-workspace-label">WORKSPACE</span><span className="cd-toolbar-separator" /> <strong>{showArtifact ? outputName(artifactType) : activeMaterial ? activeMaterial.title : 'Course chat'}</strong></div><div className="cd-workspace-actions">{artifact && hasFile && <div className="cd-view-switch" role="group" aria-label="Workspace view"><Button aria-pressed={showFile} onClick={() => setWorkspaceView('file')}>File</Button><Button aria-pressed={showArtifact} onClick={() => setWorkspaceView('artifact')}>Output</Button></div>}{(showFile || showArtifact) && <Button size="icon" aria-label={maximized ? 'Restore panes' : 'Maximise workspace'} title={maximized ? 'Restore panes' : 'Maximise workspace'} onClick={() => setMaximized(value => !value)}>{maximized ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</Button>}{!showChat && !chatPrimary && <Button variant="outline" onClick={() => { setChatOpen(true); if (!desktop || maximized) setDrawer('chat'); }}><MessageCircle size={16} /> Chat</Button>}</div></div>
        {chatPrimary ? <div className="cd-primary-chat">{chat}</div> : <div className="cd-content-grid">
          {showFile && <section className="cd-file-pane" aria-label="Open course material"><div className="cd-file-tabs" role="tablist" aria-label="Open materials">{openFiles.map(id => { const item = materials.find(material => material.id === id); return item && <div className={`cd-file-tab ${activeFile === id ? 'is-active' : ''}`} key={id}><button role="tab" aria-selected={activeFile === id} onClick={() => { setActiveFile(id); setFileQuery(''); }}>{kindIcon(item.kind)}<span>{item.title}</span></button><button className="cd-tab-close" aria-label={`Close ${item.title}`} onClick={() => closeFile(id)}><X size={14} /></button></div>; })}</div><div className="cd-file-find"><Search size={16} aria-hidden="true" /><label className="cd-sr-only" htmlFor="cd-file-query">Find in open material</label><input id="cd-file-query" type="search" value={fileQuery} placeholder="Find in this file" onChange={event => setFileQuery(event.target.value)} />{fileQuery && <span>{fileMatches.length + Number(fileOverviewMatch)} result{fileMatches.length + Number(fileOverviewMatch) === 1 ? '' : 's'}</span>}</div>{fileQuery && <div className="cd-find-results" aria-label="Find results">{fileOverviewMatch && <button onClick={() => { if (fileScroll.current) fileScroll.current.scrollTop = 0; }}>Overview and details<ChevronRight size={14} /></button>}{fileMatches.map(({ section, index }) => <button key={section.title} onClick={() => jumpToSection(index)}>{section.title}<ChevronRight size={14} /></button>)}{!fileOverviewMatch && !fileMatches.length && <span>No matches</span>}</div>}<div className="cd-file-scroll" ref={fileScroll} onScroll={event => { if (activeFile) scrollPositions.current[activeFile] = event.currentTarget.scrollTop; }}><div className="cd-document"><div className="cd-document-meta"><span>{materialBody[activeFile!].eyebrow}</span><span>{activeMaterial?.detail}</span></div><h2>{materialBody[activeFile!].heading}</h2><p className="cd-document-intro">{materialBody[activeFile!].intro}</p><div className="cd-document-callout"><span>STUDY PROMPT</span><p>What is the main idea, and how would you explain it to someone new to biology?</p></div>{materialBody[activeFile!].sections.map((section, index) => <section key={section.title} data-section-index={index} tabIndex={-1}><h3>{section.title}</h3><p>{section.text}</p></section>)}<div className="cd-document-end">End of preview · Sample course material</div></div></div></section>}
          {showArtifact && <section className="cd-artifact-pane" aria-label={`${outputName(artifactType)} artifact`}><div className="cd-artifact-header"><div><span className="cd-overline">EDITABLE STUDY MATERIAL · REVISION {artifactRevision}</span><h2>{outputName(artifactType)} · BIO101</h2></div><Button size="icon" aria-label="Return to reading or chat" onClick={() => setWorkspaceView('file')}><X size={17} /></Button></div><div className="cd-artifact-sources"><span>Made from</span>{artifactSources.map(id => <button key={id} onClick={() => jumpToReference({ materialId: id, sectionIndex: 0 })}>{materials.find(item => item.id === id)?.title}<ChevronRight size={13} /></button>)}</div><div className="cd-artifact-actions"><Button variant="outline" onClick={startRefining}><MessageCircle size={15} /> Refine in chat</Button><Button variant="outline" disabled={!artifactHistory.length} onClick={() => { const previous = artifactHistory[artifactHistory.length - 1]; if (previous === undefined) return; setArtifactText(previous); setArtifactHistory(history => history.slice(0, -1)); setArtifactRevision(revision => Math.max(1, revision - 1)); setStatus('Previous revision restored.'); }}><Undo2 size={15} /> Undo revision</Button></div><details className="cd-artifact-check"><summary>Verify against source sections</summary><div>{artifactSources.flatMap(id => materialBody[id].sections.map((section, index) => <button key={`${id}-${index}`} onClick={() => jumpToReference({ materialId: id, sectionIndex: index })}>{materials.find(item => item.id === id)?.title} · {section.title}<ChevronRight size={13} /></button>))}</div></details><label className="cd-sr-only" htmlFor="cd-artifact-editor">Edit {outputName(artifactType).toLowerCase()}</label><textarea id="cd-artifact-editor" value={artifactText} onChange={event => setArtifactText(event.target.value)} spellCheck={false} /><div className="cd-artifact-footer"><span><Check size={14} /> Changes kept in this session</span><span>Local demo output</span></div></section>}
        </div>}
      </main>
      {showChat && <>{divider('chat', 'Resize course chat')}<aside className="cd-chat-pane" aria-label="Course chat">{chat}</aside></>}
    </div>
    {!chatPrimary && !showChat && <Button className="cd-floating-chat" aria-label="Open course chat" onClick={() => setDrawer('chat')}><Bot size={20} /><span>Chat</span></Button>}
    {drawer && <div className="cd-drawer-backdrop" onPointerDown={event => { if (event.target === event.currentTarget) setDrawer(null); }}><aside ref={drawerElement} className={`cd-drawer cd-drawer--${drawer}`} role="dialog" aria-modal="true" aria-label={drawer === 'chat' ? 'Course chat' : 'Course explorer'}><div className="cd-drawer-bar"><span>{drawer === 'chat' ? 'Course chat' : 'Course explorer'}</span><Button size="icon" aria-label="Close panel" onClick={() => setDrawer(null)}><X size={20} /></Button></div>{drawer === 'chat' ? chat : explorer}</aside></div>}
    <span className="cd-sr-only" role="status">{status}</span>
    </div></div>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {createOpen && <Dialog title="Create study material" className="cd-create-dialog" onClose={() => setCreateOpen(false)}><div className="cd-create-content"><p>Choose an output and its course materials. This prototype creates sample content locally.{artifact && ' Creating a new output replaces the current one in this session.'}</p><fieldset><legend>What would you like to make?</legend><div className="cd-output-options">{outputOptions.map(option => <label key={option.id} className={createType === option.id ? 'is-selected' : ''}><input type="radio" name="study-output" checked={createType === option.id} onChange={() => setCreateType(option.id)} /><span><strong>{option.title}</strong><small>{option.description}</small></span></label>)}</div></fieldset><fieldset><legend>Use these sources</legend><div className="cd-create-sources">{materials.map(item => <label key={item.id}><input type="checkbox" checked={createSources.includes(item.id)} onChange={() => setCreateSources(ids => ids.includes(item.id) ? ids.filter(id => id !== item.id) : [...ids, item.id])} /><span>{item.title}</span></label>)}</div></fieldset>{!createSources.length && <p className="cd-create-error" role="alert">Select at least one source to create study material.</p>}<div className="cd-create-footer"><button className="cd-policy-link" onClick={() => setPolicyOpen(true)}>Sample AI guidance</button><Button variant="default" disabled={!createSources.length} onClick={createArtifact}>Create {outputName(createType).toLowerCase()}</Button></div></div></Dialog>}
    {policyOpen && <Dialog title="Sample course AI guidance" onClose={() => setPolicyOpen(false)}><div className="cd-policy-content"><p>This is example guidance for the prototype. Confirm the actual rules with your instructor or course syllabus.</p><ul><li>Use AI to explain concepts, compare assigned materials, and prepare study notes.</li><li>Make your own lab observations and complete work you submit in your own words.</li><li>Check generated explanations and study material against the original sources.</li></ul><Button variant="outline" onClick={() => { setPolicyOpen(false); setCreateOpen(false); openFile('syllabus'); }}>Open sample syllabus</Button></div></Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
