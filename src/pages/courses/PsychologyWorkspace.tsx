import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/OneChatPage';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import { psychologyMaterials } from './psychology-data';
import backIcon from '../../assets/projects/detail/back.svg';
import closeIcon from '../../assets/notifications/close.svg';
import bellIcon from '../../assets/onechat/1-icons-generic-bell.svg';
import artifactIcon from '../../assets/onechat/course-artifact-tab.svg';
import plusIcon from '../../assets/onechat/course-plus.svg';
import chatCtaIcon from '../../assets/onechat/course-chat-cta.svg';
import soundwaveIcon from '../../assets/onechat/course-soundwave.svg';
import micIcon from '../../assets/projects/detail/mic.svg';
import documentIcon from '../../assets/courses/psy201/document.svg';
import chatsIcon from '../../assets/courses/psy201/chats.svg';
import fullScreenIcon from '../../assets/courses/psy201/full-screen.svg';
import fullScreenLightIcon from '../../assets/courses/psy201/full-screen-light.svg';
import closeLightIcon from '../../assets/courses/psy201/close-light.svg';
import sidebarLeftCloseIcon from '../../assets/courses/psy201/sidebar-left-close.svg';
import sidebarRightCloseIcon from '../../assets/courses/psy201/sidebar-right-close.svg';
import './psychology-workspace.css';

