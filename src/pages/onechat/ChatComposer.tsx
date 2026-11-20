import { Textarea } from '../../components/ui/textarea';
import type { FormEvent, ReactNode, RefObject } from 'react';
import { ArrowUp, LoaderCircle } from '../../components/ui/solar-icons';
import { Button } from '../../components/ui/button';
import { assets } from './assets';
import phiShield from '../../assets/onechat/phi-shield.svg';
import phiH from '../../assets/onechat/phi-h.svg';
import phiLine from '../../assets/onechat/phi-line.svg';

const rotatingPrompts = [
  'Let’s discover what only you could ask',
  'Need specialist help? Type @ to add an agent',
  'Do not use PHI data in this prompt field',
] as const;

function PhiReminderIcon() {
  return <span className="oc-phi-icon">
    <img src={phiShield} alt="" className="oc-phi-shield" />
    <img src={phiH} alt="" className="oc-phi-h" />
    <img src={phiLine} alt="" className="oc-phi-line" />
  </span>;
}

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onAttach: () => void;
  onDictate: () => void;
  onVoice?: () => void;
  inputRef?: RefObject<HTMLTextAreaElement>;
  placeholder: string;
  error?: string;
  errorId?: string;
  busy?: boolean;
  emptyAction?: 'voice' | 'send';
  sendIcon?: ReactNode;
  className?: string;
}

export function ChatComposer({ value, onChange, onSubmit, onAttach, onDictate, onVoice, inputRef, placeholder, error, errorId, busy = false, emptyAction = 'voice', sendIcon, className = '' }: ChatComposerProps) {
  const showSend = value.length > 0 || emptyAction === 'send';
  const hasRotatingHints = emptyAction === 'voice' && placeholder === rotatingPrompts[0];
  const rotatePlaceholder = !value && hasRotatingHints;
  return <form className={`oc-composer ${error ? 'oc-composer-error' : ''} ${rotatePlaceholder ? 'oc-composer--rotating' : ''} ${className}`} onSubmit={onSubmit} aria-label="Chat prompt" aria-busy={busy}>
    <Button size="icon" className="oc-attach" aria-label="Attach a file" title="Attach a file" onClick={onAttach}><img className="oc-asset" src={assets.plus} alt="" /></Button>
    <Textarea unstyled ref={inputRef} aria-label="Message" aria-description={hasRotatingHints ? 'Need specialist help? Type @ to add an agent. Do not use PHI data in this prompt field.' : undefined} placeholder={placeholder} rows={1} maxLength={4000} value={value} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}
      onChange={event => onChange(event.target.value)}
      onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
    {rotatePlaceholder && <span className="oc-rotating-placeholder" aria-hidden="true">
      <span className="oc-rotating-placeholder-track">
        {[...rotatingPrompts, rotatingPrompts[0]].map((text, index) => <span className="oc-rotating-placeholder-line" key={index}>
          {index === 2 && <PhiReminderIcon />}<span>{text}</span>
        </span>)}
      </span>
    </span>}
    <div className="oc-composer-actions">
      <Button size="icon" aria-label="Dictate a message" title="Dictate a message" onClick={onDictate}><span className="oc-mic"><img className="oc-asset" src={assets.microphone} alt="" /></span></Button>
      {showSend ? <Button variant="default" size="icon" className="oc-send" type="submit" disabled={busy} aria-label={busy ? 'Sending message' : 'Send message'}>{busy ? <LoaderCircle className="oc-loading" size={20} /> : sendIcon ?? <ArrowUp size={20} />}</Button> :
        <Button size="icon" className="oc-voice" aria-label="Start voice chat" title="Start voice chat" onClick={onVoice}><img className="oc-asset" src={assets.voiceBackground} alt="" /><img className="oc-asset" src={assets.soundwave} alt="" /></Button>}
    </div>
  </form>;
}
