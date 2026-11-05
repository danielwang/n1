import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { Bell, BookOpen, Bot, Check, ChevronDown, ChevronLeft, ChevronRight, FileText, GripVertical, LayoutPanelLeft, Maximize2, Menu, MessageCircle, Minimize2, PanelLeftClose, PanelRightClose, Send, Sparkles, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/OneChatPage';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import { loadCourses } from './course-data';
import { materials, materialBody, type Material } from './course-workspace-data';
import './course-detail.css';

type Pane = 'explorer' | 'chat' | 'comparison';
type Message = { id: number; role: 'student' | 'assistant'; text: string };
const LIMITS = { explorer: { min: 216, default: 264, max: 360 }, chat: { min: 280, default: 352, max: 460 }, comparison: { min: 240, default: 320, max: 620 } };
const STORAGE = 'n1-course-workspace-v1';
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const kindIcon = (kind: Material['kind']) => kind === 'lab' || kind === 'quiz' ? <Check size={15} /> : <FileText size={15} />;

function loadLayout(): { explorer: number; chat: number; comparison: number } {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE) || '{}') as Record<string, number>;
    return { explorer: clamp(saved.explorer || LIMITS.explorer.default, LIMITS.explorer.min, LIMITS.explorer.max), chat: clamp(saved.chat || LIMITS.chat.default, LIMITS.chat.min, LIMITS.chat.max), comparison: clamp(saved.comparison || LIMITS.comparison.default, LIMITS.comparison.min, LIMITS.comparison.max) };
  } catch { return { explorer: 264, chat: 352, comparison: 320 }; }
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
  const [compactView, setCompactView] = useState<'file' | 'artifact'>('file');
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
  const hasFile = Boolean(activeFile);
  const desktop = width >= 980;
  const compact = width < 700;
  const showExplorer = desktop && explorerOpen && !maximized;
  const showChat = desktop && width >= 1180 && chatOpen && (hasFile || artifact) && !maximized;
  const showComparison = artifact && hasFile;
  const chatPrimary = !hasFile && !artifact;
  const activeMaterial = materials.find(item => item.id === activeFile);
  const shownSources = selectedSources.map(id => materials.find(item => item.id === id)).filter((item): item is Material => Boolean(item));

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
    if (fileScroll.current && activeFile) fileScroll.current.scrollTop = scrollPositions.current[activeFile] || 0;
  }, [activeFile, showComparison, showExplorer, maximized, compactView]);
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
    setCompactView('file');
    setDrawer(null);
    setStatus(`${materials.find(item => item.id === id)?.title} opened.`);
  };
  const closeFile = (id: string) => {
    const next = openFiles.filter(file => file !== id);
    setOpenFiles(next);
    if (activeFile === id) setActiveFile(next[next.length - 1] || null);
  };
  const toggleSource = (id: string) => setSelectedSources(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]);
  const updateSize = (pane: Pane, next: number) => {
    const compared = showComparison && width >= 1380 && !maximized ? sizes.comparison : 0;
    const room = width - 64 - 360 - 18 - (pane === 'explorer' ? (showChat ? sizes.chat : 0) + compared : pane === 'chat' ? (showExplorer ? sizes.explorer : 0) + compared : (showExplorer ? sizes.explorer : 0) + (showChat ? sizes.chat : 0));
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
    const sourceNames = shownSources.map(item => item.title);
    if (activeMaterial && !sourceNames.includes(activeMaterial.title)) sourceNames.unshift(activeMaterial.title);
    setMessages(items => [...items, { id: ++messageId.current, role: 'student', text: question }, { id: ++messageId.current, role: 'assistant', text: sourceNames.length ? `Based on ${sourceNames.join(' and ')}, start with the central idea and compare the evidence in each source. For this local demo, the answer is illustrative rather than generated from the files.` : 'A useful first step is to identify the concept you want to explain, then connect it to an example from your course material. This is a local demo response.' }]);
    setDraft('');
    setStatus('Demo response added.');
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
    </> : activeRail === 'chats' ? <div className="cd-rail-panel"><MessageCircle size={22} /><strong>Course conversation</strong><p>Your current chat stays available while you review materials.</p><Button variant="outline" onClick={() => { setDrawer('chat'); setChatOpen(true); }}>Open chat</Button></div> : <div className="cd-rail-panel"><Sparkles size={22} /><strong>{artifact ? 'Cell structure study guide' : 'Make something useful'}</strong><p>{artifact ? 'Your editable study guide is open in the workspace.' : 'Create a study guide from your course context.'}</p><Button variant="outline" onClick={() => { setArtifact(true); setCompactView('artifact'); setExplorerOpen(false); setDrawer(null); }}>Open study guide</Button></div>}
  </div>;

  const chat = <div className="cd-chat-inner"><div className="cd-pane-heading cd-chat-heading"><div><span className="cd-overline">YOUR STUDY PARTNER</span><h2><span className="cd-ai-dot"><Sparkles size={15} /></span> Course chat</h2></div><Button size="icon" aria-label="Collapse chat" title="Collapse chat" onClick={() => { setChatOpen(false); setDrawer(null); }}><PanelRightClose size={18} /></Button></div>
    <div className="cd-chat-messages" ref={chatScroll} onScroll={event => { chatPosition.current = event.currentTarget.scrollTop; }}>
      {messages.length === 0 ? <div className="cd-chat-welcome"><div className="cd-welcome-icon"><Sparkles size={23} /></div><span className="cd-overline">READY WHEN YOU ARE</span><h3>What would you like to explore?</h3><p>Ask about a concept, or select materials in the explorer to give your question context.</p><div className="cd-suggestions"><button onClick={() => setDraft('Explain how organelles work together in a cell')}>Explain a concept <ChevronRight size={15} /></button><button onClick={() => { setArtifact(true); setCompactView('artifact'); setExplorerOpen(false); setStatus('Editable study guide created in this local demo.'); }}>Create a study guide <ChevronRight size={15} /></button></div></div> : <div className="cd-message-list">{messages.map(message => <div key={message.id} className={`cd-message cd-message--${message.role}`}><span>{message.role === 'student' ? 'You' : 'N1 AI · Demo'}</span><p>{message.text}</p></div>)}</div>}
    </div>
    <form className="cd-composer" onSubmit={submit}><div className="cd-composer-top">{shownSources.length ? <><span className="cd-overline">USING AS SOURCES</span><div className="cd-source-pills">{shownSources.map(item => <button type="button" key={item.id} onClick={() => toggleSource(item.id)} aria-label={`Remove ${item.title} from sources`}>{item.title}<X size={13} /></button>)}</div></> : <span className="cd-composer-hint">Select source checkboxes to ground your question</span>}</div><label className="cd-sr-only" htmlFor="cd-message">Ask about this course</label><textarea id="cd-message" rows={3} value={draft} placeholder="Ask about this course..." onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} /><div className="cd-composer-bottom"><span>Local demo · no AI service connected</span><Button variant="default" size="icon" aria-label="Send message" disabled={!draft.trim()} type="submit"><Send size={17} /></Button></div></form>
  </div>;

  return <div className={`onechat cd-shell ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={collapsed} onClose={() => setCollapsed(value => !value)} /></aside>
    <div className="oc-main cd-page-main"><div className="cd-app" ref={shell}>
    <a className="cd-skip" href="#cd-main">Skip to workspace</a>
    <header className="cd-topbar"><div className="cd-course-title"><Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button><Button size="icon" aria-label="Back to courses" onClick={() => { window.location.hash = '/onechat/courses'; }}><ChevronLeft size={19} /></Button><div><span className="cd-overline">AQUA UNIVERSITY <span aria-hidden="true">/</span> FALL 2026</span><h1>{course.name}</h1></div></div><div className="cd-top-actions"><Button className="cd-mobile-notifications" size="icon" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button></div></header>
    <div className="cd-layout" style={{ gridTemplateColumns: `64px ${showExplorer ? `${sizes.explorer}px 6px` : ''} minmax(0, 1fr) ${showChat ? `6px ${sizes.chat}px` : ''}` }}>
      <nav className="cd-rail" aria-label="Course sections"><Button className={activeRail === 'materials' ? 'is-active' : ''} aria-label="Materials" aria-current={activeRail === 'materials' ? 'page' : undefined} onClick={() => { setActiveRail('materials'); setExplorerOpen(true); if (!desktop) setDrawer('explorer'); }}><BookOpen size={20} /><span>Materials</span></Button><Button className={activeRail === 'chats' ? 'is-active' : ''} aria-label="Chats" aria-current={activeRail === 'chats' ? 'page' : undefined} onClick={() => { setActiveRail('chats'); setExplorerOpen(true); if (!desktop) setDrawer('explorer'); }}><MessageCircle size={20} /><span>Chats</span></Button><Button className={activeRail === 'artifacts' ? 'is-active' : ''} aria-label="Artifacts" aria-current={activeRail === 'artifacts' ? 'page' : undefined} onClick={() => { setActiveRail('artifacts'); setExplorerOpen(true); if (!desktop) setDrawer('explorer'); }}><Sparkles size={20} /><span>Artifacts</span></Button><div className="cd-rail-spacer" /><Button aria-label="Toggle explorer" title="Toggle explorer" onClick={() => desktop ? setExplorerOpen(value => !value) : setDrawer('explorer')}><LayoutPanelLeft size={20} /><span>Explorer</span></Button></nav>
      {showExplorer && <><aside className="cd-explorer" aria-label="Course explorer">{explorer}</aside>{divider('explorer', 'Resize course explorer')}</>}
      <main id="cd-main" className="cd-workspace" tabIndex={-1}>
        <div className="cd-workspace-toolbar"><div className="cd-workspace-tools">{!showExplorer && <Button size="icon" aria-label="Open explorer" title="Open explorer" onClick={() => desktop ? setExplorerOpen(true) : setDrawer('explorer')}><Menu size={19} /></Button>}<span className="cd-workspace-label">WORKSPACE</span><span className="cd-toolbar-separator" /> <strong>{artifact ? 'Study guide' : activeMaterial ? activeMaterial.title : 'Course chat'}</strong></div><div className="cd-workspace-actions">{compact && showComparison && <div className="cd-view-switch" role="group" aria-label="Workspace view"><Button aria-pressed={compactView === 'file'} onClick={() => setCompactView('file')}>File</Button><Button aria-pressed={compactView === 'artifact'} onClick={() => setCompactView('artifact')}>Guide</Button></div>}{(hasFile || artifact) && <Button size="icon" aria-label={maximized ? 'Restore panes' : 'Maximise workspace'} title={maximized ? 'Restore panes' : 'Maximise workspace'} onClick={() => setMaximized(value => !value)}>{maximized ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</Button>}{!showChat && !chatPrimary && <Button variant="outline" onClick={() => { setChatOpen(true); if (!desktop || width < 1180 || maximized) setDrawer('chat'); }}><MessageCircle size={16} /> Chat</Button>}</div></div>
        {chatPrimary ? <div className="cd-primary-chat">{chat}</div> : <div className="cd-content-grid" style={{ gridTemplateColumns: showComparison && width >= 1380 && !maximized ? `minmax(0, 1fr) 6px ${sizes.comparison}px` : 'minmax(0, 1fr)' }}>
          {hasFile && (!compact || !artifact || compactView === 'file') && <section className="cd-file-pane" aria-label="Open course material"><div className="cd-file-tabs" role="tablist" aria-label="Open materials">{openFiles.map(id => { const item = materials.find(material => material.id === id); return item && <div className={`cd-file-tab ${activeFile === id ? 'is-active' : ''}`} key={id}><button role="tab" aria-selected={activeFile === id} onClick={() => setActiveFile(id)}>{kindIcon(item.kind)}<span>{item.title}</span></button><button className="cd-tab-close" aria-label={`Close ${item.title}`} onClick={() => closeFile(id)}><X size={14} /></button></div>; })}</div><div className="cd-file-scroll" ref={fileScroll} onScroll={event => { if (activeFile) scrollPositions.current[activeFile] = event.currentTarget.scrollTop; }}><div className="cd-document"><div className="cd-document-meta"><span>{materialBody[activeFile!].eyebrow}</span><span>{activeMaterial?.detail}</span></div><h2>{materialBody[activeFile!].heading}</h2><p className="cd-document-intro">{materialBody[activeFile!].intro}</p><div className="cd-document-callout"><span>STUDY PROMPT</span><p>What is the main idea, and how would you explain it to someone new to biology?</p></div>{materialBody[activeFile!].sections.map(section => <section key={section.title}><h3>{section.title}</h3><p>{section.text}</p></section>)}<div className="cd-document-end">End of preview · Sample course material</div></div></div></section>}
          {showComparison && width >= 1380 && !maximized && divider('comparison', 'Resize artifact comparison')}
          {artifact && (!compact || !hasFile || compactView === 'artifact') && <section className={`cd-artifact-pane ${showComparison && width < 1380 ? 'cd-artifact-stacked' : ''}`} aria-label="Study guide artifact"><div className="cd-artifact-header"><div><span className="cd-overline">EDITABLE ARTIFACT</span><h2>Cell structure study guide</h2></div><Button size="icon" aria-label="Close study guide" onClick={() => setArtifact(false)}><X size={17} /></Button></div><label className="cd-sr-only" htmlFor="cd-artifact-editor">Edit study guide</label><textarea id="cd-artifact-editor" value={artifactText} onChange={event => setArtifactText(event.target.value)} spellCheck={false} /><div className="cd-artifact-footer"><span><Check size={14} /> Changes kept in this session</span><span>Demo artifact</span></div></section>}
        </div>}
      </main>
      {showChat && <>{divider('chat', 'Resize course chat')}<aside className="cd-chat-pane" aria-label="Course chat">{chat}</aside></>}
    </div>
    {!chatPrimary && !showChat && <Button className="cd-floating-chat" aria-label="Open course chat" onClick={() => setDrawer('chat')}><Bot size={20} /><span>Chat</span></Button>}
    {drawer && <div className="cd-drawer-backdrop" onPointerDown={event => { if (event.target === event.currentTarget) setDrawer(null); }}><aside ref={drawerElement} className={`cd-drawer cd-drawer--${drawer}`} role="dialog" aria-modal="true" aria-label={drawer === 'chat' ? 'Course chat' : 'Course explorer'}><div className="cd-drawer-bar"><span>{drawer === 'chat' ? 'Course chat' : 'Course explorer'}</span><Button size="icon" aria-label="Close panel" onClick={() => setDrawer(null)}><X size={20} /></Button></div>{drawer === 'chat' ? chat : explorer}</aside></div>}
    <span className="cd-sr-only" role="status">{status}</span>
    </div></div>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
