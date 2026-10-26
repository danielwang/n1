import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { Asset, SidebarContent } from './OneChatPage';
import { assets } from './assets';
import { useAgentNavigation } from './AgentNavigationState';
import type { ChatAgent } from './agent-data';
import type { Conversation } from './data';
import { directoryArt, directoryStorageKey, loadPersonalAgents, officialAgents, sharedAgents, type DirectoryAgent } from './directory-data';
import './agent-directory.css';

function DirectoryAvatar({ agent }: { agent: DirectoryAgent }) {
  return <span className={`ep-avatar ep-avatar--${agent.glyph}`} aria-hidden="true">
    <span className="ep-avatar-icon"><img src={directoryArt[agent.glyph]} alt="" /></span>
    {agent.scope === 'official' && <img className="ep-official-badge" src={directoryArt.official} alt="" />}
  </span>;
}

function AgentCard({ agent, onOpen, onEdit, onShare }: {
  agent: DirectoryAgent; onOpen: () => void; onEdit?: () => void; onShare?: () => void;
}) {
  return <article className={`ep-card ${agent.scope === 'mine' ? 'ep-card--personal' : ''}`} aria-label={agent.name}>
    <div className="ep-card-heading"><DirectoryAvatar agent={agent} />
      <h3><Button className="ep-card-open" onClick={onOpen} aria-label={`Chat with ${agent.name}`} aria-description={agent.scope === 'official' ? 'Official agent. Opens a local demo conversation.' : 'Opens a local demo conversation.'}>{agent.name}</Button></h3>
    </div>
    <p className="ep-card-description">{agent.description}</p>
    {agent.scope === 'mine' && <div className="ep-card-actions">
      <Button size="icon" aria-label={`Share ${agent.name}`} onClick={onShare}><Asset src={directoryArt.share} /><span className="ep-tooltip" aria-hidden="true">Share</span></Button>
      <Button size="icon" aria-label={`Edit ${agent.name}`} onClick={onEdit}><Asset src={directoryArt.edit} /><span className="ep-tooltip" aria-hidden="true">Edit</span></Button>
    </div>}
  </article>;
}

function AgentEditor({ agent, onSave, onClose }: { agent?: DirectoryAgent; onSave: (name: string, description: string) => void; onClose: () => void }) {
  const [name, setName] = useState(agent?.name || '');
  const [description, setDescription] = useState(agent?.description || '');
  const [errors, setErrors] = useState({ name: '', description: '' });
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = { name: name.trim() ? '' : 'Enter an agent name.', description: description.trim() ? '' : 'Add a description of what this agent helps with.' };
    setErrors(next);
    if (next.name) { nameRef.current?.focus(); return; }
    if (next.description) { descriptionRef.current?.focus(); return; }
    onSave(name.trim(), description.trim());
  };
  return <Dialog title={agent ? 'Edit agent' : 'Create agent'} onClose={onClose} className="ep-dialog">
    {close => <form className="ep-form" onSubmit={submit} noValidate>
      <p>Customise an agent for a specific purpose. This demo saves changes in this browser; no AI service is connected.</p>
      <label htmlFor={`${id}-name`}>Agent name <span>Required</span></label>
      <input ref={nameRef} autoFocus id={`${id}-name`} value={name} maxLength={60} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} onChange={event => { setName(event.target.value); setErrors(value => ({ ...value, name: '' })); }} />
      <Feedback id={`${id}-name-error`} message={errors.name} tone="error" />
      <label htmlFor={`${id}-description`}>Description <span>Required</span></label>
      <textarea ref={descriptionRef} id={`${id}-description`} value={description} maxLength={300} rows={3} required aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? `${id}-description-error` : undefined} onChange={event => { setDescription(event.target.value); setErrors(value => ({ ...value, description: '' })); }} />
      <Feedback id={`${id}-description-error`} message={errors.description} tone="error" />
      <div className="ep-dialog-actions"><Button variant="outline" onClick={close}>Cancel</Button><Button variant="default" type="submit">{agent ? 'Save changes' : 'Create agent'}</Button></div>
    </form>}
  </Dialog>;
}

