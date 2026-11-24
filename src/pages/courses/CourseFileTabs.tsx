import { useRef, type KeyboardEvent } from 'react';
import activeIcon from '../../assets/courses/psy201/figma/tab-file-active.svg';
import inactiveIcon from '../../assets/courses/psy201/figma/tab-file-inactive.svg';
import closeIcon from '../../assets/courses/psy201/figma/tab-close.svg';

interface CourseFileTabsProps {
  openFiles: string[];
  selectedMaterial: string | null;
  materials: { id: string; title: string }[];
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export function CourseFileTabs({ openFiles, selectedMaterial, materials, onSelect, onClose }: CourseFileTabsProps) {
  const list = useRef<HTMLDivElement>(null);
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? openFiles.length - 1
      : (index + (event.key === 'ArrowRight' ? 1 : -1) + openFiles.length) % openFiles.length;
    onSelect(openFiles[nextIndex]);
    list.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
  };
  const close = (id: string) => {
    const remaining = openFiles.filter(fileId => fileId !== id);
    const nextSelected = id === selectedMaterial ? remaining[remaining.length - 1] : selectedMaterial;
    onClose(id);
    if (nextSelected) requestAnimationFrame(() => list.current?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')?.focus());
  };

  return <div className="psy-file-tabs" role="tablist" aria-label="Open course files" ref={list}>
    {openFiles.map((id, index) => {
      const file = materials.find(item => item.id === id);
      const selected = id === selectedMaterial;
      return <div key={id} className="psy-file-tab" data-selected={selected} role="presentation">
        <button type="button" className="psy-file-tab-select" role="tab" aria-selected={selected} tabIndex={selected ? 0 : -1}
          onClick={() => onSelect(id)} onKeyDown={event => navigate(event, index)}>
          <img src={selected ? activeIcon : inactiveIcon} alt="" /><span>{file?.title}</span>
        </button>
        <button type="button" className="psy-file-tab-close ui-icon-action" aria-label={`Close ${file?.title}`} onClick={() => close(id)}>
          <img src={closeIcon} alt="" />
        </button>
      </div>;
    })}
  </div>;
}
