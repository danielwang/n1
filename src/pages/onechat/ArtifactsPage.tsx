import { Input } from '../../components/ui/input';
import { useEffect, useId, useRef, useState } from 'react';
import { Archive, ArchiveRestore, Bell, Menu, Search, Share, X } from '../../components/ui/solar-icons';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Feedback } from '../../components/ui/feedback';
import { NativeSelect } from '../../components/ui/native-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useNotifications } from '../../components/notifications/NotificationProvider';
import { SidebarContent } from './ChatShell';
import { useAgentNavigation } from './AgentNavigationState';
import type { ChatAgent } from './agent-data';
import type { Conversation } from './data';
import moreActionsIcon from '../../assets/onechat/more-actions.svg';
import { artifactFilters, artifacts, formatArtifactDate, readArchivedArtifactIds, sharedArtifacts, writeArchivedArtifactIds, type Artifact, type ArtifactFilter } from './artifact-data';
import './artifacts.css';

const collections = ['mine', 'shared', 'archive'] as const;
type ArtifactCollection = typeof collections[number];

const artifactSorts = {
  newest: { label: 'Newest first', compare: (a: Artifact, b: Artifact) => b.updatedAt.localeCompare(a.updatedAt) },
  oldest: { label: 'Oldest first', compare: (a: Artifact, b: Artifact) => a.updatedAt.localeCompare(b.updatedAt) },
  titleAsc: { label: 'Title A–Z', compare: (a: Artifact, b: Artifact) => a.title.localeCompare(b.title) },
  titleDesc: { label: 'Title Z–A', compare: (a: Artifact, b: Artifact) => b.title.localeCompare(a.title) },
};
type ArtifactSort = keyof typeof artifactSorts;

