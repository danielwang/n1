import { useEffect, useId, useRef, useState } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Feedback } from '../../components/ui/feedback';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { Asset, SidebarContent } from './OneChatPage';
import { useAgentNavigation } from './AgentNavigationState';
import type { ChatAgent } from './agent-data';
import type { Conversation } from './data';
import shareIcon from '../../assets/onechat/directory/share.svg';
import { artifactFilters, artifacts, sharedArtifacts, type Artifact, type ArtifactFilter } from './artifact-data';
import './artifacts.css';

function ArtifactCard({ artifact, onOpen, onShare }: { artifact: Artifact; onOpen: () => void; onShare?: () => void }) {
  return <article className="af-card" aria-label={artifact.title}>
    <div className="af-card-heading"><img src={artifact.icon} width={40} height={40} alt="" />
      <div><h2><Button className="af-card-open" onClick={onOpen} aria-label={`Preview ${artifact.title}`}>{artifact.title}</Button></h2><p>{artifact.type}</p></div>
    </div>
    <p className="af-description">{artifact.description}</p>
    <div className="af-card-footer"><span>{artifact.updated}</span>
      {onShare && <Button className="af-share" size="icon" aria-label={`Share ${artifact.title}`} onClick={onShare}><Asset src={shareIcon} /></Button>}
    </div>
  </article>;
}

function ShareArtifact({ artifact, onClose }: { artifact: Artifact; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  return <Dialog title={`Share ${artifact.title}`} onClose={onClose} className="af-dialog">
    <form className="af-share-form" noValidate onSubmit={event => {
      event.preventDefault();
      if (!email.trim() || !input.current?.validity.valid) { setError('Enter a valid email address.'); setPreview(''); input.current?.focus(); return; }
      setError(''); setPreview(`Demo invitation preview: ${artifact.title} would be shared with ${email.trim()}. No invitation has been sent.`);
    }}>
      <p>Preview sharing this artifact with a colleague. Sharing is simulated; no email is sent and no access permissions change.</p>
      <label htmlFor={id}>Email address</label>
      <input autoFocus ref={input} id={id} type="email" required value={email} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={event => { setEmail(event.target.value); setError(''); setPreview(''); }} />
      <Feedback id={`${id}-error`} message={error} tone="error" />
      <Feedback message={preview} tone="success" />
      <div className="af-dialog-actions"><Button variant="default" type="submit">Preview invitation</Button></div>
    </form>
  </Dialog>;
}

export function ArtifactsPage() {
  const navigation = useAgentNavigation();
  const notifications = useNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState<'mine' | 'shared'>('mine');
  const [filter, setFilter] = useState<ArtifactFilter>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Artifact | null>(null);
  const [sharing, setSharing] = useState<Artifact | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const previous = document.title; document.title = 'Artifacts · Aqua University';
    return () => { document.title = previous; };
  }, []);
  const collection = tab === 'mine' ? artifacts : sharedArtifacts;
  const visible = collection.filter(item => (filter === 'All' || item.categories.includes(filter)) && `${item.title} ${item.type} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const newChat = () => { window.location.hash = '/onechat'; };
  const openConversation = (conversation: Conversation) => { navigation.setPendingConversation(conversation); newChat(); };
  const openAgent = (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; };
  const sidebarProps = { onNewChat: newChat, onSelect: openConversation, onInfo: setInfo, onSelectAgent: openAgent, onNotifications: notifications.open, unreadCount: notifications.unreadCount, notificationsOpen: notifications.isOpen };
  const reset = () => { setQuery(''); setFilter('All'); search.current?.focus(); };
  const selectTab = (next: 'mine' | 'shared') => { setTab(next); setFilter('All'); };
  return <div className={`onechat artifacts-page ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a className="oc-skip-link" href="#af-main" onClick={event => { event.preventDefault(); document.getElementById('af-main')?.focus(); }}>Skip to artifacts</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar" hidden={collapsed}><SidebarContent {...sidebarProps} onClose={() => setCollapsed(true)} /></aside>
    <main className="oc-main af-main" id="af-main" tabIndex={-1}>
      <div className="af-responsive-toolbar">
        <Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
        {collapsed && <Button className="oc-desktop-menu" size="icon" aria-label="Expand navigation" onClick={() => setCollapsed(false)}><Menu size={22} /></Button>}
        <Button size="icon" className="nf-compact-trigger" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button>
      </div>
      <div className="af-content">
        <header className="af-heading"><h1>Artifacts</h1><p>Browse and manage your artifacts</p></header>
        <div className="af-tabs" ref={tabs} role="tablist" aria-label="Artifact collections" onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 'mine' : event.key === 'End' ? 'shared' : tab === 'mine' ? 'shared' : 'mine';
          selectTab(next); tabs.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
        }}>
          <Button id="af-tab-mine" role="tab" data-tab="mine" aria-controls="af-panel" aria-selected={tab === 'mine'} tabIndex={tab === 'mine' ? 0 : -1} onClick={() => selectTab('mine')}>My Artifacts</Button>
          <Button id="af-tab-shared" role="tab" data-tab="shared" aria-controls="af-panel" aria-selected={tab === 'shared'} tabIndex={tab === 'shared' ? 0 : -1} onClick={() => selectTab('shared')}>Shared With Me ({sharedArtifacts.length})</Button>
        </div>
        <div id="af-panel" role="tabpanel" aria-labelledby={`af-tab-${tab}`}>
          <div className="af-controls">
            <div className="af-filters" role="group" aria-label="Artifact type">{artifactFilters.map(item => <Button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</Button>)}</div>
            <div className="af-search"><Search size={20} aria-hidden="true" /><input ref={search} aria-label="Search artifacts" placeholder="Search..." value={query} onChange={event => setQuery(event.target.value)} />{query && <Button size="icon" aria-label="Clear artifact search" onClick={() => { setQuery(''); search.current?.focus(); }}><X size={18} /></Button>}</div>
          </div>
          {visible.length ? <div className="af-grid">{visible.map(artifact => <ArtifactCard key={artifact.id} artifact={artifact} onOpen={() => setSelected(artifact)} onShare={tab === 'mine' ? () => setSharing(artifact) : undefined} />)}</div> : <div className="af-empty"><h2>No artifacts found</h2><p>{filter === 'Images' && !query ? 'There are no image artifacts in this sample collection.' : 'Try another search or artifact type.'}</p><Button variant="outline" onClick={reset}>Reset filters</Button></div>}
        </div>
        <span className="oc-sr-only" role="status">{visible.length} {visible.length === 1 ? 'artifact' : 'artifacts'} shown.</span>
      </div>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {selected && <Dialog title={selected.title} onClose={() => setSelected(null)} className="af-dialog">
      <div className="af-preview-meta"><img src={selected.icon} width={40} height={40} alt="" /><div><strong>{selected.type}</strong><p>{selected.updated}</p></div></div>
      <p className="af-preview-summary">{selected.description}</p>
      <p className="af-preview-note">Local prototype preview. The original file contents are not included; this preview shows only the title and summary supplied in the design.</p>
    </Dialog>}
    {sharing && <ShareArtifact artifact={sharing} onClose={() => setSharing(null)} />}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