function ShareAgent({ agent, onClose }: { agent: DirectoryAgent; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  return <Dialog title={`Share ${agent.name}`} onClose={onClose} className="ep-dialog">
    <form className="ep-form" noValidate onSubmit={event => {
      event.preventDefault();
      if (!email.trim() || !input.current?.validity.valid) { setError('Enter a valid email address.'); setPreview(''); input.current?.focus(); return; }
      setError(''); setPreview(`Demo invitation preview: ${agent.name} would be shared with ${email.trim()}. No invitation has been sent.`);
    }}>
      <p>Preview sharing this agent with a colleague. Sharing is simulated and sends no email or invitation.</p>
      <label htmlFor={id}>Email address</label>
      <input autoFocus ref={input} id={id} type="email" required value={email} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={event => { setEmail(event.target.value); setError(''); setPreview(''); }} />
      <Feedback id={`${id}-error`} message={error} tone="error" />
      <Feedback message={preview} tone="success" />
      <div className="ep-dialog-actions"><Button variant="default" type="submit">Preview invitation</Button></div>
    </form>
  </Dialog>;
}

export function AgentDirectoryPage() {
  const notifications = useNotifications();
  const navigation = useAgentNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'mine' | 'shared'>('mine');
  const [personalAgents, setPersonalAgents] = useState(loadPersonalAgents);
  const [persistent, setPersistent] = useState(true);
  const [editor, setEditor] = useState<{ agent?: DirectoryAgent } | null>(null);
  const [sharing, setSharing] = useState<DirectoryAgent | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const [status, setStatus] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const officialSection = useRef<HTMLElement>(null);
  useEffect(() => {
    const previous = document.title; document.title = 'Explore Agents · Aqua University';
    return () => { document.title = previous; };
  }, []);
  useEffect(() => {
    try { localStorage.setItem(directoryStorageKey, JSON.stringify(personalAgents)); setPersistent(true); }
    catch { setPersistent(false); }
  }, [personalAgents]);
  const matches = (agent: DirectoryAgent) => `${agent.name} ${agent.description}`.toLowerCase().includes(query.trim().toLowerCase());
  const official = officialAgents.filter(matches);
  const personal = (tab === 'mine' ? personalAgents : sharedAgents).filter(matches);
  const openAgent = (agent: DirectoryAgent) => {
    navigation.setAgent({ id: agent.id, name: agent.name, icon: directoryArt[agent.glyph], official: agent.scope === 'official', iconSize: agent.glyph === 'study' ? undefined : 36, art: agent.glyph === 'study' ? 'centaurus' : undefined });
    window.location.hash = '/onechat/agent';
  };
  const openNavigationAgent = (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; };
  const newChat = () => { window.location.hash = '/onechat'; };
  const openConversation = (conversation: Conversation) => { navigation.setPendingConversation(conversation); newChat(); };
  const sidebarProps = { onNewChat: newChat, onSelect: openConversation, onInfo: setInfo, onSelectAgent: openNavigationAgent, onNotifications: notifications.open, unreadCount: notifications.unreadCount, notificationsOpen: notifications.isOpen };
  const create = () => { setEditor({}); setStatus(''); };
  const save = (name: string, description: string) => {
    if (editor?.agent) {
      const id = editor.agent.id;
      setPersonalAgents(items => items.map(item => item.id === id ? { ...item, name, description } : item));
      setStatus(`${name} updated in this local demo.`);
    } else {
      const next: DirectoryAgent = { id: `custom-${crypto.randomUUID()}`, name, description, glyph: 'study', scope: 'mine' };
      setPersonalAgents(items => [...items, next]); setTab('mine'); setQuery('');
      setStatus(`${name} created in this local demo.`);
    }
    setEditor(null);
  };

  return <div className={`onechat agent-directory ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a className="oc-skip-link" href="#ep-main" onClick={event => { event.preventDefault(); document.getElementById('ep-main')?.focus(); }}>Skip to agents</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar" hidden={collapsed}><SidebarContent {...sidebarProps} onClose={() => setCollapsed(true)} /></aside>
    <main className="oc-main ep-main" id="ep-main" tabIndex={-1}>
      <div className="ep-responsive-toolbar"><Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
        {collapsed && <Button className="oc-desktop-menu" size="icon" aria-label="Expand navigation" onClick={() => setCollapsed(false)}><Menu size={22} /></Button>}
        <Button size="icon" className="nf-compact-trigger" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button>
      </div>
      <div className="ep-content">
        <header className="ep-hero"><h1>Discover Intelligent Agents Designed by Our Team</h1>
          <div className="ep-search"><Asset src={directoryArt.search} /><input ref={search} aria-label="Search agents" placeholder="Search for Agent like “Campus map”" value={query} onChange={event => setQuery(event.target.value)} />{query && <Button size="icon" aria-label="Clear agent search" onClick={() => { setQuery(''); search.current?.focus(); }}><X size={18} /></Button>}</div>
        </header>
        <section className="ep-official-section" aria-labelledby="ep-official-title" ref={officialSection} tabIndex={-1}>
          <div className="ep-section-heading"><h2 id="ep-official-title">Official Agents</h2><p>Engineered with permissions and safeguards for secure and controlled access</p>
            <Button className="ep-browse" onClick={() => { setQuery(''); officialSection.current?.focus(); }}><span>Browse all agents</span><Asset src={directoryArt.chevron} /></Button>
          </div>
          {official.length ? <div className="ep-card-grid ep-official-grid">{official.map(agent => <AgentCard key={agent.id} agent={agent} onOpen={() => openAgent(agent)} />)}</div> : <div className="ep-empty"><h3>No official agents found</h3><p>Try another name or topic.</p><Button variant="outline" onClick={() => setQuery('')}>Clear search</Button></div>}
        </section>
        <section className="ep-personal-section" aria-labelledby="ep-personal-title">
          <div className="ep-section-heading ep-personal-heading"><h2 id="ep-personal-title">My Agents</h2><p>Agents created by me</p><Button className="ep-create" onClick={create}><Asset src={directoryArt.plusSmall} />Create</Button></div>
          <div ref={tabs} className="ep-tabs" role="tablist" aria-label="My agents" onKeyDown={event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault(); const next = event.key === 'Home' ? 'mine' : event.key === 'End' ? 'shared' : tab === 'mine' ? 'shared' : 'mine';
            setTab(next); tabs.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
          }}>
            <Button id="ep-tab-mine" data-tab="mine" role="tab" tabIndex={tab === 'mine' ? 0 : -1} aria-controls="ep-personal-panel" aria-selected={tab === 'mine'} onClick={() => setTab('mine')}>Created by me</Button>
            <Button id="ep-tab-shared" data-tab="shared" role="tab" tabIndex={tab === 'shared' ? 0 : -1} aria-controls="ep-personal-panel" aria-selected={tab === 'shared'} onClick={() => setTab('shared')}>Shared with me ({sharedAgents.length})</Button>
          </div>
          <div id="ep-personal-panel" role="tabpanel" aria-labelledby={`ep-tab-${tab}`}>
            <div className="ep-card-grid ep-personal-grid">{personal.map(agent => <AgentCard key={agent.id} agent={agent} onOpen={() => openAgent(agent)} onEdit={() => { setEditor({ agent }); setStatus(''); }} onShare={() => setSharing(agent)} />)}
              {tab === 'mine' && <Button className="ep-add-card" onClick={create}><span><Asset src={directoryArt.plus} />Create</span><span>Customize a version of Agent for a specific purpose</span></Button>}
            </div>
            {!personal.length && <p className="ep-personal-empty">{query ? 'No agents match your search in this collection.' : tab === 'mine' ? 'Create your first agent to get started.' : 'No agents have been shared with you.'}</p>}
          </div>
        </section>
        {!persistent && <Feedback message="Browser storage is unavailable. Changes will last for this page session." />}
        <span className="oc-sr-only" role="status">{query ? `${official.length} official agents and ${personal.length} agents in this collection match your search.` : ''}</span>
      </div>
      <Button size="icon" className="oc-help" aria-label="Help and prototype information" onClick={() => setInfo({ title: 'About Explore Agents', message: 'This directory is a local prototype. Agent chat, creation, editing, and invitation previews are simulated. Your own agent names and descriptions are stored only in this browser. No AI service is connected and no invitations are sent.' })}><Asset src={assets.help} /></Button>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {editor && <AgentEditor agent={editor.agent} onSave={save} onClose={() => setEditor(null)} />}
    {sharing && <ShareAgent agent={sharing} onClose={() => setSharing(null)} />}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
    <Feedback message={status} tone="success" toast onDismiss={() => setStatus('')} />
  </div>;
}
