import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface DialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  hideHeading?: boolean;
}

// Native dialog supplies focus containment, Escape, and return-to-trigger focus.
export function Dialog({ title, onClose, children, className = '', hideHeading = false }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (trigger?.isConnected) trigger.focus();
    };
  }, []);

  return <dialog ref={ref} className={`oc-dialog ${className}`} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
    {hideHeading ? <h2 id={titleId} className="oc-sr-only">{title}</h2> : <div className="oc-dialog-heading"><h2 id={titleId}>{title}</h2>
      <Button size="icon" aria-label={`Close ${title}`} onClick={onClose}><X size={20} /></Button>
    </div>}
    {children}
  </dialog>;
}
