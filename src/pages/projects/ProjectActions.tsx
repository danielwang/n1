import { useEffect, useId, useRef, useState } from 'react';
import { Archive, ArchiveRestore, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function ProjectActions({ name, onRename, onDelete, onArchive, archived = false, icon }: { name: string; onRename: () => void; onDelete: () => void; onArchive?: () => void; archived?: boolean; icon?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const close = () => { setOpen(false); trigger.current?.focus(); };
  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  return <div className="pj-actions" ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }} onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (!open) { setOpen(true); return; }
    const items = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') || []);
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (current + (event.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length;
    items[next]?.focus();
  }}>
    <Button ref={trigger} size="icon" aria-label={`Actions for ${name}`} aria-haspopup="menu" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>{icon ? <img src={icon} alt="" /> : <MoreHorizontal size={20} />}</Button>
    <div id={id} role="menu" aria-label={`Actions for ${name}`} className="pj-action-menu" hidden={!open}>
      <Button role="menuitem" tabIndex={-1} onClick={() => { close(); onRename(); }}><Pencil size={16} />Rename project</Button>
      {onArchive && <Button role="menuitem" tabIndex={-1} onClick={() => { close(); onArchive(); }}>{archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}{archived ? 'Restore project' : 'Archive project'}</Button>}
      <Button role="menuitem" tabIndex={-1} className="pj-delete-action" onClick={() => { close(); onDelete(); }}><Trash2 size={16} />Delete project</Button>
    </div>
  </div>;
}
