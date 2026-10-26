import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Bell, Check, LoaderCircle, Menu, Pin, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { Asset, BudgetIndicator, SidebarContent } from './OneChatPage';
import { assets } from './assets';
import { agentAssets, chatStarters, type ChatAgent } from './agent-data';
import { AgentAvatar } from './AgentNavigation';
import { useAgentNavigation } from './AgentNavigationState';
import './agent-chat.css';

export function AgentChatPage() {
  const notifications = useNotifications();
  const { agent, setAgent, pinned, togglePinned } = useAgentNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialog, setDialog] = useState<'guidelines' | 'options' | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const [privateMode, setPrivateMode] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const starters = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const request = useRef(0);
  const [starterIndex, setStarterIndex] = useState(0);
  useEffect(() => {
    const previous = document.title;
    document.title = `${agent.name} · ONEchat`;
    return () => { document.title = previous; };
  }, [agent.name]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const reset = () => {
    request.current += 1; window.clearTimeout(timer.current);
    setBusy(false); setPrompt(''); setAttachment(null); setError(''); setStatus(''); setMobileOpen(false);
    requestAnimationFrame(() => input.current?.focus());
  };
  const chooseAgent = (next: ChatAgent) => { reset(); setAgent(next); };
  const prepare = (message: string) => {
    setPrompt(message); setError(''); setStatus('Suggested prompt ready to edit. No message has been sent.');
    input.current?.focus();
  };
  const submit = (event: FormEvent) => {
    event.preventDefault(); if (busy) return;
    if (!prompt.trim()) { setError('Enter a message before sending.'); setStatus(''); input.current?.focus(); return; }
    setError(''); setStatus(''); setBusy(true);
    const current = ++request.current;
    timer.current = window.setTimeout(() => {
      if (current !== request.current) return;
      setBusy(false); setStatus('Demo complete. Your message stays on this page; no AI service was contacted.');
    }, 500);
  };
  const sidebarProps = {
    onNewChat: () => { window.location.hash = '/onechat'; },
    onSelect: (conversation: { prompt: string }) => { prepare(conversation.prompt); setMobileOpen(false); },
    onInfo: setInfo, onNotifications: notifications.open, unreadCount: notifications.unreadCount,
    notificationsOpen: notifications.isOpen, defaultMode: 'agents' as const, onSelectAgent: chooseAgent,
  };
  return <div className={`onechat agent-chat ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a className="oc-skip-link" href="#ac-main" onClick={event => { event.preventDefault(); document.getElementById('ac-main')?.focus(); }}>Skip to agent chat</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar" hidden={collapsed}><SidebarContent {...sidebarProps} onClose={() => setCollapsed(true)} /></aside>
    <main className="oc-main" id="ac-main" tabIndex={-1}>
      <header className="oc-toolbar ac-toolbar"><div className="oc-toolbar-controls">
        <Button size="icon" className="oc-mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
        {collapsed && <Button size="icon" className="oc-desktop-menu" aria-label="Expand navigation" onClick={() => setCollapsed(false)}><Menu size={22} /></Button>}
        <Button size="icon" aria-label="New agent conversation" onClick={reset}><Asset src={assets.toolbarNew} /></Button>
        <Button size="icon" aria-label="Agent options" aria-haspopup="dialog" onClick={() => setDialog('options')}><Asset src={agentAssets.dots} /></Button>
        <Button size="icon" aria-label="Private chat" aria-pressed={privateMode} onClick={() => { setPrivateMode(!privateMode); setStatus(`${privateMode ? 'Standard' : 'Private'} mode selected. This local demo never sends messages or saves chat history.`); }}><Asset src={assets.incognito} /></Button>
      </div><div className="oc-toolbar-end"><Button size="icon" className={`nf-toolbar-trigger nf-compact-trigger ${collapsed ? 'nf-collapsed-trigger' : ''}`} aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button><BudgetIndicator /></div></header>
      <section className="ac-content" aria-label="Agent conversation">
        <div className="ac-profile"><AgentAvatar agent={agent} large /><h1>{agent.name}</h1></div>
        <p className="ac-introduction">This learning assistant was created by the educational authority to provide guided support in this subject. It is designed to help you understand complex topics, improve study habits, and prepare effectively for assessments. Please feel free to ask questions or request help with any area of study.</p>
        <Button className="ac-guidelines" onClick={() => setDialog('guidelines')}><Asset src={agentAssets.guideline} />Read Guideline</Button>
        <div className="ac-composer-area"><form className={`oc-composer ${error ? 'oc-composer-error' : ''}`} aria-label="Agent chat prompt" aria-busy={busy} onSubmit={submit}>
          <input type="file" ref={file} hidden onChange={event => { const picked = event.target.files?.[0]; event.target.value = ''; if (!picked) return; if (picked.size > 10 * 1024 * 1024) { setError('Choose an attachment smaller than 10 MB.'); setStatus(''); return; } setAttachment(picked); setError(''); setStatus('Attachment selected locally. It will not be uploaded.'); }} />
          <Button size="icon" aria-label="Attach a file" onClick={() => file.current?.click()}><Asset src={assets.plus} /></Button>
          <textarea ref={input} aria-label="Message" placeholder="Type a message" rows={1} value={prompt} maxLength={4000} aria-invalid={Boolean(error)} aria-describedby={error ? 'ac-error' : undefined} onChange={event => { setPrompt(event.target.value); setError(''); }} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
          <div className="oc-composer-actions"><Button size="icon" aria-label="Dictate a message" onClick={() => setInfo({ title: 'Dictation', message: 'Dictation is not connected in this local demo. Your microphone has not been accessed.' })}><span className="oc-mic"><Asset src={assets.microphone} /></span></Button><Button className="oc-voice ac-send" size="icon" type="submit" aria-label={busy ? 'Preparing message' : 'Send message'} disabled={busy}>{busy ? <LoaderCircle className="oc-loading" size={20} /> : <><Asset src={assets.voiceBackground} /><Asset src={agentAssets.send} /></>}</Button></div>
        </form>
        {attachment && <div className="oc-attachment"><span>{attachment.name}</span><Button size="icon" aria-label="Remove attachment" onClick={() => setAttachment(null)}><X size={16} /></Button></div>}
        <div className="ac-feedback"><Feedback id="ac-error" message={error} tone="error" /><Feedback message={error ? '' : busy ? 'Preparing your local demo message…' : status} tone={busy ? 'loading' : 'info'} onDismiss={busy ? undefined : () => setStatus('')} /></div></div>
        <div className="ac-starters-wrap"><div className="ac-starters" ref={starters} aria-label="Suggested prompts" onScroll={event => { const width = event.currentTarget.firstElementChild?.getBoundingClientRect().width ?? 298; setStarterIndex(Math.round(event.currentTarget.scrollLeft / (width + 16))); }}>{chatStarters.map(item => <Button key={item.title} className="ac-starter" onClick={() => prepare(item.prompt)}><img className="ac-starter-background" src={agentAssets.starter} alt="" /><span className="ac-starter-title"><Asset src={agentAssets.prompt} /><span>{item.title}</span></span><span className="ac-starter-description">{item.prompt}</span></Button>)}</div><Button size="icon" className="ac-next" aria-label={starterIndex >= chatStarters.length - 2 ? 'First suggested prompts' : 'Next suggested prompts'} onClick={() => { const el = starters.current; if (!el) return; const width = el.firstElementChild?.getBoundingClientRect().width ?? 298; const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2; el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + width + 16, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }}><Asset src={agentAssets.next} /></Button></div>
      </section>
      <Button className="oc-help" size="icon" aria-label="Help and prototype information" onClick={() => setInfo({ title: 'About agent chat', message: 'This is an editable local prototype. Agents, guidelines, budget usage, attachments, and message submission are simulated. No AI service is connected.' })}><Asset src={assets.help} /><span className="ac-help-dot" /></Button>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog agent-chat-navigation" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {dialog === 'guidelines' && <Dialog title="Agent guidelines" onClose={() => setDialog(null)}><p>Sample guidance for {agent.name}. This prototype is for exploring the interface.</p><ul className="ac-guideline-list"><li>Ask a focused question and include the context you want to explore.</li><li>Use explanations to support your learning. Verify facts and citations with your course materials.</li><li>Keep personal, confidential, and assessment-sensitive information out of your prompts.</li><li>For official university advice, contact the relevant university service.</li></ul><p>These are demonstration guidelines, not an official university policy.</p><Button variant="outline" onClick={() => setDialog(null)}>Got it</Button></Dialog>}
    {dialog === 'options' && <Dialog title="Agent options" onClose={() => setDialog(null)}><p>{agent.name}</p><Button className="ac-option" aria-pressed={pinned.includes(agent.id)} onClick={() => { togglePinned(agent.id); }}><Pin size={18} />{pinned.includes(agent.id) ? 'Unpin agent' : 'Pin agent'}{pinned.includes(agent.id) && <Check size={18} />}</Button><Button className="ac-option" onClick={() => setDialog('guidelines')}><Asset src={agentAssets.guideline} />Read Guideline</Button><a className="ac-back" href="#/onechat">Return to ONEchat</a></Dialog>}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
