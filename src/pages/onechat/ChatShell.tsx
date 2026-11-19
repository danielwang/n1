import { useEffect, useRef, useState } from 'react';
import { X } from '../../components/ui/solar-icons';
import { Button } from '../../components/ui/button';
import { assets } from './assets';
import { useBranding } from '../../branding';
import accountPanelTail from '../../assets/onechat/account-panel/bottom-left.svg';
import accountPanelRed from '../../assets/onechat/account-panel/red-blur.svg';
import accountPanelCyan from '../../assets/onechat/account-panel/cyan-blur.svg';
import { managementItems, managementChevron } from '../management/data';
import { conversations, type Conversation } from './data';
import { AgentNavigation } from './AgentNavigation';
import type { ChatAgent } from './agent-data';
import './onechat.css';
import './account-panel.css';

type SidebarMode = 'chats' | 'agents';
export type Info = { title: string; message: string };

function PrimaryNavigation({ currentPath, mobile, onClose, onNewChat }: Pick<SidebarProps, 'mobile' | 'onClose' | 'onNewChat'> & { currentPath: string }) {
  const navigate = (path: string) => {
    window.location.hash = path;
    if (mobile) onClose();
  };
  const current = (path: string) => currentPath.startsWith(path) ? 'page' as const : undefined;

  return <nav className="oc-primary-nav" aria-label="ONEchat navigation">
    <Button className="oc-nav-item" aria-current={currentPath === '#/onechat' || currentPath === '#/onechat/agent' ? 'page' : undefined} onClick={onNewChat}><Asset src={assets.newChat} /><span>New Chat</span></Button>
    <Button className="oc-nav-item" aria-current={current('#/onechat/courses')} onClick={() => navigate('/onechat/courses')}><Asset src={assets.courses} /><span>Courses</span></Button>
    <Button className="oc-nav-item" aria-current={current('#/onechat/artifacts')} onClick={() => navigate('/onechat/artifacts')}><Asset src={assets.artifacts} /><span>Artifacts</span></Button>
    <Button className="oc-nav-item" aria-current={current('#/onechat/projects')} onClick={() => navigate('/onechat/projects')}><Asset src={assets.projects} /><span>Projects</span></Button>
    <Button className="oc-nav-item" aria-current={current('#/onechat/agents')} onClick={() => navigate('/onechat/agents')}><Asset src={assets.explore} /><span>Explore Agents</span></Button>
  </nav>;
}

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
  collapsed?: boolean;
  onNotifications: () => void;
  unreadCount: number;
  notificationsOpen: boolean;
  onSelectAgent: (agent: ChatAgent) => void;
  defaultMode?: SidebarMode;
  management?: boolean;
}

