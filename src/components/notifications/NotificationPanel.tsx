import { useRef, useState } from 'react';
import { ArrowLeft, Bell, Check, FileText, Gauge, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog } from '../ui/dialog';
import { notificationTypes, type NotificationItem, type NotificationScope, type NotificationType } from './data';
import bell from '../../assets/notifications/bell.svg';
import closeIcon from '../../assets/notifications/close.svg';
import settings from '../../assets/notifications/settings.svg';
import bot from '../../assets/notifications/bot.svg';
import api from '../../assets/notifications/api.svg';
import emptyMailbox from '../../assets/notifications/empty-mailbox.svg';
import './notifications.css';

interface NotificationPanelProps {
  items: NotificationItem[];
  readIds: string[];
  mutedTypes: NotificationType[];
  persistent: boolean;
  onClose: () => void;
  onRead: (id: string, read: boolean) => void;
  onReadAll: (ids: string[]) => void;
  onToggleType: (type: NotificationType) => void;
}

function NotificationIcon({ item }: { item: NotificationItem }) {
  if (item.person) return <span className="nf-avatar nf-avatar--person" aria-hidden="true">{item.person.initials}</span>;
  if (item.type === 'model-availability') return <span className="nf-avatar" aria-hidden="true"><img src={bot} alt="" draggable={false} /></span>;
  if (item.type === 'model-fallback') return <span className="nf-avatar nf-avatar--api" aria-hidden="true"><img src={api} alt="" draggable={false} /></span>;
  const Icon = item.type === 'content-filter' ? ShieldAlert : item.type === 'moderation' ? ShieldCheck : item.type === 'budget-threshold' ? Gauge : FileText;
  return <span className={`nf-avatar nf-avatar--${item.type}`} aria-hidden="true"><Icon size={24} /></span>;
}

