import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface DialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode | ((close: () => void) => ReactNode);
  className?: string;
  hideHeading?: boolean;
}

// Native dialog supplies focus containment, Escape, and return-to-trigger focus.
export function Dialog({ title, onClose, children, className = '', hideHeading = false }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number>();
  const requestClose = () => {
    if (closing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.input === 'keyboard' || ref.current?.dataset.instant === 'true') {
      onClose();
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 160);
  };
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (dialog) dialog.dataset.instant = String(document.documentElement.dataset.input === 'keyboard');
    dialog?.showModal();
    return () => {
      window.clearTimeout(closeTimer.current);
      dialog?.close();
      if (trigger?.isConnected) trigger.focus();
    };
  }, []);

  return <dialog ref={ref} className={`oc-dialog ${className}`} aria-labelledby={titleId} data-state={closing ? 'closed' : 'open'}
    onTransitionEnd={event => {
      if (closing && event.target === event.currentTarget && event.propertyName === 'opacity') {
        window.clearTimeout(closeTimer.current);
        onClose();
      }
    }}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) requestClose();
    }}>
    {hideHeading ? <h2 id={titleId} className="oc-sr-only">{title}</h2> : <div className="oc-dialog-heading"><h2 id={titleId}>{title}</h2>
      <Button size="icon" aria-label={`Close ${title}`} onClick={requestClose}><X size={20} /></Button>
    </div>}
    {typeof children === 'function' ? children(requestClose) : children}
  </dialog>;
}