export function SidebarContent({ onNewChat, onSelect, onInfo, onClose, selectedId, mobile, collapsed, onNotifications, unreadCount, notificationsOpen, onSelectAgent, defaultMode = 'chats', management = false }: SidebarProps) {
  const branding = useBranding();
  const [mode, setMode] = useState<SidebarMode>(defaultMode);
  const [archived, setArchived] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.hash);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const accountArea = management ? 'management' : 'chats';
  const accountRef = useRef<HTMLElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const accountFirstActionRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const visible = conversations.filter(item => Boolean(item.archived) === archived && item.title.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    const syncPath = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', syncPath);
    return () => window.removeEventListener('hashchange', syncPath);
  }, []);
  useEffect(() => {
    if (!accountOpen) return;
    accountFirstActionRef.current?.focus();
    const dismissOnOutsideClick = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setAccountOpen(false); accountButtonRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', dismissOnOutsideClick);
    document.addEventListener('keydown', dismissOnEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOnOutsideClick);
      document.removeEventListener('keydown', dismissOnEscape);
    };
  }, [accountOpen]);

  const openAccountAction = (title: 'Settings' | 'Account') => {
    setAccountOpen(false);
    if (title === 'Account') { window.location.hash = '/onechat/account'; return; }
    onInfo({ title, message: `${accountArea === 'chats' ? 'Chat' : 'Management'} settings are simulated in this local prototype. No account service is connected.` });
  };

  return <>
    <Button className="oc-collapse" size="icon" aria-label={mobile ? 'Close navigation' : collapsed ? 'Expand navigation' : 'Collapse navigation'} onClick={onClose}>
      <span className="oc-collapse-disc"><Asset src={assets.collapse} /></span>
    </Button>
    <div className="oc-nav-intro">
    <div className="oc-logo"><img className={branding.sidebarLogo ? 'oc-custom-logo' : undefined} src={branding.sidebarLogo?.dataUrl || assets.logo} alt="Aqua University" width="205.248" height="78.815" /></div>
    {management ? <nav className="mg-nav" aria-label="Management navigation">
      {(['agents', 'admin'] as const).map(group => <div key={group} className="mg-nav-group">
        <h2>{group === 'agents' ? 'Managing Agents' : 'Admin'}</h2>
        {managementItems.filter(item => item.group === group).map(item => <Button key={item.id} className="oc-nav-item mg-nav-item" title={item.label} aria-current={currentPath === `#/onechat/management/${item.id}` || (item.id === 'dashboard' && currentPath === '#/onechat/management') ? 'page' : undefined} onClick={() => { window.location.hash = `/onechat/management/${item.id}`; if (mobile) onClose(); }}><Asset src={item.icon} className={item.id === 'foundry-models' ? 'mg-foundry' : ''} /><span>{item.label}</span>{item.id === 'moderation' && <b className="mg-count" aria-label="12 pending">12</b>}{'hasChildren' in item && item.hasChildren && <Asset src={managementChevron} className="mg-chevron" />}</Button>)}
      </div>)}
    </nav> : <PrimaryNavigation currentPath={currentPath} mobile={mobile} onClose={onClose} onNewChat={onNewChat} />}
    </div>
    {!management && <div className="oc-mode-tabs" data-mode={mode} role="tablist" aria-label="Sidebar content" onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextMode = event.key === 'Home' ? 'chats' : event.key === 'End' ? 'agents' : mode === 'chats' ? 'agents' : 'chats';
      setMode(nextMode);
      event.currentTarget.querySelector<HTMLButtonElement>(`#oc-${nextMode}-${mobile ? 'mobile' : 'desktop'}`)?.focus();
    }}>
      <Button id={`oc-chats-${mobile ? 'mobile' : 'desktop'}`} role="tab" tabIndex={mode === 'chats' ? 0 : -1} aria-selected={mode === 'chats'} aria-controls={`oc-panel-${mobile ? 'mobile' : 'desktop'}`} onClick={() => setMode('chats')}><ChatsIcon />Chats</Button>
      <Button id={`oc-agents-${mobile ? 'mobile' : 'desktop'}`} role="tab" tabIndex={mode === 'agents' ? 0 : -1} aria-selected={mode === 'agents'} aria-controls={`oc-panel-${mobile ? 'mobile' : 'desktop'}`} onClick={() => setMode('agents')}><Asset src={assets.bot} />Agents</Button>
    </div>}
    {!management && <section className={`oc-history ${mode === 'agents' ? 'oc-history--agents' : ''}`} id={`oc-panel-${mobile ? 'mobile' : 'desktop'}`} role="tabpanel" aria-labelledby={`oc-${mode}-${mobile ? 'mobile' : 'desktop'}`}>
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
    </section>}
    <footer className="oc-account" ref={accountRef}>
      {accountOpen && <div className="oc-user-panel" id={`oc-user-panel-${mobile ? 'mobile' : 'desktop'}`} role="group" aria-label="User account" data-node-id="27275:13389">
        <div className="oc-user-panel-paper" aria-hidden="true">
          <div className="oc-user-panel-surface" />
          <span className="oc-user-panel-red"><img src={accountPanelRed} alt="" /></span>
          <span className="oc-user-panel-cyan"><img src={accountPanelCyan} alt="" /></span>
          <img className="oc-user-panel-tail" src={accountPanelTail} alt="" width="24" height="6" />
        </div>
        <div className="oc-user-panel-content">
          <div className="oc-user-panel-identity"><span>Daniel Wang</span><span>dwang@gocloudforce.com</span></div>
          <div className="oc-user-panel-switch" role="group" aria-label="Account area">
            <Button ref={accountFirstActionRef} aria-pressed={accountArea === 'chats'} onClick={() => { setAccountOpen(false); window.location.hash = '/onechat'; }}>Chats</Button>
            <Button aria-pressed={accountArea === 'management'} onClick={() => { setAccountOpen(false); window.location.hash = '/onechat/management/dashboard'; }}>Management</Button>
          </div>
          <div className="oc-user-panel-actions">
            <Button onClick={() => openAccountAction('Settings')}>Settings</Button>
            <Button onClick={() => openAccountAction('Account')}>Account</Button>
            <Button aria-label="Logout (return to demo login)" onClick={() => { setAccountOpen(false); window.location.hash = '/login'; }}>Logout</Button>
          </div>
        </div>
      </div>}
      <Button ref={accountButtonRef} className="oc-account-button" aria-label="Daniel Wang, user account" aria-expanded={accountOpen} aria-controls={accountOpen ? `oc-user-panel-${mobile ? 'mobile' : 'desktop'}` : undefined} onClick={() => setAccountOpen(value => !value)}><span className="oc-avatar" aria-hidden="true">DW</span><span>Daniel Wang</span></Button>
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

