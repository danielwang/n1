import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type PointerEvent } from 'react';
import { Button } from '../../components/ui/button';
import { ToggleButtonGroup } from '../../components/ui/toggle-button-group';
import { Dialog } from '../../components/ui/dialog';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from '../onechat/OneChatPage';
import { useAgentNavigation } from '../onechat/AgentNavigationState';
import type { ChatAgent } from '../onechat/agent-data';
import type { Conversation } from '../onechat/data';
import { siblingCourses, siblingSampleReply, type SiblingCourseId } from './sibling-course-data';
import backIcon from '../../assets/projects/detail/back.svg';
import closeIcon from '../../assets/notifications/close.svg';
import bellIcon from '../../assets/onechat/1-icons-generic-bell.svg';
import artifactIcon from '../../assets/onechat/course-artifact-tab.svg';
import plusIcon from '../../assets/onechat/course-plus.svg';
import chatCtaIcon from '../../assets/onechat/course-chat-cta.svg';
import chatTabIcon from '../../assets/onechat/course-chat-tab.svg';
import soundwaveIcon from '../../assets/onechat/course-soundwave.svg';
import micIcon from '../../assets/projects/detail/mic.svg';
import sourceFileIcon from '../../assets/courses/psy201/figma/source-file.svg';
import sourceFolderIcon from '../../assets/courses/psy201/figma/source-folder.svg';
import sourceChevronIcon from '../../assets/courses/psy201/figma/source-chevron.svg';
import sourceKnowledgeIcon from '../../assets/courses/psy201/figma/source-knowledge.svg';
import sourceNotesIcon from '../../assets/courses/psy201/figma/source-notes.svg';
import sourceChatsIcon from '../../assets/courses/psy201/figma/source-chats.svg';
import notebookArtifactsIcon from '../../assets/courses/psy201/figma/notebook-artifacts.svg';
import notebookNotesIcon from '../../assets/courses/psy201/figma/notebook-notes.svg';
import notebookHistoryIcon from '../../assets/courses/psy201/figma/notebook-history.svg';
import tabFileActiveIcon from '../../assets/courses/psy201/figma/tab-file-active.svg';
import tabFileInactiveIcon from '../../assets/courses/psy201/figma/tab-file-inactive.svg';
import tabCloseIcon from '../../assets/courses/psy201/figma/tab-close.svg';
import cardResearchBase from '../../assets/courses/psy201/figma/card-research-base.svg';
import cardResearchMark from '../../assets/courses/psy201/figma/card-research-mark.svg';
import cardCodeIcon from '../../assets/courses/psy201/figma/card-code.svg';
import cardMdBase from '../../assets/courses/psy201/figma/card-md-base.svg';
import cardMdMark from '../../assets/courses/psy201/figma/card-md-mark.svg';
import cardSlidesBase from '../../assets/courses/psy201/figma/card-slides-base.svg';
import cardSlidesMark from '../../assets/courses/psy201/figma/card-slides-mark.svg';
import cardExcelIcon from '../../assets/courses/psy201/figma/card-excel.svg';
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
import sidebarRightCloseIcon from '../../assets/courses/psy201/sidebar-right-close.svg';
import sidebarRightOpenIcon from '../../assets/courses/psy201/figma/sidebar-right-open.svg';
import chatEmptyArt from '../../assets/courses/psy201/figma/chat-empty.svg';
import './psychology-workspace.css';
import './psychology-figma.css';