type Panel = 'explorer' | 'material' | 'artifact' | 'chat';
type Section = 'materials' | 'chats' | 'artifacts';
type ChatMessage = { id: number; role: 'student' | 'assistant'; text: string };
type Info = { title: string; message: string };
const initialWidths: Record<Panel, number> = { explorer: 280, material: 496, artifact: 500, chat: 470 };
const minimumWidths: Record<Panel, number> = { explorer: 210, material: 250, artifact: 250, chat: 290 };
const maximumWidths: Record<Panel, number> = { explorer: 440, material: 850, artifact: 850, chat: 700 };
const panelOrder: Panel[] = ['explorer', 'material', 'artifact', 'chat'];

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
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [open, setOpen] = useState<Record<Panel, boolean>>({ explorer: true, material: true, artifact: true, chat: true });
  const [widths, setWidths] = useState(initialWidths);
  const [expanded, setExpanded] = useState<Panel | null>(null);
  const [activeMobilePanel, setActiveMobilePanel] = useState<Panel>('chat');
  const [section, setSection] = useState<Section>('materials');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('Attention filters information so we can focus on a task. Compare that process with how expectations influence perception.');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyPending, setReplyPending] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);
  const [status, setStatus] = useState('');
  const material = psychologyMaterials.find(item => item.id === selectedMaterial);
  const visiblePanels = panelOrder.filter(panel => open[panel] && (!expanded || expanded === panel));

  useEffect(() => { document.title = 'PSY201 · Cognitive Psychology · Aqua University'; return () => { document.title = 'Aqua University'; }; }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ block: 'end' }); }, [messages]);

  const showPanel = (panel: Panel) => { setOpen(value => ({ ...value, [panel]: true })); setExpanded(null); setActiveMobilePanel(panel); };
  const closePanel = (panel: Panel) => { setOpen(value => ({ ...value, [panel]: false })); setExpanded(null); const fallback = panelOrder.find(item => item !== panel && open[item]); if (fallback) setActiveMobilePanel(fallback); setStatus(`${panel === 'explorer' ? 'Course explorer' : panel} panel closed.`); };
  const toggleExpanded = (panel: Panel) => { setExpanded(value => value === panel ? null : panel); setActiveMobilePanel(panel); };

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
    window.setTimeout(() => {
      setMessages(items => [...items, { id: ++nextMessageId.current, role: 'assistant', text: sampleReply(question, material?.title) }]);
      setReplyPending(false);
    }, 450);
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
        <div className="psy-panel-heading">
          <strong>Course</strong>
          <button className="psy-icon" aria-label="Collapse course explorer" onClick={() => closePanel('explorer')}><img src={sidebarLeftCloseIcon} alt="" width="20" height="20" /></button>
        </div>
        <div className="psy-explorer-tabs" role="group" aria-label="Course sections">
          <button aria-pressed={section === 'materials'} onClick={() => setSection('materials')}><img src={documentIcon} alt="" width="20" height="20" /> Materials</button>
          <button aria-pressed={section === 'chats'} onClick={() => setSection('chats')}><img src={chatsIcon} alt="" width="20" height="20" /> Chats</button>
          <button aria-pressed={section === 'artifacts'} onClick={() => setSection('artifacts')}><img src={artifactIcon} alt="" width="20" height="20" /> Artifacts</button>
        </div>
        <div className="psy-explorer-content">
          {section === 'materials' ? <>
            <h2>Course materials</h2><p>Sample content for this course</p>
            {psychologyMaterials.map(item => <button key={item.id} className="psy-material-link" aria-current={selectedMaterial === item.id ? 'true' : undefined} onClick={() => { setSelectedMaterial(item.id); showPanel('material'); }}><img src={documentIcon} alt="" width="20" height="20" /><span>{item.title}<small>{item.kind}</small></span></button>)}
          </> : section === 'chats' ? <>
            <h2>Course chats</h2>
            <button className="psy-material-link" onClick={() => showPanel('chat')}><img src={chatsIcon} alt="" width="20" height="20" /><span>Current conversation<small>{messages.length ? `${Math.ceil(messages.length / 2)} exchanges` : 'No messages yet'}</small></span></button>
            <Button variant="outline" onClick={() => { setMessages([]); setStatus('New local course chat started.'); showPanel('chat'); }}>New chat</Button>
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
          <button className="psy-icon" aria-label={expanded === 'material' ? 'Restore material panel' : 'Expand material panel'} onClick={() => toggleExpanded('material')}><img src={fullScreenIcon} alt="" width="20" height="20" /></button>
          <button className="psy-icon" aria-label="Close material panel" onClick={() => closePanel('material')}><img src={closeIcon} alt="" width="20" height="20" /></button>
        </div></div>
        {material && <div className="psy-document"><span>{material.kind} · PSY201</span><h2>{material.title}</h2><p>{material.summary}</p>{material.sections.map(item => <section key={item.heading}><h3>{item.heading}</h3><p>{item.body}</p></section>)}<small>Sample course material · Local prototype</small></div>}
      </section>
    ),
    artifact: (
      <section className="psy-panel psy-content-panel psy-artifact" aria-label="Study artifact">
        <div className="psy-panel-heading"><span>{noteOpen ? 'My cognitive psychology notes' : 'Artifact'}</span><div className="psy-panel-actions">
          <button className="psy-icon" aria-label={expanded === 'artifact' ? 'Restore artifact panel' : 'Expand artifact panel'} onClick={() => toggleExpanded('artifact')}><img src={fullScreenLightIcon} alt="" width="20" height="20" /></button>
          <button className="psy-icon" aria-label="Close artifact panel" onClick={() => closePanel('artifact')}><img src={closeLightIcon} alt="" width="20" height="20" /></button>
        </div></div>
        {noteOpen && <div className="psy-note"><label htmlFor="psy-note-text">Study note</label><textarea id="psy-note-text" value={noteText} onChange={event => setNoteText(event.target.value)} /><p>Changes are kept for this session. This is sample content.</p></div>}
      </section>
    ),
    chat: (
      <section className="psy-chat" aria-label="Course chat">
        <div className="psy-chat-heading"><span className="psy-sr-only">Course chat</span>
          <button className="psy-icon" aria-label={expanded === 'chat' ? 'Restore chat panel' : 'Expand chat panel'} onClick={() => toggleExpanded('chat')}><img src={fullScreenIcon} alt="" width="20" height="20" /></button>
          <button className="psy-icon" aria-label="Hide chat panel" onClick={() => closePanel('chat')}><img src={sidebarRightCloseIcon} alt="" width="20" height="20" /></button>
        </div>
        {messages.length ? <div className="psy-chat-messages" aria-live="polite">{messages.map(item => <article key={item.id} className={item.role === 'student' ? 'psy-message psy-message-student' : 'psy-message'}><strong>{item.role === 'student' ? 'You' : 'Course assistant · Local demo'}</strong><p>{item.text}</p></article>)}{replyPending && <p role="status">Preparing a sample response…</p>}<div ref={chatEndRef} /></div> : <div className="psy-chat-empty"><p>Ask anything about this course, or select materials to focus the conversation</p></div>}
        <form className="psy-composer" onSubmit={sendMessage}>
          <button type="button" className="psy-icon" aria-label="Create study note" onClick={() => { setNoteOpen(true); showPanel('artifact'); }}><img src={plusIcon} alt="" width="24" height="24" /></button>
          <label className="psy-sr-only" htmlFor="psy-chat-input">Ask about this course</label>
          <textarea id="psy-chat-input" rows={1} value={draft} placeholder="Let’s discover what only you could ask" onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
          <button type="button" className="psy-icon psy-mic" aria-label="Microphone demo information" onClick={() => setInfo({ title: 'Voice input', message: 'Voice input is not connected in this local prototype. Type your question to try the course chat.' })}><img src={micIcon} alt="" width="18" height="18" /></button>
          {draft.trim() ? <button type="submit" className="psy-send" aria-label="Send message" disabled={replyPending}>Send</button> : <button type="button" className="psy-voice" aria-label="Voice conversation demo information" onClick={() => setInfo({ title: 'Voice conversation', message: 'Voice conversation is not connected in this local prototype. Type your question to try the course chat.' })}><img src={chatCtaIcon} alt="" width="36" height="36" /><img className="psy-voice-wave" src={soundwaveIcon} alt="" width="24" height="24" /></button>}
        </form>
        <p className="psy-chat-disclosure">Local demo · Sample responses, no AI service</p>
      </section>
    ),
  };

  return <div className={`onechat psy-shell ${navCollapsed ? 'oc-is-collapsed' : ''}`}>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={navCollapsed} onClose={() => setNavCollapsed(value => !value)} /></aside>
    <div className="oc-main psy-main">
      <header className="psy-header">
        <Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>Menu</Button>
        <button className="psy-back" aria-label="Back to courses" onClick={() => { window.location.hash = '/onechat/courses'; }}><img src={backIcon} alt="" width="24" height="24" /></button>
        <h1>PSY201 · Cognitive Psychology</h1>
        <Button className="psy-mobile-bell" size="icon" aria-label={`Notifications, ${notifications.unreadCount} unread`} onClick={notifications.open}><img src={bellIcon} alt="" width="20" height="20" /></Button>
      </header>
      <div className="psy-reopen" role="toolbar" aria-label="Workspace panels">{panelOrder.filter(panel => !open[panel]).map(panel => <button key={panel} onClick={() => showPanel(panel)}>Open {panel === 'explorer' ? 'course explorer' : panel}</button>)}</div>
      <div className="psy-mobile-tabs" role="group" aria-label="Workspace panel">{panelOrder.map(panel => <button key={panel} aria-pressed={activeMobilePanel === panel} onClick={() => showPanel(panel)}>{panel === 'explorer' ? 'Course' : panel === 'material' ? 'Material' : panel === 'artifact' ? 'Artifact' : 'Chat'}</button>)}</div>
      <main className={`psy-layout ${expanded ? 'psy-layout-expanded' : ''}`} style={{ '--psy-grid': visiblePanels.map(panel => `minmax(0, ${widths[panel]}fr)`).join(' ') } as CSSProperties} aria-label="PSY201 workspace">{visiblePanels.map((panel, index) => <div className={`psy-slot ${activeMobilePanel === panel ? 'psy-slot-active' : ''}`} key={panel}>{index > 0 && divider(visiblePanels[index - 1], panel)}{panels[panel]}</div>)}</main>
      <div className="psy-status psy-sr-only" role="status">{status}</div>
    </div>
    {mobileNavOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileNavOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
