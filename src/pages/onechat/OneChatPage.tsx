import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Check, LoaderCircle, Menu, Bell, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { assets } from './assets';
import { conversations, type Conversation } from './data';
import './onechat.css';
import { FeaturedAgents } from './FeaturedAgents';
import type { FeaturedAgent } from './featured-agent-data';
import { AgentNavigation } from './AgentNavigation';
import { useAgentNavigation } from './AgentNavigationState';
import type { ChatAgent } from './agent-data';

type SidebarMode = 'chats' | 'agents';
type Info = { title: string; message: string };

export function Asset({ src, className = '' }: { src: string; className?: string }) {
  return <img className={`oc-asset ${className}`} src={src} alt="" draggable={false} />;
}

function ChatsIcon() {
  return <span className="oc-chats-icon" aria-hidden="true">
    <Asset src={assets.chatBack} className="oc-chat-back" />
    <Asset src={assets.chatFront} className="oc-chat-front" />
    <Asset src={assets.chatDots} className="oc-chat-dots" />
  </span>;
}

interface SidebarProps {
  onNewChat: () => void;
  onSelect: (conversation: Conversation) => void;
  onInfo: (info: Info) => void;
  onClose: () => void;
  selectedId?: string;
  mobile?: boolean;
  onNotifications: () => void;
  unreadCount: number;
  notificationsOpen: boolean;
  onSelectAgent: (agent: ChatAgent) => void;
  defaultMode?: SidebarMode;
}

