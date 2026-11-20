import { type CSSProperties, type KeyboardEvent } from 'react';
import { Button } from '../../components/ui/button';
import { ButtonGroup } from '../../components/ui/button-group';
import type { Panel } from './course-workspace-layout';

interface WorkspacePanelButtonsProps {
  options: readonly { value: Panel; label: string }[];
  value: Panel;
  explorerWidth: number;
  expanded: boolean;
  onValueChange: (value: Panel) => void;
}

export function WorkspacePanelButtons({ options, value, explorerWidth, expanded, onValueChange }: WorkspacePanelButtonsProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || !options.length) return;
    event.preventDefault();
    const current = options.findIndex(option => option.value === value);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
      : (current + (event.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length;
    onValueChange(options[next].value);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  };

  return <div className={`psy-workspace-tabs-row${expanded ? ' psy-workspace-tabs-row--expanded' : ''}`}
    style={{ '--psy-explorer-width': `${explorerWidth}px` } as CSSProperties}>
    <ButtonGroup className="psy-workspace-button-group" aria-label="Workspace panel" onKeyDown={onKeyDown}>
      {options.map(option => <Button key={option.value} variant="ghost" aria-pressed={value === option.value}
        onClick={() => onValueChange(option.value)}>{option.label}</Button>)}
    </ButtonGroup>
  </div>;
}
