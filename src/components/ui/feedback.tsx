import { useEffect, useState } from 'react';
import { AlertCircle, Check, Info, LoaderCircle, X } from './solar-icons';
import { Button } from './button';
import infoIcon from '../../assets/ui-library/messages/info.svg';
import successIcon from '../../assets/ui-library/messages/success.svg';
import warningIcon from '../../assets/ui-library/messages/warning.svg';
import errorIcon from '../../assets/ui-library/messages/error.svg';
import bannerInfoIcon from '../../assets/ui-library/messages/banner-info.svg';
import bannerSuccessIcon from '../../assets/ui-library/messages/banner-success.svg';
import bannerWarningIcon from '../../assets/ui-library/messages/banner-warning.svg';
import bannerErrorIcon from '../../assets/ui-library/messages/banner-error.svg';
import closeIcon from '../../assets/ui-library/messages/close.svg';

type MessageTone = 'info' | 'success' | 'warning' | 'error';
const messageIcons: Record<MessageTone, string> = { info: infoIcon, success: successIcon, warning: warningIcon, error: errorIcon };
const bannerIcons: Record<MessageTone, string> = { info: bannerInfoIcon, success: bannerSuccessIcon, warning: bannerWarningIcon, error: bannerErrorIcon };

interface FeedbackProps {
  message: string;
  tone?: MessageTone | 'loading';
  toast?: boolean;
  appearance?: 'snackbar' | 'alert' | 'banner';
  actionLabel?: string;
  onAction?: () => void;
  id?: string;
  onDismiss?: () => void;
}

// Preserve outgoing text until its transition finishes; live updates stay immediate.
export function Feedback({ message, tone = 'info', toast = false, appearance, actionLabel, onAction, id, onDismiss }: FeedbackProps) {
  const [lastMessage, setLastMessage] = useState(message);
  useEffect(() => { if (message) setLastMessage(message); }, [message]);
  if (appearance) {
    const severity: MessageTone = tone === 'loading' ? 'info' : tone;
    return <div id={id} className={`ui-message ui-message--${appearance}`} data-tone={severity} role={severity === 'error' ? 'alert' : 'status'}>
      <span className="ui-message-icon" aria-hidden="true"><img src={appearance === 'banner' ? bannerIcons[severity] : messageIcons[severity]} alt="" /></span>
      <span className="ui-message-text">{message}{appearance === 'banner' && actionLabel && onAction && <> — <button type="button" className="ui-message-action" onClick={onAction}>{actionLabel}</button></>}</span>
      {appearance !== 'banner' && actionLabel && onAction && <button type="button" className="ui-message-action" onClick={onAction}>{actionLabel}</button>}
      {onDismiss && <button type="button" className="ui-message-close" aria-label={`Dismiss ${severity} message`} onClick={onDismiss}><img src={closeIcon} alt="" /></button>}
    </div>;
  }
  const Icon = tone === 'error' ? AlertCircle : tone === 'success' ? Check : tone === 'loading' ? LoaderCircle : Info;
  return <div id={id} className={`${toast ? 'toast' : 'oc-feedback'} motion-feedback`} data-visible={Boolean(message)} data-tone={tone}
    role={tone === 'error' ? 'alert' : 'status'} aria-hidden={!message} aria-atomic="true">
    <Icon size={17} className={tone === 'loading' ? 'oc-loading' : undefined} aria-hidden="true" />
    <span>{message || lastMessage}</span>
    {onDismiss && <Button size="icon" aria-label="Dismiss status" onClick={onDismiss}><X size={16} /></Button>}
  </div>;
}
