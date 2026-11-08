import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { Button } from '../../components/ui/button';
import { ChevronDown, ChevronRight, Folder } from '../../components/ui/solar-icons';
import { Dialog } from '../../components/ui/dialog';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/OneChatPage';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import { dueMaterials, psychologyMaterials } from './psychology-data';
import backIcon from '../../assets/projects/detail/back.svg';
import closeIcon from '../../assets/notifications/close.svg';
import bellIcon from '../../assets/onechat/1-icons-generic-bell.svg';
import artifactIcon from '../../assets/onechat/course-artifact-tab.svg';
import plusIcon from '../../assets/onechat/course-plus.svg';
import chatCtaIcon from '../../assets/onechat/course-chat-cta.svg';
import chatTabIcon from '../../assets/onechat/course-chat-tab.svg';
import soundwaveIcon from '../../assets/onechat/course-soundwave.svg';
import micIcon from '../../assets/projects/detail/mic.svg';
import documentIcon from '../../assets/courses/psy201/document.svg';
import chatsIcon from '../../assets/courses/psy201/chats.svg';
import assignmentIcon from '../../assets/courses/psy201/assignment.svg';
import chatBudgetIcon from '../../assets/courses/psy201/chat/budget.svg';
import chatModelIcon from '../../assets/courses/psy201/chat/model.svg';
import chatChevronIcon from '../../assets/courses/psy201/chat/chevron.svg';
import chatExportIcon from '../../assets/courses/psy201/chat/export.svg';
import chatNewIcon from '../../assets/onechat/2-icons-agent-new-chat.svg';
import fullScreenIcon from '../../assets/courses/psy201/full-screen.svg';
import fullScreenLightIcon from '../../assets/courses/psy201/full-screen-light.svg';
import quitFullScreenIcon from '../../assets/courses/psy201/quit-full-screen.svg';
import quitFullScreenLightIcon from '../../assets/courses/psy201/quit-full-screen-light.svg';
import closeLightIcon from '../../assets/courses/psy201/close-light.svg';
import sidebarLeftCloseIcon from '../../assets/courses/psy201/sidebar-left-close.svg';
import sidebarLeftOpenIcon from '../../assets/courses/psy201/sidebar-left-open.svg';
import './psychology-workspace.css';

type Panel = 'explorer' | 'material' | 'artifact' | 'chat';
type ContentPanel = Exclude<Panel, 'explorer'>;
type ViewportBand = 'wide' | 'compact' | 'medium' | 'small';
type Section = 'materials' | 'chats' | 'artifacts';
type ChatMessage = { id: number; role: 'student' | 'assistant'; text: string };
type Info = { title: string; message: string };
const initialWidths: Record<Panel, number> = { explorer: 352, material: 496, artifact: 500, chat: 470 };
const minimumWidths: Record<Panel, number> = { explorer: 320, material: 250, artifact: 250, chat: 290 };
const maximumWidths: Record<Panel, number> = { explorer: 440, material: 850, artifact: 850, chat: 700 };
const panelOrder: Panel[] = ['explorer', 'material', 'chat', 'artifact'];
const contentOrder: ContentPanel[] = ['material', 'chat', 'artifact'];

function getViewportBand(navCollapsed: boolean): ViewportBand {
  if (window.innerWidth >= 1920) return 'wide';
  if (window.innerWidth >= 1536) return navCollapsed ? 'wide' : 'compact';
  if (window.innerWidth >= 1200) return 'compact';
  if (window.innerWidth >= 900) return 'medium';
  return 'small';
}

