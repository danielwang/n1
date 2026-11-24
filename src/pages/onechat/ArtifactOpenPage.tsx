import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent } from 'react';
import { Menu } from '../../components/ui/solar-icons';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { Asset, SidebarContent } from './ChatShell';
import { useAgentNavigation } from './AgentNavigationState';
import { ChatComposer } from './ChatComposer';
import type { ChatAgent } from './agent-data';
import type { Conversation } from './data';
import codeFile from '../../assets/onechat/artifact-open/code-file.svg';
import chevronDown from '../../assets/onechat/artifact-open/chevron-down.svg';
import codeView from '../../assets/onechat/artifact-open/code-view.svg';
import previewView from '../../assets/onechat/artifact-open/preview-view.svg';
import downloadIcon from '../../assets/onechat/artifact-open/download.svg';
import moreIcon from '../../assets/onechat/artifact-open/more.svg';
import fullscreenIcon from '../../assets/onechat/artifact-open/fullscreen.svg';
import closeIcon from '../../assets/onechat/artifact-open/close.svg';
import chevronRight from '../../assets/onechat/artifact-open/chevron-right.svg';
import agentAvatar from '../../assets/onechat/artifact-open/agent-avatar.svg';
import modelStart from '../../assets/onechat/artifact-open/model-start-compact.svg';
import modelEnd from '../../assets/onechat/artifact-open/model-end-compact.svg';
import newChatIcon from '../../assets/onechat/artifact-open/new-chat-compact.svg';
import shareConversation from '../../assets/onechat/artifact-open/share-compact.svg';
import conversationOptions from '../../assets/onechat/artifact-open/options-compact.svg';
import compactBudget from '../../assets/onechat/artifact-open/budget-compact.svg';
import sendArrow from '../../assets/onechat/artifact-open/send-arrow.svg';
import maintenancePreview from '../../assets/onechat/artifact-open/maintenance-preview.png';
import './artifact-open.css';

const artifactHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>We'll Be Back Soon</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #2d2d32; text-align: center; margin: 0; }
    main { max-width: 580px; margin: 80px auto; padding: 24px; }
    h1 { font-size: 42px; margin: 24px 0 10px; }
    .badge { display: inline-block; padding: 8px 18px; border: 1px solid #cad5e1; border-radius: 999px; }
    .progress { width: 240px; height: 4px; margin: 32px auto 16px; background: linear-gradient(90deg,#37c5f0,#9c80ed); }
    p { line-height: 1.6; }
    footer { margin-top: 38px; font-size: 13px; }
  </style>
</head>
<body>
  <main>
    <div aria-hidden="true" style="font-size:64px">🔧</div>
    <h1>We'll Be Back Soon</h1>
    <span class="badge">🌐 Website Under Maintenance</span>
    <p>We're currently performing some important updates to improve your experience.<br>Our team is working hard to bring everything back online as quickly as possible.</p>
    <div class="progress" aria-hidden="true"></div>
    <p>Estimated completion: <strong>~15 minutes</strong></p>
    <footer>Thank you for your patience ❤️<br>If you need urgent help, contact us at <strong>support@yourwebsite.com</strong></footer>
  </main>
</body>
</html>`;

export function ArtifactOpenPage() {
  const notifications = useNotifications();
  const navigation = useAgentNavigation();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [view, setView] = useState<'code' | 'preview'>('preview');
  const [fullScreen, setFullScreen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [chatWidth, setChatWidth] = useState(434);
  const [workspaceWidth, setWorkspaceWidth] = useState(0);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const panel = useRef<HTMLElement>(null);
  const workspace = useRef<HTMLElement>(null);
  const resizeStart = useRef<{ x: number; width: number } | null>(null);
  const maxChatWidth = workspaceWidth ? Math.max(320, Math.min(640, workspaceWidth - 363)) : 640;
  const displayedChatWidth = Math.max(320, Math.min(chatWidth, maxChatWidth));

  useEffect(() => {
    const previous = document.title;
    document.title = 'Interactive Artifact Demo · Aqua University';
    return () => { document.title = previous; };
  }, []);
  useEffect(() => {
    if (!workspace.current) return;
    const observer = new ResizeObserver(entries => setWorkspaceWidth(entries[0].contentRect.width));
    observer.observe(workspace.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setVersionOpen(false); setMoreOpen(false); if (fullScreen) setFullScreen(false); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [fullScreen]);

  const close = () => { window.location.hash = '/onechat/artifacts'; };
  const download = () => {
    const url = URL.createObjectURL(new Blob([artifactHtml], { type: 'text/html' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'interactive-artifact-demo.html'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMoreOpen(false);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) { setError('Enter a message before sending.'); input.current?.focus(); return; }
    setSent(items => [...items, message.trim()]); setMessage(''); setError('');
  };
  const stopResize = (event: PointerEvent<HTMLDivElement>) => {
    if (!resizeStart.current) return;
    resizeStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.classList.remove('ao-divider--dragging');
    document.body.style.cursor = '';
  };
  const resizeWithKeyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 320 : event.key === 'End' ? maxChatWidth : displayedChatWidth + (event.key === 'ArrowLeft' ? -1 : 1) * (event.shiftKey ? 32 : 16);
    setChatWidth(Math.max(320, Math.min(maxChatWidth, next)));
  };
  const newChat = () => { window.location.hash = '/onechat'; };
  const openConversation = (conversation: Conversation) => { navigation.setPendingConversation(conversation); newChat(); };
  const openAgent = (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; };
  const sidebarProps = { onNewChat: newChat, onSelect: openConversation, onInfo: setInfo, onSelectAgent: openAgent, onNotifications: notifications.open, unreadCount: notifications.unreadCount, notificationsOpen: notifications.isOpen };

  return <div className={`onechat artifact-open ${collapsed ? 'oc-is-collapsed' : ''} ${fullScreen ? 'ao-full-screen' : ''}`}>
    <a className="oc-skip-link" href="#ao-main" onClick={event => { event.preventDefault(); document.getElementById('ao-main')?.focus(); }}>Skip to artifact</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={collapsed} onClose={() => setCollapsed(value => !value)} /></aside>
    <main className="ao-workspace" id="ao-main" tabIndex={-1} ref={workspace} style={{ '--ao-chat-width': `${displayedChatWidth}px` } as CSSProperties}>
      <section className="ao-chat" aria-label="Artifact conversation">
        <header className="ao-chat-header">
          <Button size="icon" className="ao-mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></Button>
          <div className="ao-chat-controls">
            <Button variant="outline" className="ao-model" onClick={() => setInfo({ title: 'Model selection', message: 'GPT 5.1 is shown for this local prototype. No AI model is connected.' })}><Asset src={modelStart} />GPT 5.1 <Asset src={modelEnd} /></Button>
            <div className="ao-chat-actions"><Button size="icon" aria-label="New chat" onClick={newChat}><Asset src={newChatIcon} /></Button><Button size="icon" aria-label="Share conversation" onClick={() => setInfo({ title: 'Share conversation', message: 'Sharing is simulated in this local prototype. No link or invitation was created.' })}><Asset src={shareConversation} /></Button><Button size="icon" aria-label="Conversation options" onClick={() => setInfo({ title: 'Conversation options', message: 'This example conversation is part of the local artifact demo.' })}><Asset src={conversationOptions} /></Button></div>
          </div>
          <div className="ao-budget" role="meter" aria-label="Budget indicator" aria-valuemin={0} aria-valuemax={100} aria-valuenow={68} title="Budget indicator: 68% (demo)"><img src={compactBudget} alt="" width={24} height={24} /></div>
        </header>
        <div className="ao-messages">
          <div className="ao-message ao-user-message"><span className="ao-user-avatar" aria-hidden="true">DW</span><p>create a single html page for website is under maintenance</p></div>
          <div className="ao-assistant-message"><span className="ao-agent-avatar" aria-hidden="true"><Asset src={agentAvatar} /></span><div><strong>ONEChat</strong><p>Here’s a single-page maintenance notice. You can inspect the HTML or preview the page in the artifact panel.</p><Button className="ao-artifact-card" onClick={() => { setView('preview'); panel.current?.focus(); }}><img src={codeFile} alt="" /><span><strong>Interactive Artifact Demo</strong><small>Code <span>Mar 29, 11:33AM</span></small></span><img src={chevronRight} alt="" /></Button><p>Let me know if you need any changes! 🚀</p></div></div>
          {sent.map((item, index) => <div className="ao-message ao-user-message" key={index}><span className="ao-user-avatar" aria-hidden="true">DW</span><p>{item}</p></div>)}
          {sent.length > 0 && <p className="ao-demo-note" role="status">Demo only: your message is stored on this page. No AI service was contacted.</p>}
        </div>
        <div className="ao-compose-wrap"><ChatComposer className="ao-composer" value={message} onChange={value => { setMessage(value); setError(''); }} onSubmit={submit} inputRef={input} placeholder="Type a message" error={error} errorId="ao-prompt-error" emptyAction="send" sendIcon={<img src={sendArrow} alt="" />} onAttach={() => setInfo({ title: 'Attachments', message: 'File upload is not connected in this artifact demo.' })} onDictate={() => setInfo({ title: 'Dictation', message: 'Dictation is simulated in this local prototype. No microphone is accessed.' })} /><Feedback id="ao-prompt-error" message={error} tone="error" /><p className="ao-disclaimer">GPT 5.1 can make mistakes. Consider checking important information.</p></div>
      </section>
      <div className="ao-divider" role="separator" tabIndex={0} aria-orientation="vertical" aria-label="Resize chat and artifact panels" aria-valuemin={320} aria-valuemax={maxChatWidth} aria-valuenow={Math.round(displayedChatWidth)} onPointerDown={event => { event.preventDefault(); resizeStart.current = { x: event.clientX, width: displayedChatWidth }; event.currentTarget.classList.add('ao-divider--dragging'); event.currentTarget.setPointerCapture(event.pointerId); document.body.style.cursor = 'col-resize'; }} onPointerMove={event => { if (!resizeStart.current) return; setChatWidth(Math.max(320, Math.min(maxChatWidth, resizeStart.current.width + event.clientX - resizeStart.current.x))); }} onPointerUp={stopResize} onPointerCancel={stopResize} onKeyDown={resizeWithKeyboard}><span aria-hidden="true" /></div>
      <section className="ao-panel" aria-label="Interactive Artifact Demo" ref={panel} tabIndex={-1}>
        <header className="ao-panel-header"><div className="ao-title"><h1>Interactive Artifact Demo</h1><div className="ao-popup-anchor"><Button className="ao-version" aria-expanded={versionOpen} aria-label="Version 3" onClick={() => { setVersionOpen(value => !value); setMoreOpen(false); }}>V3 <img src={chevronDown} alt="" /></Button>{versionOpen && <div className="ao-popover" role="menu"><Button role="menuitem" onClick={() => setVersionOpen(false)}>Version 3 · Current</Button></div>}</div></div>
          <div className="ao-view-toggle" role="group" aria-label="Artifact view"><Button size="icon" aria-label="Code view" aria-pressed={view === 'code'} onClick={() => { setView('code'); setVersionOpen(false); setMoreOpen(false); }}><img src={codeView} alt="" /></Button><Button size="icon" aria-label="Preview" aria-pressed={view === 'preview'} onClick={() => { setView('preview'); setVersionOpen(false); setMoreOpen(false); }}><img src={previewView} alt="" /></Button></div>
          <div className="ao-panel-actions ui-icon-actions-inverse"><Button size="icon" aria-label="Download HTML" onClick={download}><img src={downloadIcon} alt="" /></Button><div className="ao-popup-anchor"><Button size="icon" aria-label="More artifact options" aria-expanded={moreOpen} onClick={() => { setMoreOpen(value => !value); setVersionOpen(false); }}><img src={moreIcon} alt="" /></Button>{moreOpen && <div className="ao-popover ao-more" role="menu"><Button role="menuitem" onClick={() => { setView('code'); setMoreOpen(false); }}>View code</Button><Button role="menuitem" onClick={download}>Download HTML</Button></div>}</div><Button size="icon" aria-label={fullScreen ? 'Exit full screen preview' : 'Full screen preview'} aria-pressed={fullScreen} onClick={() => { setFullScreen(value => !value); setVersionOpen(false); setMoreOpen(false); }}><img src={fullscreenIcon} alt="" /></Button><Button size="icon" aria-label="Close artifact" onClick={close}><img src={closeIcon} alt="" /></Button></div>
        </header>
        <div className="ao-panel-body">{view === 'preview' ? <div className="ao-preview"><img src={maintenancePreview} alt="Maintenance page preview: We'll Be Back Soon, estimated completion about 15 minutes" width={1204} height={832} /></div> : <div className="ao-code"><p>interactive-artifact-demo.html · Local demo source</p><pre><code>{artifactHtml}</code></pre></div>}</div>
      </section>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{dismiss => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={dismiss} /></div>}</Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
