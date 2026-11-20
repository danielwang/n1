import type { CSSProperties, ReactNode } from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import './toggle-button-group.css';

export interface ToggleButtonOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

interface ToggleButtonGroupProps<T extends string> {
  ariaLabel: string;
  className?: string;
  style?: CSSProperties;
  options: readonly ToggleButtonOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
}

export function ToggleButtonGroup<T extends string>({ ariaLabel, className = '', style, options, value, onValueChange }: ToggleButtonGroupProps<T>) {
  return <ToggleGroupPrimitive.Root type="single" className={`ui-toggle-button-group ${className}`} style={style} aria-label={ariaLabel}
    value={value} onValueChange={next => { if (next) onValueChange(next as T); }}
    onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const enabled = options.filter(option => !option.disabled);
      if (!enabled.length) return;
      event.preventDefault();
      const index = enabled.findIndex(option => option.value === value);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length;
      onValueChange(enabled[next].value);
      event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')[next]?.focus();
    }}>
    {options.map(option => <ToggleGroupPrimitive.Item key={option.value} value={option.value} disabled={option.disabled} aria-label={typeof option.label === 'string' ? option.label : undefined}>{option.label}</ToggleGroupPrimitive.Item>)}
  </ToggleGroupPrimitive.Root>;
}