function sampleReply(question: string, sourceTitle?: string) {
  const context = sourceTitle ? `Using ${sourceTitle} as context, ` : 'For this course, ';
  if (/memor|recall|retriev/i.test(question)) return `${context}retrieval practice is a useful way to check what you can recall without looking at notes. Try a short self-test, then revisit the ideas you missed. This is a sample local response.`;
  if (/attention|percept/i.test(question)) return `${context}selective attention helps you focus on relevant information while filtering competing signals. Perception also draws on expectations, which can be helpful or misleading. This is a sample local response.`;
  if (/research|experiment|method/i.test(question)) return `${context}start with a clear research question, decide what you will measure, and consider alternative explanations before interpreting a result. This is a sample local response.`;
  return `${context}compare the main claim with the course material, identify an example, and test whether you can explain it in your own words. This is a sample local response; no AI service is connected.`;
}

export function PsychologyWorkspace() {
  const navigation = useAgentNavigation();
  const notifications = useNotifications();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(0);
  const replyTimerRef = useRef<number | null>(null);
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [open, setOpen] = useState<Record<Panel, boolean>>({ explorer: true, material: false, artifact: false, chat: true });
  const [viewportBand, setViewportBand] = useState(() => getViewportBand(true));
  const [compactExplorerOpen, setCompactExplorerOpen] = useState(false);
  const [widths, setWidths] = useState(initialWidths);
  const [expanded, setExpanded] = useState<Panel | null>(null);
  const [activeMobilePanel, setActiveMobilePanel] = useState<Panel>('chat');
  const [activeContentPanel, setActiveContentPanel] = useState<ContentPanel>('chat');
  const [section, setSection] = useState<Section>('materials');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ coursework: true, resources: true });
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('Attention filters information so we can focus on a task. Compare that process with how expectations influence perception.');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyPending, setReplyPending] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [status, setStatus] = useState('');
  const material = psychologyMaterials.find(item => item.id === selectedMaterial);
  const openMaterial = (id: string) => {
    setOpenFiles(files => files.includes(id) ? files : [...files, id]);
    setSelectedMaterial(id);
    showPanel('material');
  };
  const closeMaterialTab = (id: string) => {
    const remaining = openFiles.filter(fileId => fileId !== id);
    setOpenFiles(remaining);
    if (id === selectedMaterial) setSelectedMaterial(remaining[remaining.length - 1] ?? null);
    if (!remaining.length) closePanel('material');
  };
  const toggleFolder = (folder: string) => setExpandedFolders(value => ({ ...value, [folder]: !value[folder] }));
  const chatVisible = open.chat || (!open.material && !open.artifact);
  const availableContent = contentOrder.filter(panel => panel === 'chat' ? chatVisible : open[panel]);
  const mediumPanel = availableContent.includes(activeContentPanel) ? activeContentPanel : availableContent[0];
  const layoutPanels: Panel[] = expanded ? [expanded]
    : viewportBand === 'medium' ? ['explorer', mediumPanel]
    : panelOrder.filter(panel => panel === 'explorer' || (panel === 'chat' ? chatVisible : open[panel]));
  const compactExplorerRail = viewportBand === 'compact' && (!open.explorer ||
    widths.explorer + layoutPanels.slice(1).reduce((total, panel) => total + minimumWidths[panel], 0) >
      window.innerWidth - (navCollapsed ? 80 : 280) - (window.innerWidth < 1280 ? 48 : 64) - (layoutPanels.length - 1) * 8);
  const gridColumns = viewportBand === 'medium' && !expanded ? `${widths.explorer}px minmax(0, 1fr)`
    : viewportBand === 'compact' && !expanded ? [compactExplorerRail ? '56px' : `${widths.explorer}px`, ...layoutPanels.slice(1).map(panel => `minmax(${minimumWidths[panel]}px, ${widths[panel]}fr)`)].join(' ')
    : !open.material && !open.artifact && chatVisible && !expanded
    ? `${open.explorer ? `${widths.explorer}px` : '56px'} minmax(0, 1fr)`
    : !open.explorer && open.material && !open.artifact && chatVisible && !expanded
    ? '56px minmax(0, 1fr) minmax(0, 470px)'
    : layoutPanels.map(panel => {
      if (panel === 'explorer' && !open.explorer) return '56px';
      if (panel === 'explorer') return `${widths.explorer}px`;
      return `minmax(0, ${widths[panel]}fr)`;
    }).join(' ');

  useEffect(() => { document.title = 'PSY201 · Cognitive Psychology · Aqua University'; return () => { document.title = 'Aqua University'; }; }, []);
  useEffect(() => {
    const updateViewport = () => setViewportBand(getViewportBand(navCollapsed));
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [navCollapsed]);
  useEffect(() => { setCompactExplorerOpen(false); }, [viewportBand]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ block: 'end' }); }, [messages]);
  useEffect(() => () => { if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current); }, []);

  const showPanel = (panel: Panel) => {
    if (panel === 'explorer' && compactExplorerRail) {
      setCompactExplorerOpen(true);
      return;
    }
    setOpen(value => ({ ...value, [panel]: true }));
    setExpanded(null);
    setActiveMobilePanel(panel);
    if (panel !== 'explorer') setActiveContentPanel(panel);
    if (viewportBand === 'compact') setCompactExplorerOpen(false);
  };
  const closePanel = (panel: Panel) => {
    if (panel === 'explorer' && compactExplorerRail) {
      setCompactExplorerOpen(false);
      return;
    }
    if (panel === 'chat' && !open.material && !open.artifact) return;
    const next = { ...open, [panel]: false };
    const onlyChat = !next.material && !next.artifact;
    if (onlyChat) next.chat = true;
    setOpen(next);
    setExpanded(null);
    const fallback = next.chat && panel !== 'chat' ? 'chat' : panelOrder.find(item => item !== panel && next[item]);
    if (fallback) setActiveMobilePanel(fallback);
    const contentFallback = contentOrder.find(item => item !== panel && (item === 'chat' ? next.chat : next[item]));
    if (contentFallback) setActiveContentPanel(contentFallback);
    setStatus(`${panel === 'explorer' ? 'Course explorer' : panel} panel closed.`);
  };
  const toggleExpanded = (panel: Panel) => {
    setExpanded(value => value === panel ? null : panel);
    setActiveMobilePanel(panel);
    if (panel !== 'explorer') setActiveContentPanel(panel);
  };

  const startResize = (left: Panel, right: Panel, event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const start = event.clientX;
    const leftStart = widths[left];
    const rightStart = widths[right];
    const move = (next: globalThis.PointerEvent) => {
      const delta = next.clientX - start;
      const lower = Math.max(minimumWidths[left] - leftStart, rightStart - maximumWidths[right]);
      const upper = Math.min(maximumWidths[left] - leftStart, rightStart - minimumWidths[right]);
      const adjusted = Math.max(lower, Math.min(upper, delta));
      setWidths(value => ({ ...value, [left]: leftStart + adjusted, [right]: rightStart - adjusted }));
    };
    const end = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end); document.body.style.cursor = ''; };
    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };
  const resizeWithKeyboard = (left: Panel, right: Panel, event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const pair = widths[left] + widths[right];
    const min = Math.max(minimumWidths[left], pair - maximumWidths[right]);
    const max = Math.min(maximumWidths[left], pair - minimumWidths[right]);
    const target = event.key === 'Home' ? min : event.key === 'End' ? max : widths[left] + (event.key === 'ArrowLeft' ? -16 : 16);
    const next = Math.max(min, Math.min(max, target));
    setWidths(value => ({ ...value, [left]: next, [right]: pair - next }));
  };
  const divider = (left: Panel, right: Panel) => <div key={`${left}-${right}`} className="psy-divider" role="separator" tabIndex={0} aria-orientation="vertical" aria-label={`Resize ${left} and ${right} panels`} aria-valuenow={Math.round(widths[left])} aria-valuemin={minimumWidths[left]} aria-valuemax={maximumWidths[left]} onPointerDown={event => startResize(left, right, event)} onKeyDown={event => resizeWithKeyboard(left, right, event)}><span aria-hidden="true" /></div>;

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question || replyPending) return;
    setMessages(items => [...items, { id: ++nextMessageId.current, role: 'student', text: question }]);
    setDraft('');
    setReplyPending(true);
    replyTimerRef.current = window.setTimeout(() => {
      setMessages(items => [...items, { id: ++nextMessageId.current, role: 'assistant', text: sampleReply(question, material?.title) }]);
      setReplyPending(false);
      replyTimerRef.current = null;
    }, 450);
  };
  const createNoteFromReply = (reply: string) => {
    setNoteText(reply);
    setNoteOpen(true);
    showPanel('artifact');
    setStatus('Study note opened in the artifact viewer.');
  };
  const newCourseChat = () => {
    if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = null;
    setReplyPending(false);
    setMessages([]);
    setDraft('');
    setStatus('Started a new local course chat.');
  };
  const exportChat = () => {
    if (!messages.length) {
      setInfo({ title: 'Export chat', message: 'There are no messages to export yet.' });
      return;
    }
    const transcript = messages.map(item => `${item.role === 'student' ? 'You' : 'Course assistant'}: ${item.text}`).join('\n\n');
    const url = URL.createObjectURL(new Blob([`PSY201 · Cognitive Psychology\n\n${transcript}\n`], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'psy201-course-chat.txt';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    setStatus('Course chat exported.');
  };
  const sidebarProps = {
    onNewChat: () => { window.location.hash = '/onechat'; },
    onSelect: (conversation: Conversation) => { navigation.setPendingConversation(conversation); window.location.hash = '/onechat'; },
    onInfo: setInfo,
    onSelectAgent: (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; },
    onNotifications: notifications.open,
    unreadCount: notifications.unreadCount,
    notificationsOpen: notifications.isOpen,
  };

  const panels: Record<Panel, React.ReactNode> = {
    explorer: (
      <aside className="psy-panel psy-explorer" aria-label="Course explorer">
        <div className="psy-explorer-header">
          <div className="psy-explorer-tabs" role="group" aria-label="Course sections">
            <button aria-label="Materials" aria-pressed={section === 'materials'} onClick={() => setSection('materials')}><img src={documentIcon} alt="" width="20" height="20" />{section === 'materials' && <span>Material</span>}</button>
            <button aria-label="Chats" aria-pressed={section === 'chats'} onClick={() => setSection('chats')}><img src={chatsIcon} alt="" width="20" height="20" />{section === 'chats' && <span>Chats</span>}</button>
            <button aria-label="Artifacts" aria-pressed={section === 'artifacts'} onClick={() => setSection('artifacts')}><img src={artifactIcon} alt="" width="20" height="20" />{section === 'artifacts' && <span>Artifacts</span>}</button>
          </div>
          <button className="psy-icon" aria-label="Collapse course explorer" onClick={() => closePanel('explorer')}><img src={sidebarLeftCloseIcon} alt="" width="20" height="20" /></button>
        </div>
        <div className="psy-explorer-content">
          {section === 'materials' ? <>
            <h2>Course files</h2>
            <button className="psy-folder" aria-expanded={expandedFolders.coursework} onClick={() => toggleFolder('coursework')}>{expandedFolders.coursework ? <ChevronDown size={16} /> : <ChevronRight size={16} />}<Folder size={18} />Coursework</button>
            {expandedFolders.coursework && <div className="psy-folder-children">{dueMaterials.map(item => <button key={item.id} className="psy-file" aria-current={selectedMaterial === item.id && open.material ? 'page' : undefined} onClick={() => openMaterial(item.id)}><img src={assignmentIcon} alt="" width="20" height="20" /><span>{item.title}<small>{item.due}</small></span></button>)}</div>}
            <button className="psy-folder" aria-expanded={expandedFolders.resources} onClick={() => toggleFolder('resources')}>{expandedFolders.resources ? <ChevronDown size={16} /> : <ChevronRight size={16} />}<Folder size={18} />Learning resources</button>
            {expandedFolders.resources && <div className="psy-folder-children">{psychologyMaterials.map(item => <button key={item.id} className="psy-file" aria-current={selectedMaterial === item.id && open.material ? 'page' : undefined} onClick={() => openMaterial(item.id)}><img src={documentIcon} alt="" width="20" height="20" /><span>{item.title}<small>{item.kind}</small></span></button>)}</div>}
          </> : section === 'chats' ? <>
            <h2>Course chats</h2>
            <button className="psy-material-link" onClick={() => showPanel('chat')}><img src={chatsIcon} alt="" width="20" height="20" /><span>Current conversation<small>{messages.length ? `${Math.ceil(messages.length / 2)} exchanges` : 'No messages yet'}</small></span></button>
            <Button variant="outline" onClick={() => { newCourseChat(); showPanel('chat'); }}>New chat</Button>
          </> : <>
            <h2>Artifacts</h2>
            {noteOpen ? <button className="psy-material-link" onClick={() => showPanel('artifact')}><img src={artifactIcon} alt="" width="20" height="20" /><span>My cognitive psychology notes<small>Saved in this browser session</small></span></button> : <p>No artifacts yet.</p>}
            <Button variant="outline" onClick={() => { setNoteOpen(true); showPanel('artifact'); }}>Create study note</Button>
          </>}
        </div>
      </aside>
    ),
    material: (
      <section className="psy-panel psy-content-panel" aria-label="Course material">
        <div className="psy-panel-heading"><span>{material?.title || 'Material'}</span><div className="psy-panel-actions">
          <button className="psy-icon" aria-label={expanded === 'material' ? 'Restore material panel' : 'Expand material panel'} onClick={() => toggleExpanded('material')}><img src={expanded === 'material' ? quitFullScreenIcon : fullScreenIcon} alt="" width="20" height="20" /></button>
          <button className="psy-icon" aria-label="Close material panel" onClick={() => closePanel('material')}><img src={closeIcon} alt="" width="20" height="20" /></button>
        </div></div>
        <div className="psy-file-tabs" role="tablist" aria-label="Open course files">{openFiles.map((id, index) => { const file = psychologyMaterials.find(item => item.id === id); return <div key={id} className="psy-file-tab" role="tab" aria-selected={id === selectedMaterial} tabIndex={id === selectedMaterial ? 0 : -1} onClick={() => setSelectedMaterial(id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedMaterial(id); } else if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? openFiles.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + openFiles.length) % openFiles.length; setSelectedMaterial(openFiles[nextIndex]); (event.currentTarget.parentElement?.children[nextIndex] as HTMLElement | undefined)?.focus(); } }}><img src={documentIcon} alt="" width="16" height="16" /><span>{file?.title}</span><button aria-label={`Close ${file?.title}`} onClick={event => { event.stopPropagation(); closeMaterialTab(id); }}><img src={closeIcon} alt="" width="16" height="16" /></button></div>; })}</div>
        {material && <div className="psy-document"><span>{material.kind} · PSY201</span><h2>{material.title}</h2><p>{material.summary}</p>{material.sections.map(item => <section key={item.heading}><h3>{item.heading}</h3><p>{item.body}</p></section>)}<small>Sample course material · Local prototype</small></div>}
      </section>
    ),
    artifact: (
      <section className="psy-panel psy-content-panel psy-artifact" aria-label="Study artifact">
        <div className="psy-panel-heading"><span>{noteOpen ? 'My cognitive psychology notes' : 'Artifact'}</span><div className="psy-panel-actions">
          <button className="psy-icon" aria-label={expanded === 'artifact' ? 'Restore artifact panel' : 'Expand artifact panel'} onClick={() => toggleExpanded('artifact')}><img src={expanded === 'artifact' ? quitFullScreenLightIcon : fullScreenLightIcon} alt="" width="20" height="20" /></button>
          <button className="psy-icon" aria-label="Close artifact panel" onClick={() => closePanel('artifact')}><img src={closeLightIcon} alt="" width="20" height="20" /></button>
        </div></div>
        {noteOpen && <div className="psy-note"><label htmlFor="psy-note-text">Study note</label><textarea id="psy-note-text" value={noteText} onChange={event => setNoteText(event.target.value)} /><p>Changes are kept for this session. This is sample content.</p></div>}
      </section>
    ),
    chat: (
      <section className="psy-chat" aria-label="Course chat">
        <div className="psy-chat-heading">
          <div className="psy-chat-heading-start">
            <Button variant="outline" className="psy-chat-model" aria-label="Chat model: GPT 5.1" aria-haspopup="dialog" aria-expanded={modelOpen} onClick={() => setModelOpen(true)}><img src={chatModelIcon} alt="" width="18" height="18" /><span>GPT 5.1</span><img src={chatChevronIcon} alt="" width="18" height="18" /></Button>
            <button className="psy-icon" aria-label="New course chat" onClick={newCourseChat}><img src={chatNewIcon} alt="" width="20" height="20" /></button>
            <button className="psy-icon" aria-label="Export course chat" onClick={exportChat}><img src={chatExportIcon} alt="" width="20" height="20" /></button>
          </div>
          <div className="psy-chat-heading-end">
            <button className="psy-icon" aria-label={expanded === 'chat' ? 'Restore chat panel' : 'Expand chat panel'} onClick={() => toggleExpanded('chat')}><img src={expanded === 'chat' ? quitFullScreenIcon : fullScreenIcon} alt="" width="20" height="20" /></button>
            {(open.material || open.artifact) && <button className="psy-icon" aria-label="Close chat panel" onClick={() => closePanel('chat')}><img src={closeIcon} alt="" width="20" height="20" /></button>}
            <div className="psy-chat-budget" role="meter" aria-label="Budget indicator" aria-valuemin={0} aria-valuemax={100} aria-valuenow={68} title="Budget indicator: 68% (demo)"><img src={chatBudgetIcon} alt="" width="24" height="24" /></div>
          </div>
        </div>
        <div className="psy-chat-body">
          {messages.length ? <div className="psy-chat-messages" aria-live="polite">{messages.map(item => <article key={item.id} className={item.role === 'student' ? 'psy-message psy-message-student' : 'psy-message'}><strong>{item.role === 'student' ? 'You' : 'Course assistant · Local demo'}</strong><p>{item.text}</p>{item.role === 'assistant' && <button className="psy-reply-artifact" onClick={() => createNoteFromReply(item.text)}><img src={artifactIcon} alt="" width="18" height="18" />Open as study note</button>}</article>)}{replyPending && <p role="status">Preparing a sample response…</p>}<div ref={chatEndRef} /></div> : <div className="psy-chat-empty"><p>Ask anything about this course, or select materials to focus the conversation</p></div>}
          <form className="psy-composer" onSubmit={sendMessage}>
          <button type="button" className="psy-icon" aria-label="Create study note" onClick={() => { setNoteOpen(true); showPanel('artifact'); }}><img src={plusIcon} alt="" width="24" height="24" /></button>
          <label className="psy-sr-only" htmlFor="psy-chat-input">Ask about this course</label>
          <textarea id="psy-chat-input" rows={1} value={draft} placeholder={viewportBand === 'compact' ? 'Ask…' : viewportBand === 'small' ? 'Ask a question' : 'Let’s discover what only you could ask'} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
          <button type="button" className="psy-icon psy-mic" aria-label="Microphone demo information" onClick={() => setInfo({ title: 'Voice input', message: 'Voice input is not connected in this local prototype. Type your question to try the course chat.' })}><img src={micIcon} alt="" width="18" height="18" /></button>
          {draft.trim() ? <button type="submit" className="psy-send" aria-label="Send message" disabled={replyPending}>Send</button> : <button type="button" className="psy-voice" aria-label="Voice conversation demo information" onClick={() => setInfo({ title: 'Voice conversation', message: 'Voice conversation is not connected in this local prototype. Type your question to try the course chat.' })}><img src={chatCtaIcon} alt="" width="36" height="36" /><img className="psy-voice-wave" src={soundwaveIcon} alt="" width="24" height="24" /></button>}
          </form>
        </div>
      </section>
    ),
  };

  const collapsedExplorer = (
    <aside className="psy-panel psy-explorer-rail" aria-label="Collapsed course explorer">
      <div className="psy-panel-heading">
        <button className="psy-icon" aria-label="Expand course explorer" onClick={() => showPanel('explorer')}><img src={sidebarLeftOpenIcon} alt="" width="20" height="20" /></button>
      </div>
    </aside>
  );
  const panelDivider = (panel: Panel, index: number) => {
    if (index === 0) return null;
    const previous = layoutPanels[index - 1];
    if (viewportBand === 'compact' && previous === 'explorer' && compactExplorerRail) return <div className="psy-divider psy-divider-static" aria-hidden="true"><span /></div>;
    if (previous === 'explorer' && !open.explorer) {
      if (layoutPanels.length === 2 && panel === 'chat') return null;
      return <div className="psy-divider psy-divider-static" aria-hidden="true"><span /></div>;
    }
    return divider(previous, panel);
  };

  return <div className={`onechat psy-shell ${navCollapsed ? 'oc-is-collapsed' : ''}`}>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={navCollapsed} onClose={() => setNavCollapsed(value => !value)} /></aside>
    <div className="oc-main psy-main">
      <header className="psy-header">
        <Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>Menu</Button>
        <button className="psy-back" aria-label="Back to courses" onClick={() => { window.location.hash = '/onechat/courses'; }}><img src={backIcon} alt="" width="24" height="24" /></button>
        <h1>PSY201 · Cognitive Psychology</h1>
        {!chatVisible && <Button variant="outline" className="psy-header-chat" onClick={() => showPanel('chat')}><img src={chatTabIcon} alt="" width="20" height="20" />Chat</Button>}
        <Button className="psy-mobile-bell" size="icon" aria-label={`Notifications, ${notifications.unreadCount} unread`} onClick={notifications.open}><img src={bellIcon} alt="" width="20" height="20" /></Button>
      </header>
      <div className="psy-mobile-tabs" role="group" aria-label="Workspace panel">{(viewportBand === 'medium' ? availableContent : panelOrder.filter(panel => panel === 'explorer' || open[panel])).map(panel => <button key={panel} aria-pressed={viewportBand === 'medium' ? mediumPanel === panel : activeMobilePanel === panel} onClick={() => showPanel(panel)}>{panel === 'explorer' ? 'Course' : panel === 'material' ? 'Material' : panel === 'artifact' ? 'Artifact' : 'Chat'}</button>)}</div>
      <main className={`psy-layout psy-layout-${viewportBand} ${expanded ? 'psy-layout-expanded' : ''}`} style={{ '--psy-grid': gridColumns } as CSSProperties} aria-label="PSY201 workspace">{layoutPanels.map((panel, index) => <div className={`psy-slot ${activeMobilePanel === panel ? 'psy-slot-active' : ''}`} key={panel}>{panelDivider(panel, index)}{panel === 'explorer' ? compactExplorerRail && !expanded ? <div className="psy-compact-explorer">{collapsedExplorer}{compactExplorerOpen && panels.explorer}</div> : viewportBand === 'medium' || viewportBand === 'small' ? panels.explorer : !open.explorer ? collapsedExplorer : panels.explorer : panels[panel]}</div>)}</main>
      <div className="psy-status psy-sr-only" role="status">{status}</div>
    </div>
    {mobileNavOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileNavOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {modelOpen && <Dialog title="Chat model" onClose={() => setModelOpen(false)}><Button variant="outline" onClick={() => setModelOpen(false)}><img src={chatModelIcon} alt="" width="18" height="18" /> GPT 5.1 · Selected</Button><p>Model selection is simulated in this local prototype.</p></Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
