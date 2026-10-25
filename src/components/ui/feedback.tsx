import { useEffect, useState } from 'react';
import { AlertCircle, Check, Info, LoaderCircle, X } from 'lucide-react';
import { Button } from './button';

interface FeedbackProps {
  message: string;
  tone?: 'info' | 'success' | 'error' | 'loading';
  toast?: boolean;
  id?: string;
  onDismiss?: () => void;
}

// Preserve outgoing text until its transition finishes; live updates stay immediate.
export function Feedback({ message, tone = 'info', toast = false, id, onDismiss }: FeedbackProps) {
  const [lastMessage, setLastMessage] = useState(message);
  useEffect(() => { if (message) setLastMessage(message); }, [message]);
  const Icon = tone === 'error' ? AlertCircle : tone === 'success' ? Check : tone === 'loading' ? LoaderCircle : Info;
  return <div id={id} className={`${toast ? 'toast' : 'oc-feedback'} motion-feedback`} data-visible={Boolean(message)} data-tone={tone}
    role={tone === 'error' ? 'alert' : 'status'} aria-hidden={!message} aria-atomic="true">
    <Icon size={17} className={tone === 'loading' ? 'oc-loading' : undefined} aria-hidden="true" />
    <span>{message || lastMessage}</span>
    {onDismiss && <Button size="icon" aria-label="Dismiss status" onClick={onDismiss}><X size={16} /></Button>}
  </div>;
}