type Panel = 'explorer' | 'material' | 'artifact' | 'chat';
type ContentPanel = Exclude<Panel, 'explorer'>;
type ViewportBand = 'wide' | 'compact' | 'medium' | 'small';
type ChatMessage = { id: number; role: 'student' | 'assistant'; text: string };
type Info = { title: string; message: string };
function NotebookFileIcon({ index }: { index: number }) {
  if (index === 0) return <span className="psy-notebook-file-icon" aria-hidden="true"><img className="psy-icon-research-base" src={cardResearchBase} alt="" /><img className="psy-icon-research-mark" src={cardResearchMark} alt="" /></span>;
  if (index === 1) return <span className="psy-notebook-file-icon" aria-hidden="true"><img src={cardCodeIcon} alt="" /></span>;
  if (index === 2) return <span className="psy-notebook-file-icon" aria-hidden="true"><img src={cardMdBase} alt="" /><img className="psy-icon-md-mark" src={cardMdMark} alt="" /></span>;
  if (index === 3) return <span className="psy-notebook-file-icon" aria-hidden="true"><img src={cardSlidesBase} alt="" /><img className="psy-icon-slides-mark" src={cardSlidesMark} alt="" /></span>;
  return <span className="psy-notebook-file-icon" aria-hidden="true"><img src={cardExcelIcon} alt="" /></span>;
}
const initialWidths: Record<Panel, number> = { explorer: 278, material: 630, artifact: 386, chat: 470 };
const minimumWidths: Record<Panel, number> = { explorer: 220, material: 280, artifact: 260, chat: 300 };
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

