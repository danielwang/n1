import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { demoNotifications, notificationTypes, type NotificationType } from './data';
import { NotificationPanel } from './NotificationPanel';

interface NotificationState {
  readIds: string[];
  mutedTypes: NotificationType[];
}
const storageKey = 'n1-notifications-v1';
function initialState(): NotificationState {
  const fallback = { readIds: demoNotifications.filter(item => item.initialRead).map(item => item.id), mutedTypes: [] };
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (value && typeof value === 'object' && 'readIds' in value && 'mutedTypes' in value && Array.isArray(value.readIds) && Array.isArray(value.mutedTypes)) {
      return { readIds: value.readIds.filter((id): id is string => typeof id === 'string' && demoNotifications.some(item => item.id === id)), mutedTypes: value.mutedTypes.filter((type): type is NotificationType => typeof type === 'string' && Object.prototype.hasOwnProperty.call(notificationTypes, type)) };
    }
  } catch { /* Invalid or unavailable storage falls back to the local demo. */ }
  return fallback;
}

interface NotificationContextValue {
  unreadCount: number;
  open: () => void;
  isOpen: boolean;
}
const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotificationState>(initialState);
  const [isOpen, setOpen] = useState(false);
  const [persistent, setPersistent] = useState(true);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); setPersistent(true); }
    catch { setPersistent(false); }
  }, [state]);
  const items = demoNotifications.filter(item => !state.mutedTypes.includes(item.type));
  const unreadCount = items.filter(item => !state.readIds.includes(item.id)).length;
  return <NotificationContext.Provider value={{ unreadCount, open: () => setOpen(true), isOpen }}>
    {children}
    {isOpen && <NotificationPanel items={items} readIds={state.readIds} mutedTypes={state.mutedTypes} persistent={persistent}
      onClose={() => setOpen(false)}
      onRead={(id, read) => setState(current => ({ ...current, readIds: read ? [...new Set([...current.readIds, id])] : current.readIds.filter(value => value !== id) }))}
      onReadAll={ids => setState(current => ({ ...current, readIds: [...new Set([...current.readIds, ...ids])] }))}
      onToggleType={type => setState(current => ({ ...current, mutedTypes: current.mutedTypes.includes(type) ? current.mutedTypes.filter(value => value !== type) : [...current.mutedTypes, type] }))} />}
  </NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications requires NotificationProvider');
  return context;
}