export function SidebarContent({ onNewChat, onSelect, onInfo, onClose, selectedId, mobile, onNotifications, unreadCount, notificationsOpen, onSelectAgent, defaultMode = 'chats' }: SidebarProps) {
  const [mode, setMode] = useState<SidebarMode>(defaultMode);
  const [archived, setArchived] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const visible = conversations.filter(item => Boolean(item.archived) === archived && item.title.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  return <>
    <Button className="oc-collapse" size="icon" aria-label={mobile ? 'Close navigation' : 'Collapse navigation'} onClick={onClose}>
      <span className="oc-collapse-disc">{mobile ? <X size={18} /> : <Asset src={assets.collapse} />}</span>
    </Button>
    <div className="oc-nav-intro">
    <div className="oc-logo"><img src={assets.logo} alt="Aqua University" width="205.248" height="78.815" /></div>
    <nav className="oc-primary-nav" aria-label="ONEchat navigation">
      <Button className="oc-nav-item" onClick={onNewChat}><Asset src={assets.newChat} /><span>New Chat</span></Button>
      <Button className="oc-nav-item" aria-current={window.location.hash.startsWith('#/onechat/artifacts') ? 'page' : undefined} onClick={() => { window.location.hash = '/onechat/artifacts'; }}><Asset src={assets.artifacts} /><span>Artifacts</span></Button>
      <Button className="oc-nav-item" aria-current={window.location.hash.startsWith('#/onechat/projects') ? 'page' : undefined} onClick={() => { window.location.hash = '/onechat/projects'; if (mobile) onClose(); }}><Asset src={assets.projects} /><span>Projects</span></Button>
      <Button className="oc-nav-item" aria-current={window.location.hash.startsWith('#/onechat/agents') ? 'page' : undefined} onClick={() => { window.location.hash = '/onechat/agents'; }}><Asset src={assets.explore} /><span>Explore Agents</span></Button>
    </nav>
    </div>
    <div className="oc-mode-tabs" data-mode={mode} role="tablist" aria-label="Sidebar content" onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextMode = event.key === 'Home' ? 'chats' : event.key === 'End' ? 'agents' : mode === 'chats' ? 'agents' : 'chats';
      setMode(nextMode);
      event.currentTarget.querySelector<HTMLButtonElement>(`#oc-${nextMode}-${mobile ? 'mobile' : 'desktop'}`)?.focus();
    }}>
      <Button id={`oc-chats-${mobile ? 'mobile' : 'desktop'}`} role="tab" tabIndex={mode === 'chats' ? 0 : -1} aria-selected={mode === 'chats'} aria-controls={`oc-panel-${mobile ? 'mobile' : 'desktop'}`} onClick={() => setMode('chats')}><ChatsIcon />Chats</Button>
      <Button id={`oc-agents-${mobile ? 'mobile' : 'desktop'}`} role="tab" tabIndex={mode === 'agents' ? 0 : -1} aria-selected={mode === 'agents'} aria-controls={`oc-panel-${mobile ? 'mobile' : 'desktop'}`} onClick={() => setMode('agents')}><Asset src={assets.bot} />Agents</Button>
    </div>
    <section className={`oc-history ${mode === 'agents' ? 'oc-history--agents' : ''}`} id={`oc-panel-${mobile ? 'mobile' : 'desktop'}`} role="tabpanel" aria-labelledby={`oc-${mode}-${mobile ? 'mobile' : 'desktop'}`}>
      <div className="oc-history-body">
        {mode === 'chats' ? <>
          <div className="oc-history-search">
            {searchOpen ? <input ref={searchRef} aria-label="Search conversations" placeholder="Search conversations" value={query} onChange={event => setQuery(event.target.value)} /> : <span className="oc-section-label">{archived ? 'Archived' : 'Today'}</span>}
            <Button size="icon" aria-label={searchOpen ? 'Close conversation search' : 'Search conversations'} onClick={() => { setSearchOpen(!searchOpen); setQuery(''); }}>
              {searchOpen ? <X size={18} /> : <Asset src={assets.search} />}
            </Button>
          </div>
          {(['Today', 'Previous 7 days'] as const).map((group, index) => {
            const items = visible.filter(item => item.group === group);
            return items.length > 0 && <div className="oc-history-group" key={group}>
              {index > 0 && !archived && <h2 className="oc-section-label">{group}</h2>}
              <ul>{items.map(item => <li key={item.id}><Button className="oc-history-item" title={item.title} aria-current={selectedId === item.id ? 'true' : undefined} onClick={() => onSelect(item)}>{item.title}</Button></li>)}</ul>
            </div>;
          })}
          {!visible.length && <p className="oc-empty">No conversations found. Try another search.</p>}
        </> : <AgentNavigation onSelect={onSelectAgent} />}
      </div>
      {mode === 'chats' && <div className="oc-history-tabs" role="group" aria-label="Conversation collection">
        <Button aria-pressed={!archived} onClick={() => setArchived(false)}>{!archived && <Asset src={assets.historyTab} />}<span>History</span></Button>
        <Button aria-pressed={archived} onClick={() => setArchived(true)}>{archived && <Asset src={assets.historyTab} />}<span>Archived</span></Button>
      </div>}
    </section>
    <footer className="oc-account">
      <Button className="oc-account-button" onClick={() => onInfo({ title: 'Daniel Wang', message: 'Aqua University · Local prototype. Account management is not connected.' })}><span className="oc-avatar" aria-hidden="true">D</span><span>Daniel Wang</span></Button>
      <Button size="icon" aria-label={`Notifications, ${unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notificationsOpen} onClick={onNotifications}><Asset src={assets.bell} />{unreadCount > 0 && <span className="oc-notification-count">{unreadCount}</span>}</Button>
    </footer>
  </>;
}

export function BudgetIndicator() {
  return <div className="oc-budget" role="meter" aria-label="Budget indicator" aria-valuemin={0} aria-valuemax={100} aria-valuenow={68} title="Budget indicator: 68% (demo)">
    <Asset src={assets.budgetTrack} className="oc-budget-track" />
    <Asset src={assets.budgetProgress} className="oc-budget-progress" />
    <span>68%</span>
  </div>;
}

export function OneChatPage() {
  const notifications = useNotifications();
  const agentNavigation = useAgentNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [info, setInfo] = useState<Info | null>(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [prompt, setPrompt] = useState(agentNavigation.pendingConversation?.prompt || '');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [status, setStatusMessage] = useState('');
  const [statusTone, setStatusTone] = useState<'info' | 'success'>('info');
  const setStatus = (message: string, tone: 'info' | 'success' = 'info') => { setStatusMessage(message); setStatusTone(tone); };
  const [submitting, setSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(agentNavigation.pendingConversation?.id);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number>();

  useEffect(() => {
    if (agentNavigation.pendingConversation) agentNavigation.setPendingConversation(null);
  }, [agentNavigation.pendingConversation]);

  useEffect(() => {
    const previous = document.title;
    document.title = 'ONEchat · Aqua University';
    return () => { document.title = previous; window.clearTimeout(timerRef.current); };
  }, []);

  const reset = () => {
    window.clearTimeout(timerRef.current);
    setSubmitting(false); setPrompt(''); setAttachment(null); setSelectedId(undefined); setError(''); setStatus(''); setMobileOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const select = (conversation: Conversation) => {
    window.clearTimeout(timerRef.current); setSubmitting(false);
    setSelectedId(conversation.id); setPrompt(conversation.prompt); setAttachment(null); setError('');
    setStatus('Demo conversation selected. Its prompt is ready to edit; no messages are sent.');
    setMobileOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    if (!prompt.trim()) { setStatus(''); setError('Enter a message before sending.'); inputRef.current?.focus(); return; }
    setError(''); setStatus(''); setSubmitting(true);
    timerRef.current = window.setTimeout(() => {
      setSubmitting(false); setStatus('Demo only: your message has been kept locally. No request was sent to an AI service.', 'success');
    }, 500);
  };
  const selectAgent = (agent: FeaturedAgent) => {
    select({ id: `agent-${agent.id}`, title: agent.name, group: 'Today', prompt: agent.prompt });
    setStatus(`${agent.name} selected. Edit the suggested prompt to begin. This is a local demo; no AI service is connected.`);
  };
  const openAgent = (agent: ChatAgent) => {
    agentNavigation.setAgent(agent);
    setMobileOpen(false);
    window.location.hash = '/onechat/agent';
  };
  const sidebarProps = { onSelectAgent: openAgent, onNewChat: reset, onSelect: select, onInfo: setInfo, selectedId, onNotifications: notifications.open, unreadCount: notifications.unreadCount, notificationsOpen: notifications.isOpen };

  return <div className={`onechat ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a href="#oc-main" className="oc-skip-link" onClick={event => { event.preventDefault(); document.getElementById('oc-main')?.focus(); }}>Skip to chat</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar" hidden={collapsed}>
      <SidebarContent {...sidebarProps} onClose={() => setCollapsed(true)} />
    </aside>
    <main className="oc-main" id="oc-main" tabIndex={-1}>
      <header className="oc-toolbar">
        <div className="oc-toolbar-controls">
          <Button size="icon" className="oc-mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
          {collapsed && <Button size="icon" className="oc-desktop-menu" aria-label="Expand navigation" onClick={() => setCollapsed(false)}><Menu size={22} /></Button>}
          <Button variant="outline" className="oc-model-selector" aria-haspopup="dialog" aria-expanded={modelOpen} onClick={() => setModelOpen(true)}>
            <Asset src={assets.model} /><span>GPT 5.1</span><Asset src={assets.chevron} />
          </Button>
          <div className="oc-toolbar-actions">
            <Button size="icon" aria-label="New chat" title="New chat" onClick={reset}><Asset src={assets.toolbarNew} /></Button>
            <Button size="icon" aria-label="Private chat" aria-pressed={privateMode} title="Private chat" onClick={() => { setPrivateMode(!privateMode); setStatus(`${privateMode ? 'Standard' : 'Private'} mode selected. This local prototype sends no messages and saves no chat history.`); }}><Asset src={assets.incognito} /></Button>
          </div>
        </div>
        <div className="oc-toolbar-end"><Button size="icon" className={`nf-toolbar-trigger nf-compact-trigger ${collapsed ? 'nf-collapsed-trigger' : ''}`} aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} />{notifications.unreadCount > 0 && <span className="nf-trigger-count">{notifications.unreadCount}</span>}</Button><BudgetIndicator /></div>
      </header>
      <div className="oc-welcome">
        <h1>Good morning, <span>Daniel</span>!</h1>
        <div className="oc-composer-area">
          <form className={`oc-composer ${error ? 'oc-composer-error' : ''}`} onSubmit={submit} aria-label="Chat prompt" aria-busy={submitting}>
            <input ref={fileRef} type="file" hidden onChange={event => {
              const file = event.target.files?.[0]; event.target.value = '';
              if (!file) return;
              if (file.size > 10 * 1024 * 1024) { setStatus(''); setError('Choose an attachment smaller than 10 MB.'); return; }
              setError(''); setAttachment(file); setStatus('Attachment selected locally. It will not be uploaded.');
            }} />
            <Button size="icon" className="oc-attach" aria-label="Attach a file" title="Attach a file" onClick={() => fileRef.current?.click()}><Asset src={assets.plus} /></Button>
            <textarea ref={inputRef} aria-label="Message" placeholder="Let’s discover what only you could ask" rows={1} maxLength={4000} value={prompt} aria-invalid={Boolean(error)} aria-describedby={error ? 'oc-prompt-error' : undefined}
              onChange={event => { setPrompt(event.target.value.slice(0, 4000)); setError(''); }}
              onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
            <div className="oc-composer-actions">
              <Button size="icon" aria-label="Dictate a message" title="Dictate a message" onClick={() => setInfo({ title: 'Dictation', message: 'Dictation is shown in the design but is not connected in this prototype. Your microphone has not been accessed.' })}><span className="oc-mic"><Asset src={assets.microphone} /></span></Button>
              {prompt.length > 0 ? <Button variant="default" size="icon" className="oc-send" type="submit" disabled={submitting} aria-label={submitting ? 'Sending message' : 'Send message'}>{submitting ? <LoaderCircle className="oc-loading" size={20} /> : <ArrowUp size={20} />}</Button> :
                <Button size="icon" className="oc-voice" aria-label="Start voice chat" title="Start voice chat" onClick={() => setInfo({ title: 'Voice chat', message: 'Voice chat is shown in the design but is not connected in this prototype. Your microphone has not been accessed.' })}><Asset src={assets.voiceBackground} /><Asset src={assets.soundwave} /></Button>}
            </div>
          </form>
          {attachment && <div className="oc-attachment"><span>{attachment.name}</span><Button size="icon" aria-label="Remove attachment" onClick={() => setAttachment(null)}><X size={16} /></Button></div>}
          <div className="oc-feedback-area">
            <Feedback id="oc-prompt-error" message={error} tone="error" />
            <Feedback message={error ? '' : submitting ? 'Preparing your local demo message…' : status} tone={submitting ? 'loading' : statusTone} onDismiss={submitting ? undefined : () => setStatus('')} />
          </div>
        </div>
      </div>
      <FeaturedAgents onSelect={selectAgent} onBrowse={() => { window.location.hash = '/onechat/agents'; }} />
      <Button size="icon" className="oc-help" aria-label="Help and prototype information" onClick={() => setInfo({ title: 'About this prototype', message: 'ONEchat is a local interface demonstration. Messages, attachments, private mode, and the budget indicator are simulated. No AI service, authentication, or microphone is connected.' })}><Asset src={assets.help} /></Button>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {modelOpen && <Dialog title="Chat model" className="oc-model-dialog" onClose={() => setModelOpen(false)}><Button className="oc-model-option" onClick={() => setModelOpen(false)}><Asset src={assets.model} /><span>GPT 5.1</span><Check size={18} /><span className="oc-sr-only">Selected</span></Button><p>Model selection is simulated. No AI service is connected.</p></Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}>{close => <><p>{info.message}</p><div className="oc-dialog-footer"><a href="#/">Return to idea workspace</a><Button variant="outline" onClick={close}>Close</Button></div></>}</Dialog>}
  </div>;
}