export function SiblingCourseWorkspace({ courseId }: { courseId: SiblingCourseId }) {
  const course = siblingCourses[courseId];
  const courseTitle = course.title;
  const courseMaterials = course.materials;
  const dueMaterials = course.coursework;
  const notebookItems = course.notebookItems;
  const navigation = useAgentNavigation();
  const notifications = useNotifications();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const nextMessageId = useRef(0);
  const replyTimerRef = useRef<number | null>(null);
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [open, setOpen] = useState<Record<Panel, boolean>>({ explorer: true, material: false, artifact: true, chat: true });
  const [viewportBand, setViewportBand] = useState(() => getViewportBand(true));
  const isDesktopWorkspace = viewportBand === 'compact' || viewportBand === 'wide';
  const [compactExplorerOpen, setCompactExplorerOpen] = useState(false);
  const [widths, setWidths] = useState(initialWidths);
  const [expanded, setExpanded] = useState<Panel | null>(null);
  const [activeMobilePanel, setActiveMobilePanel] = useState<Panel>('chat');
  const [activeContentPanel, setActiveContentPanel] = useState<ContentPanel>('chat');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ coursework: true, resources: true });
  const [noteOpen, setNoteOpen] = useState(false);
  const [notebookTab, setNotebookTab] = useState<'artifacts' | 'notes' | 'history'>('artifacts');
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null);
  const [sourceMode, setSourceMode] = useState<'knowledge' | 'notes' | 'chats'>('knowledge');
  const [noteText, setNoteText] = useState(course.initialNote);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyPending, setReplyPending] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [status, setStatus] = useState('');
  const material = courseMaterials.find(item => item.id === selectedMaterial);
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
  const notebookRailVisible = !open.artifact && !expanded && (viewportBand === 'wide' || viewportBand === 'compact');
  const canFitCompactExplorer = widths.explorer + layoutPanels.slice(1).reduce((total, panel) => total + minimumWidths[panel], 0)
    + (notebookRailVisible ? 56 : 0) + (layoutPanels.length - 1 + (notebookRailVisible ? 1 : 0)) * 8
    <= window.innerWidth - (navCollapsed ? 80 : 280) - (window.innerWidth < 1280 ? 48 : 64);
  const compactExplorerRail = viewportBand === 'compact' && (!open.explorer || !canFitCompactExplorer);
  const contentGridColumns = viewportBand === 'medium' && !expanded ? `${widths.explorer}px minmax(0, 1fr)`
    : viewportBand === 'compact' && !expanded ? [compactExplorerRail ? '56px' : `${widths.explorer}px`, ...layoutPanels.slice(1).map(panel => `minmax(${minimumWidths[panel]}px, ${widths[panel]}fr)`)].join(' ')
    : open.material && !open.artifact && chatVisible && !expanded
    ? `${open.explorer ? `${widths.explorer}px` : '56px'} minmax(0, ${widths.material}px) minmax(0, 1fr)`
    : !open.material && open.artifact && chatVisible && !expanded
    ? `${open.explorer ? `${widths.explorer}px` : '56px'} minmax(0, 1fr) ${widths.artifact}px`
    : !open.material && !open.artifact && chatVisible && !expanded
    ? `${open.explorer ? `${widths.explorer}px` : '56px'} minmax(0, 1fr)`
    : layoutPanels.map(panel => {
      if (panel === 'explorer' && !open.explorer) return '56px';
      if (panel === 'explorer') return `${widths.explorer}px`;
      return `minmax(0, ${widths[panel]}fr)`;
    }).join(' ');
  const gridColumns = notebookRailVisible ? `${contentGridColumns} 56px` : contentGridColumns;

  useEffect(() => { document.title = `${courseTitle} · Aqua University`; return () => { document.title = 'Aqua University'; }; }, [courseTitle]);
  useEffect(() => {
    const updateViewport = () => setViewportBand(getViewportBand(navCollapsed));
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [navCollapsed]);
  useEffect(() => { setCompactExplorerOpen(false); }, [viewportBand]);
  useEffect(() => {
    if (viewportBand === 'compact' && compactExplorerOpen && canFitCompactExplorer) {
      setOpen(value => ({ ...value, explorer: true }));
      setCompactExplorerOpen(false);
    }
  }, [viewportBand, compactExplorerOpen, canFitCompactExplorer]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ block: 'end' }); }, [messages]);
  useEffect(() => () => { if (replyTimerRef.current !== null) window.clearTimeout(replyTimerRef.current); }, []);

  const showPanel = (panel: Panel) => {
    if (panel === 'explorer' && compactExplorerRail) {
      if (canFitCompactExplorer) {
        setOpen(value => ({ ...value, explorer: true }));
        setCompactExplorerOpen(false);
      } else {
        setCompactExplorerOpen(true);
      }
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
    if (panel === 'artifact') next.chat = true;
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
      setMessages(items => [...items, { id: ++nextMessageId.current, role: 'assistant', text: siblingSampleReply(course, question, material?.title) }]);
      setReplyPending(false);
      replyTimerRef.current = null;
    }, 450);
  };
  const createNoteFromReply = (reply: string) => {
    setNoteText(reply);
    setNoteOpen(true);
    setNotebookTab('notes');
    setSelectedArtifact(null);
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
    const url = URL.createObjectURL(new Blob([`${courseTitle}\n\n${transcript}\n`], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${courseId}-course-chat.txt`;
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
          <h2>Sources</h2>
          <button className="psy-icon" aria-label="Collapse course explorer" onClick={() => closePanel('explorer')}><img src={sidebarLeftCloseIcon} alt="" width="20" height="20" /></button>
        </div>
        <div className="psy-source-tabs" role="group" aria-label="Source collection">
          <button aria-pressed={sourceMode === 'knowledge'} onClick={() => setSourceMode('knowledge')}><img src={sourceKnowledgeIcon} alt="" /><span>Knowledge</span></button>
          <button aria-label="Notes" title="Notes" aria-pressed={sourceMode === 'notes'} onClick={() => setSourceMode('notes')}><img src={sourceNotesIcon} alt="" /></button>
          <button aria-label="Chats" title="Chats" aria-pressed={sourceMode === 'chats'} onClick={() => setSourceMode('chats')}><img src={sourceChatsIcon} alt="" /></button>
        </div>
        <div className="psy-explorer-content">
          {sourceMode === 'knowledge' ? <>
            <button className="psy-folder" aria-expanded={expandedFolders.coursework} onClick={() => toggleFolder('coursework')}><img className={expandedFolders.coursework ? '' : 'psy-chevron-closed'} src={sourceChevronIcon} alt="" /><img src={sourceFolderIcon} alt="" />Coursework</button>
            {expandedFolders.coursework && <div className="psy-folder-children">{dueMaterials.map(item => <button key={item.id} className="psy-file" aria-current={selectedMaterial === item.id && open.material ? 'page' : undefined} onClick={() => openMaterial(item.id)}><img src={sourceFileIcon} alt="" /><span>{item.title}<small>{item.due}</small></span></button>)}</div>}
            <button className="psy-folder" aria-expanded={expandedFolders.resources} onClick={() => toggleFolder('resources')}><img className={expandedFolders.resources ? '' : 'psy-chevron-closed'} src={sourceChevronIcon} alt="" /><img src={sourceFolderIcon} alt="" />Learning resources</button>
            {expandedFolders.resources && <div className="psy-folder-children">{courseMaterials.map(item => <button key={item.id} className="psy-file" aria-current={selectedMaterial === item.id && open.material ? 'page' : undefined} onClick={() => openMaterial(item.id)}><img src={sourceFileIcon} alt="" /><span>{item.title}<small>{item.kind}</small></span></button>)}</div>}
          </> : sourceMode === 'notes' ? <div className="psy-source-collection"><button onClick={() => { setNotebookTab('notes'); setSelectedArtifact(null); showPanel('artifact'); }}>{noteOpen ? `My ${course.subject} notes` : 'Start a study note'}</button><small>{noteOpen ? 'Session note' : 'Create a note from the chat composer'}</small></div> : <div className="psy-source-collection"><button onClick={() => showPanel('chat')}>Current course chat</button><small>{messages.length ? `${messages.length} messages in this session` : 'No messages yet'}</small></div>}
        </div>
      </aside>
    ),
    material: (
      <section className="psy-panel psy-content-panel" aria-label="Course material">
        <div className="psy-panel-heading"><strong>File Viewer</strong><div className="psy-panel-actions">
          {isDesktopWorkspace && <button className="psy-icon" aria-label={expanded === 'material' ? 'Restore material panel' : 'Expand material panel'} onClick={() => toggleExpanded('material')}><img src={expanded === 'material' ? quitFullScreenIcon : fullScreenIcon} alt="" width="20" height="20" /></button>}
          <button className="psy-icon" aria-label="Close material panel" onClick={() => closePanel('material')}><img src={closeIcon} alt="" width="20" height="20" /></button>
        </div></div>
        <div className="psy-file-tabs" role="tablist" aria-label="Open course files">{openFiles.map((id, index) => { const file = courseMaterials.find(item => item.id === id); return <div key={id} className="psy-file-tab" role="tab" aria-selected={id === selectedMaterial} tabIndex={id === selectedMaterial ? 0 : -1} onClick={() => setSelectedMaterial(id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedMaterial(id); } else if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? openFiles.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + openFiles.length) % openFiles.length; setSelectedMaterial(openFiles[nextIndex]); (event.currentTarget.parentElement?.children[nextIndex] as HTMLElement | undefined)?.focus(); } }}><img src={id === selectedMaterial ? tabFileActiveIcon : tabFileInactiveIcon} alt="" /><span>{file?.title}</span><button aria-label={`Close ${file?.title}`} onClick={event => { event.stopPropagation(); closeMaterialTab(id); }}><img src={tabCloseIcon} alt="" /></button></div>; })}</div>
        {material && <div className="psy-document"><span>{material.kind} · {course.code}</span><h2>{material.title}</h2><p>{material.summary}</p>{material.sections.map(item => <section key={item.heading}><h3>{item.heading}</h3><p>{item.body}</p></section>)}<small>Sample course material · Local prototype</small></div>}
      </section>
    ),
    artifact: (
      <section className={`psy-panel psy-content-panel psy-artifact ${selectedArtifact ? 'psy-artifact-viewing' : ''}`} aria-label="My Notebook">
        <div className="psy-panel-heading"><strong>{selectedArtifact || 'My Notebook'}</strong><div className="psy-panel-actions">
          {viewportBand !== 'small' && <button className="psy-icon" aria-label={expanded === 'artifact' ? 'Restore artifact panel' : 'Expand artifact panel'} onClick={() => toggleExpanded('artifact')}><img src={expanded === 'artifact' ? quitFullScreenLightIcon : fullScreenLightIcon} alt="" width="20" height="20" /></button>}
          {(isDesktopWorkspace || selectedArtifact !== null) && <button className="psy-icon" aria-label={selectedArtifact ? 'Back to notebook' : 'Close notebook'} onClick={() => selectedArtifact ? setSelectedArtifact(null) : closePanel('artifact')}><img src={selectedArtifact ? closeLightIcon : sidebarRightCloseIcon} alt="" width="20" height="20" /></button>}
        </div></div>
        {selectedArtifact ? <div className="psy-artifact-document"><span>{course.code} · SAMPLE ARTIFACT</span><h2>{selectedArtifact}</h2><p>{course.artifactIntro}</p><div className="psy-artifact-diagram"><div>{course.artifactStages[0]}</div><span>→</span><div>{course.artifactStages[1]}</div><span>→</span><div>{course.artifactStages[2]}</div></div><h3>Key idea</h3><p>{course.artifactIdea}</p><h3>Try it</h3><p>{course.artifactExercise}</p><table><caption>Study strategy comparison</caption><thead><tr><th scope="col">Strategy</th><th scope="col">What it checks</th></tr></thead><tbody>{course.artifactComparison.map(([strategy, purpose]) => <tr key={strategy}><td>{strategy}</td><td>{purpose}</td></tr>)}</tbody></table><small>Illustrative local content · No learning platform connected</small></div> : <>
          <div className="psy-notebook-tabs" role="group" aria-label="Notebook collection"><button aria-pressed={notebookTab === 'artifacts'} onClick={() => setNotebookTab('artifacts')}><img src={notebookArtifactsIcon} alt="" />Artifacts</button><button aria-pressed={notebookTab === 'notes'} onClick={() => setNotebookTab('notes')}><img src={notebookNotesIcon} alt="" />Notes</button><button aria-pressed={notebookTab === 'history'} onClick={() => setNotebookTab('history')}><img src={notebookHistoryIcon} alt="" />Chat History</button></div>
          {notebookTab === 'artifacts' ? <div className="psy-notebook-list">{notebookItems.map((item, index) => <button key={item.title} onClick={() => setSelectedArtifact(item.title)}><NotebookFileIcon index={index} /><span><strong>{item.title}</strong><small>{item.type}</small></span></button>)}</div> : notebookTab === 'notes' ? <div className="psy-notebook-notes"><Button variant="outline" onClick={() => setNoteOpen(true)}>{noteOpen ? 'Edit study note' : 'Create study note'}</Button>{noteOpen && <div className="psy-note"><label htmlFor="psy-note-text">My {course.subject} notes</label><textarea id="psy-note-text" value={noteText} onChange={event => setNoteText(event.target.value)} /><p>Changes are kept for this session. This is sample content.</p></div>}</div> : <div className="psy-notebook-history">{messages.length ? <button onClick={() => showPanel('chat')}>Current course chat · {messages.length} messages</button> : <p>No course chats yet. Start a conversation to see it here.</p>}</div>}
        </>}
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
            {viewportBand !== 'small' && <button className="psy-icon" aria-label={expanded === 'chat' ? 'Restore chat panel' : 'Expand chat panel'} onClick={() => toggleExpanded('chat')}><img src={expanded === 'chat' ? quitFullScreenIcon : fullScreenIcon} alt="" width="20" height="20" /></button>}
            {isDesktopWorkspace && (open.material || open.artifact) && <button className="psy-icon" aria-label="Close chat panel" onClick={() => closePanel('chat')}><img src={closeIcon} alt="" width="20" height="20" /></button>}
            <div className="psy-chat-budget" role="meter" aria-label="Budget indicator" aria-valuemin={0} aria-valuemax={100} aria-valuenow={68} title="Budget indicator: 68% (demo)"><img src={chatBudgetIcon} alt="" width="24" height="24" /></div>
          </div>
        </div>
        <div className="psy-chat-body">
          {messages.length ? <div className="psy-chat-messages" aria-live="polite">{messages.map(item => <article key={item.id} className={item.role === 'student' ? 'psy-message psy-message-student' : 'psy-message'}><strong>{item.role === 'student' ? 'You' : 'Course assistant · Local demo'}</strong><p>{item.text}</p>{item.role === 'assistant' && <button className="psy-reply-artifact" onClick={() => createNoteFromReply(item.text)}><img src={artifactIcon} alt="" width="18" height="18" />Open as study note</button>}</article>)}{replyPending && <p role="status">Preparing a sample response…</p>}<div ref={chatEndRef} /></div> : <div className="psy-chat-empty"><img src={chatEmptyArt} alt="" /><p>Ask anything about this course, or select materials to focus the conversation</p></div>}
          <form className="psy-composer" onSubmit={sendMessage}>
          <button type="button" className="psy-icon" aria-label="Create study note" onClick={() => { setNoteOpen(true); setNotebookTab('notes'); setSelectedArtifact(null); showPanel('artifact'); }}><img src={plusIcon} alt="" width="24" height="24" /></button>
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

  return <div className={`onechat psy-shell psy-shell--figma ${navCollapsed ? 'oc-is-collapsed' : ''}`}>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={navCollapsed} onClose={() => setNavCollapsed(value => !value)} /></aside>
    <div className="oc-main psy-main">
      <header className="psy-header">
        <Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}>Menu</Button>
        <button className="psy-back" aria-label="Back to courses" onClick={() => { window.location.hash = '/onechat/courses'; }}><img src={backIcon} alt="" width="24" height="24" /></button>
        <h1>{viewportBand === 'small' ? courseTitle.replace(' · ', ' - ') : courseTitle}</h1>
        {viewportBand !== 'small' && !chatVisible && <Button variant="outline" className="psy-header-chat" onClick={() => showPanel('chat')}><img src={chatTabIcon} alt="" width="20" height="20" />Chat</Button>}
        {viewportBand !== 'small' && !open.artifact && (expanded !== null && expanded !== 'chat' || viewportBand === 'medium') && <Button variant="outline" className="psy-header-notebook" onClick={() => showPanel('artifact')}>My Notebook</Button>}
        <Button className="psy-mobile-bell" size="icon" aria-label={`Notifications, ${notifications.unreadCount} unread`} onClick={notifications.open}><img src={bellIcon} alt="" width="20" height="20" /></Button>
      </header>
      <ToggleButtonGroup
        className="psy-mobile-tabs"
        style={{ '--psy-tab-offset': `${(widths.explorer + 8) / 2}px` } as CSSProperties}
        ariaLabel="Workspace panel"
        options={(viewportBand === 'medium' ? availableContent : viewportBand === 'small' ? panelOrder.filter(panel => panel !== 'material' || open.material) : panelOrder.filter(panel => panel === 'explorer' || open[panel])).map(panel => ({
          value: panel,
          label: panel === 'explorer' ? 'Sources' : panel === 'material' ? 'File Viewer' : panel === 'artifact' ? 'Notebook' : 'Chat',
        }))}
        value={viewportBand === 'medium' ? mediumPanel : activeMobilePanel}
        onValueChange={showPanel}
      />
      <main className={`psy-layout psy-layout-${viewportBand} ${expanded ? 'psy-layout-expanded' : ''}`} style={{ '--psy-grid': gridColumns } as CSSProperties} aria-label={`${course.code} workspace`}>{layoutPanels.map((panel, index) => <div className={`psy-slot ${activeMobilePanel === panel ? 'psy-slot-active' : ''}`} key={panel}>{panelDivider(panel, index)}{panel === 'explorer' ? compactExplorerRail && !expanded ? <div className="psy-compact-explorer">{collapsedExplorer}{compactExplorerOpen && panels.explorer}</div> : viewportBand === 'medium' || viewportBand === 'small' ? panels.explorer : !open.explorer ? collapsedExplorer : panels.explorer : panels[panel]}</div>)}{notebookRailVisible && <div className="psy-slot psy-notebook-rail-slot"><aside className="psy-notebook-rail" aria-label="Collapsed My Notebook"><button className="psy-icon" aria-label="Open My Notebook" title="Open My Notebook" onClick={() => showPanel('artifact')}><img src={sidebarRightOpenIcon} alt="" width="20" height="20" /></button></aside></div>}</main>
      <div className="psy-status psy-sr-only" role="status">{status}</div>
    </div>
    {mobileNavOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileNavOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {modelOpen && <Dialog title="Chat model" onClose={() => setModelOpen(false)}><Button variant="outline" onClick={() => setModelOpen(false)}><img src={chatModelIcon} alt="" width="18" height="18" /> GPT 5.1 · Selected</Button><p>Model selection is simulated in this local prototype.</p></Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