function ArtifactCard({ artifact, onOpen, onShare, onArchive, onRestore }: {
  artifact: Artifact;
  onOpen: () => void;
  onShare?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
}) {
  const actions = useRef<HTMLButtonElement>(null);
  const shareOnClose = useRef(false);
  const actionsLabel = `Actions for ${artifact.title}`;

  return <article className="af-card" aria-label={artifact.title}>
    <div className="af-card-heading"><img src={artifact.icon} width={40} height={40} alt="" />
      <div><h2><Button id={`af-preview-${artifact.id}`} className="af-card-open" onClick={onOpen} aria-label={`Preview ${artifact.title}`}>{artifact.title}</Button></h2><p>{artifact.type}</p></div>
    </div>
    <p className="af-description">{artifact.description}</p>
    <div className="af-card-footer">
      <time dateTime={artifact.updatedAt}>{formatArtifactDate(artifact.updatedAt)}</time>
      {(onShare || onArchive || onRestore) && <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button ref={actions} className="af-card-actions oc-card-action-trigger" size="icon" aria-label={actionsLabel}>
            <img src={moreActionsIcon} width={16} height={16} alt="" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="oc-card-actions-menu" aria-label={actionsLabel} align="end" sideOffset={4}
          onCloseAutoFocus={event => {
            if (!shareOnClose.current) return;
            shareOnClose.current = false;
            event.preventDefault();
            actions.current?.focus();
            onShare?.();
          }}>
          <DropdownMenuGroup>
            {onShare && <DropdownMenuItem className="ui-button" onSelect={() => { shareOnClose.current = true; }}><Share size={16} />Share</DropdownMenuItem>}
            {onArchive && <DropdownMenuItem className="ui-button" onSelect={onArchive}><Archive size={16} />Archive</DropdownMenuItem>}
            {onRestore && <DropdownMenuItem className="ui-button" onSelect={onRestore}><ArchiveRestore size={16} />Restore</DropdownMenuItem>}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>}
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
      <Input autoFocus ref={input} id={id} type="email" required value={email} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={event => { setEmail(event.target.value); setError(''); setPreview(''); }} />
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
  const [tab, setTab] = useState<ArtifactCollection>('mine');
  const [filter, setFilter] = useState<ArtifactFilter>('All');
  const [sort, setSort] = useState<ArtifactSort>('newest');
  const [query, setQuery] = useState('');
  const [archivedIds, setArchivedIds] = useState(readArchivedArtifactIds);
  const [archiveFeedback, setArchiveFeedback] = useState<{ message: string; tone: 'success' | 'error' } | null>(null);
  const [selected, setSelected] = useState<Artifact | null>(null);
  const [sharing, setSharing] = useState<Artifact | null>(null);
  const [info, setInfo] = useState<{ title: string; message: string } | null>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const searchId = useId();
  useEffect(() => {
    const previous = document.title; document.title = 'Artifacts · Aqua University';
    return () => { document.title = previous; };
  }, []);
  const tabLabels = { mine: 'My Artifacts', shared: `Shared With Me (${sharedArtifacts.length})`, archive: `Archive (${archivedIds.length})` };
  const collection = tab === 'shared' ? sharedArtifacts : artifacts.filter(item => archivedIds.includes(item.id) === (tab === 'archive'));
  const searchTerm = query.trim().toLowerCase();
  const visible = collection.filter(item => {
    const matchesType = filter === 'All' || item.type === filter || item.categories.includes(filter);
    return matchesType && `${item.title} ${item.type} ${item.description}`.toLowerCase().includes(searchTerm);
  }).sort(artifactSorts[sort].compare);

  const changeArchived = (artifact: Artifact, archived: boolean) => {
    try {
      const storedIds = readArchivedArtifactIds();
      const nextIds = archived ? [...new Set([...storedIds, artifact.id])] : storedIds.filter(id => id !== artifact.id);
      writeArchivedArtifactIds(nextIds);
      const index = visible.indexOf(artifact);
      const neighbor = visible[index + 1] ?? visible[index - 1];
      const nextFocus = neighbor && document.getElementById(`af-preview-${neighbor.id}`);
      (nextFocus || tabs.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]'))?.focus();
      setArchivedIds(nextIds);
      setArchiveFeedback({
        message: archived ? `“${artifact.title}” moved to Archive.` : `“${artifact.title}” restored to My Artifacts.`,
        tone: 'success',
      });
    } catch {
      setArchiveFeedback({ message: `Couldn’t ${archived ? 'archive' : 'restore'} this artifact. Try again.`, tone: 'error' });
    }
  };
  const newChat = () => { window.location.hash = '/onechat'; };
  const openConversation = (conversation: Conversation) => { navigation.setPendingConversation(conversation); newChat(); };
  const openAgent = (agent: ChatAgent) => { navigation.setAgent(agent); window.location.hash = '/onechat/agent'; };
  const sidebarProps = { onNewChat: newChat, onSelect: openConversation, onInfo: setInfo, onSelectAgent: openAgent, onNotifications: notifications.open, unreadCount: notifications.unreadCount, notificationsOpen: notifications.isOpen };
  const reset = () => { setQuery(''); setFilter('All'); search.current?.focus(); };
  return <div className={`onechat artifacts-page ${collapsed ? 'oc-is-collapsed' : ''}`}>
    <a className="oc-skip-link" href="#af-main" onClick={event => { event.preventDefault(); document.getElementById('af-main')?.focus(); }}>Skip to artifacts</a>
    <aside className="oc-sidebar" aria-label="Chat sidebar"><SidebarContent {...sidebarProps} collapsed={collapsed} onClose={() => setCollapsed(value => !value)} /></aside>
    <main className="oc-main af-main" id="af-main" tabIndex={-1}>
      <div className="af-responsive-toolbar">
        <Button className="oc-mobile-menu" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={22} /></Button>
        {collapsed && <Button className="oc-desktop-menu" size="icon" aria-label="Expand navigation" onClick={() => setCollapsed(false)}><Menu size={22} /></Button>}
        <Button size="icon" className="nf-compact-trigger" aria-label={`Notifications, ${notifications.unreadCount} unread`} aria-haspopup="dialog" aria-expanded={notifications.isOpen} onClick={notifications.open}><Bell size={20} /></Button>
      </div>
      <div className="af-content">
        <header className="af-heading"><h1>Artifacts</h1><p>Browse and manage your artifacts</p></header>
        <Tabs value={tab} onValueChange={value => {
          setTab(value as ArtifactCollection);
          setArchiveFeedback(null);
        }}>
          <TabsList className="af-tabs" ref={tabs} aria-label="Artifact collections">
            {collections.map(value => <TabsTrigger key={value} className="ui-button" value={value}>{tabLabels[value]}</TabsTrigger>)}
          </TabsList>
          {collections.map(value => <TabsContent key={value} value={value} className="af-panel" tabIndex={-1}>
            {value === tab && <>
              <div className="af-controls">
                <div className="af-search-field">
                  <label htmlFor={searchId}>Search artifacts</label>
                  <span className="af-search">
                    <Search size={20} />
                    <Input unstyled ref={search} id={searchId} value={query} onChange={event => setQuery(event.target.value)} />
                    {query && <Button size="icon" aria-label="Clear artifact search" onClick={() => { setQuery(''); search.current?.focus(); }}><X size={18} /></Button>}
                  </span>
                </div>
                <label className="af-select-field">
                  <span>Artifact type</span>
                  <NativeSelect controlSize="small" value={filter} onChange={event => setFilter(event.target.value as ArtifactFilter)}>
                    {artifactFilters.map(type => <option key={type} value={type}>{type === 'All' ? 'All types' : type}</option>)}
                  </NativeSelect>
                </label>
                <label className="af-select-field">
                  <span>Sort by</span>
                  <NativeSelect controlSize="small" value={sort} onChange={event => setSort(event.target.value as ArtifactSort)}>
                    {Object.entries(artifactSorts).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
                  </NativeSelect>
                </label>
              </div>
              <Feedback message={archiveFeedback?.message ?? ''} tone={archiveFeedback?.tone} />
              <p className="af-count" role="status">{visible.length} {visible.length === 1 ? 'artifact' : 'artifacts'}</p>
              {visible.length > 0 ? <div className="af-grid">
                {visible.map(artifact => <ArtifactCard key={artifact.id} artifact={artifact}
                  onOpen={() => artifact.id === 'interactive-demo' ? window.location.hash = '/onechat/artifacts/interactive-demo' : setSelected(artifact)}
                  onShare={tab === 'mine' ? () => setSharing(artifact) : undefined}
                  onArchive={tab === 'mine' ? () => changeArchived(artifact, true) : undefined}
                  onRestore={tab === 'archive' ? () => changeArchived(artifact, false) : undefined} />)}
              </div> : <div className="af-empty">
                {collection.length === 0 ? <>
                  <h2>{tab === 'archive' ? 'No archived artifacts' : 'No artifacts in this collection'}</h2>
                  <p>{tab === 'archive' ? 'Artifacts you archive from My Artifacts will appear here.' : 'Archived artifacts can be restored from the Archive tab.'}</p>
                </> : <>
                  <h2>No matching artifacts</h2><p>Try another search or artifact type.</p>
                  <Button variant="outline" onClick={reset}>Clear filters</Button>
                </>}
              </div>}
            </>}
          </TabsContent>)}
        </Tabs>
      </div>
    </main>
    {mobileOpen && <Dialog title="Navigation" hideHeading className="oc-navigation-dialog" onClose={() => setMobileOpen(false)}>{close => <div className="oc-sidebar-content"><SidebarContent {...sidebarProps} mobile onClose={close} /></div>}</Dialog>}
    {selected && <Dialog title={selected.title} onClose={() => setSelected(null)} className="af-dialog">
      <div className="af-preview-meta"><img src={selected.icon} width={40} height={40} alt="" /><div><strong>{selected.type}</strong><p><time dateTime={selected.updatedAt}>{formatArtifactDate(selected.updatedAt)}</time></p></div></div>
      <p className="af-preview-summary">{selected.description}</p>
      <p className="af-preview-note">Local prototype preview. The original file contents are not included; this preview shows only the title and summary supplied in the design.</p>
    </Dialog>}
    {sharing && <ShareArtifact artifact={sharing} onClose={() => setSharing(null)} />}
    {info && <Dialog title={info.title} onClose={() => setInfo(null)}><p>{info.message}</p></Dialog>}
  </div>;
}