export function NotificationPanel({ items, readIds, mutedTypes, persistent, onClose, onRead, onReadAll, onToggleType }: NotificationPanelProps) {
  const [scope, setScope] = useState<NotificationScope>('me');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLButtonElement | null>(null);
  const selected = items.find(item => item.id === selectedId);
  const scopeItems = items.filter(item => item.scope === scope);
  const visible = scopeItems.filter(item => !unreadOnly || !readIds.includes(item.id));
  const unread = (target: NotificationScope) => items.filter(item => item.scope === target && !readIds.includes(item.id)).length;
  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus());
  const back = () => {
    setSelectedId(null); setPreferences(false);
    requestAnimationFrame(() => {
      if (lastItemRef.current?.isConnected) lastItemRef.current.focus();
      else tabsRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
    });
  };

  return <Dialog title="Notifications" hideHeading className="notification-panel" onClose={onClose}>{close => <>
    <header className="nf-header">
      <img src={bell} alt="" draggable={false} />
      <span className="nf-title">Notifications</span>
      <Button size="icon" aria-label="Close notifications" onClick={close}><img src={closeIcon} alt="" draggable={false} /></Button>
    </header>
    <div className="nf-content">
      {selected ? <section className="nf-detail">
        <Button className="nf-back" onClick={back}><ArrowLeft size={16} />Back to notifications</Button>
        <div className="nf-detail-icon"><NotificationIcon item={selected} /><span>{notificationTypes[selected.type]}</span></div>
        <h2 ref={headingRef} tabIndex={-1}>{selected.title}</h2>
        <p className="nf-time">{selected.time} · Demo event</p>
        <p>{selected.details}</p>
        <dl>{selected.context.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl>
        <div className="nf-next"><h3>Suggested next step</h3><p>{selected.nextStep}</p></div>
        {selected.type === 'release' && <a className="nf-release-link" href="#/release-notes" onClick={onClose}>Read release notes <span aria-hidden="true">↗</span></a>}
        <Button variant="outline" className="nf-read-toggle" onClick={() => {
          const read = !readIds.includes(selected.id); onRead(selected.id, read); setAnnouncement(`Notification marked as ${read ? 'read' : 'unread'}.`);
        }}>{readIds.includes(selected.id) ? <><Bell size={16} />Mark as unread</> : <><Check size={16} />Mark as read</>}</Button>
      </section> : preferences ? <section className="nf-preferences">
        <Button className="nf-back" onClick={back}><ArrowLeft size={16} />Back to notifications</Button>
        <h2 ref={headingRef} tabIndex={-1}>Notification preferences</h2>
        <p>Choose which types appear in this demo. {persistent ? 'Changes are saved on this device.' : 'Browser storage is unavailable; changes last for this session.'} No email or server settings are changed.</p>
        <fieldset><legend>Show these notification types</legend>{(Object.entries(notificationTypes) as [NotificationType, string][]).map(([type, label]) => <label key={type}>
          <input type="checkbox" checked={!mutedTypes.includes(type)} onChange={() => { onToggleType(type); setAnnouncement(persistent ? 'Notification preferences saved on this device.' : 'Notification preferences updated for this session.'); }} />
          <span>{label}</span>
        </label>)}</fieldset>
      </section> : <>
        <div ref={tabsRef} className="nf-tabs" role="tablist" aria-label="Notification inbox" onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 'me' : event.key === 'End' ? 'admin' : scope === 'me' ? 'admin' : 'me';
          setScope(next); setAnnouncement('');
          tabsRef.current?.querySelector<HTMLButtonElement>(`#nf-tab-${next}`)?.focus();
        }}>{(['me', 'admin'] as const).map(target => <Button key={target} id={`nf-tab-${target}`} role="tab" aria-selected={scope === target} aria-controls="nf-inbox" tabIndex={scope === target ? 0 : -1}
          onClick={() => { setScope(target); setAnnouncement(''); }}>{target === 'me' ? 'Me' : 'Admin'}{unread(target) > 0 && ` (${unread(target)})`}</Button>)}</div>
        <div className="nf-list-tools"><span>Demo inbox</span><label><input type="checkbox" checked={unreadOnly} onChange={event => { setUnreadOnly(event.target.checked); setAnnouncement(''); }} />Unread only</label></div>
        <section id="nf-inbox" role="tabpanel" aria-labelledby={`nf-tab-${scope}`} className="nf-inbox" tabIndex={0}>
          {visible.length ? <ul className="nf-list">{visible.map(item => {
            const isUnread = !readIds.includes(item.id);
            return <li key={item.id}><Button className="nf-item" data-unread={isUnread} aria-label={`${item.title}. ${isUnread ? 'Unread' : 'Read'}. ${item.time}`} onClick={event => {
              lastItemRef.current = event.currentTarget; setSelectedId(item.id); onRead(item.id, true); setAnnouncement(''); focusHeading();
            }}><NotificationIcon item={item} /><span className="nf-item-copy"><span className="nf-item-title">{item.title}</span><span className="nf-time">{item.time}</span></span>{isUnread && <span className="nf-unread-dot" aria-hidden="true" />}</Button></li>;
          })}</ul> : <div className="nf-empty"><img src={emptyMailbox} alt="" draggable={false} /><p>Nothing new here, enjoy the quiet!</p><span>{unreadOnly ? 'You’re all caught up on unread notifications.' : 'No notifications to show with your current preferences.'}</span></div>}
        </section>
      </>}
    </div>
    <footer className="nf-footer">
      <div className="nf-footer-actions"><Button className="nf-mark-all" disabled={preferences || scopeItems.every(item => readIds.includes(item.id))} onClick={() => {
        onReadAll(scopeItems.map(item => item.id)); setAnnouncement(`All ${scope === 'me' ? 'personal' : 'admin'} notifications marked as read.`);
      }}>Mark all as read</Button><Button size="icon" aria-label="Notification preferences" aria-pressed={preferences} onClick={() => { setSelectedId(null); setPreferences(!preferences); focusHeading(); }}><img src={settings} alt="" draggable={false} /></Button></div>
      <p>Local demo · {persistent ? 'Saved on this device' : 'This session only'}</p>
      <span className="oc-sr-only" role="status" aria-live="polite">{announcement}</span>
    </footer>
  </>}</Dialog>;
}

export function ReleaseNotesPage() {
  return <main className="nf-release-page"><a className="nf-release-back" href="#/onechat"><ArrowLeft size={16} />Back to ONEchat</a><span className="nf-release-eyebrow">PROTOTYPE RELEASE NOTES</span><h1>A clearer notification center</h1><p className="nf-release-date">24 October 2026 · Local demo release</p><p>Keep track of personal updates and workspace issues without losing your place in a conversation.</p><h2>What’s included</h2><ul><li>Separate personal and admin inboxes with live unread counts.</li><li>Budget, content filtering, feedback, moderation, model availability, fallback, and release notifications.</li><li>Read/unread controls and preferences saved in your browser.</li><li>Keyboard navigation, focus restoration, and reduced-motion support.</li></ul><p className="nf-release-demo">These notes describe this prototype. Notifications, models, budgets, and moderation events are fictional examples; no live services are connected.</p></main>;
}
