import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, Menu, Bell, X } from '../../components/ui/solar-icons';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { assets } from './assets';
import type { Conversation } from './data';
import { FeaturedAgents } from './FeaturedAgents';
import type { FeaturedAgent } from './featured-agent-data';
import { ChatComposer } from './ChatComposer';
import { useAgentNavigation } from './AgentNavigationState';
import type { ChatAgent } from './agent-data';
import { Asset, BudgetIndicator, SidebarContent, type Info } from './ChatShell';

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
    <aside className="oc-sidebar" aria-label="Chat sidebar">
      <SidebarContent {...sidebarProps} collapsed={collapsed} onClose={() => setCollapsed(value => !value)} />
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
          <input ref={fileRef} type="file" hidden onChange={event => {
              const file = event.target.files?.[0]; event.target.value = '';
              if (!file) return;
              if (file.size > 10 * 1024 * 1024) { setStatus(''); setError('Choose an attachment smaller than 10 MB.'); return; }
              setError(''); setAttachment(file); setStatus('Attachment selected locally. It will not be uploaded.');
            }} />
          <ChatComposer value={prompt} onChange={value => { setPrompt(value.slice(0, 4000)); setError(''); }} onSubmit={submit} inputRef={inputRef} placeholder="Let’s discover what only you could ask" error={error} errorId="oc-prompt-error" busy={submitting}
            onAttach={() => fileRef.current?.click()}
            onDictate={() => setInfo({ title: 'Dictation', message: 'Dictation is shown in the design but is not connected in this prototype. Your microphone has not been accessed.' })}
            onVoice={() => setInfo({ title: 'Voice chat', message: 'Voice chat is shown in the design but is not connected in this prototype. Your microphone has not been accessed.' })} />
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
