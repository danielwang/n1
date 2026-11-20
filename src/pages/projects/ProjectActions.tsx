import { useRef } from 'react';
import { Archive, ArchiveRestore, MoreHorizontal, Pencil, Trash2 } from '../../components/ui/solar-icons';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';

interface ProjectActionsProps {
  name: string;
  onRename: () => void;
  onDelete: () => void;
  onArchive?: () => void;
  archived?: boolean;
  icon?: string;
  itemLabel?: 'project' | 'course';
  menuSide?: 'top' | 'bottom';
}

export function ProjectActions({ name, onRename, onDelete, onArchive, archived = false, icon, itemLabel = 'project', menuSide = 'bottom' }: ProjectActionsProps) {
  const openingDialog = useRef(false);
  return <DropdownMenu modal={false}>
    <div className="pj-actions">
      <DropdownMenuTrigger asChild><Button size="icon" aria-label={`Actions for ${name}`}>{icon ? <img src={icon} alt="" /> : <MoreHorizontal size={20} />}</Button></DropdownMenuTrigger>
      <DropdownMenuContent className="pj-action-menu" aria-label={`Actions for ${name}`} align="end" side={menuSide} sideOffset={4}
        onCloseAutoFocus={event => { if (openingDialog.current) { event.preventDefault(); openingDialog.current = false; } }}>
        <DropdownMenuItem asChild onSelect={() => { openingDialog.current = true; onRename(); }}><Button><Pencil size={16} />Rename {itemLabel}</Button></DropdownMenuItem>
        {onArchive && <DropdownMenuItem asChild onSelect={onArchive}><Button>{archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}{archived ? 'Restore' : 'Archive'} {itemLabel}</Button></DropdownMenuItem>}
        <DropdownMenuItem asChild onSelect={() => { openingDialog.current = true; onDelete(); }}><Button className="pj-delete-action"><Trash2 size={16} />Delete {itemLabel}</Button></DropdownMenuItem>
      </DropdownMenuContent>
    </div>
  </DropdownMenu>;
}
