import type { CSSProperties, ReactNode } from 'react';
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
  return <div className={`ui-toggle-button-group ${className}`} style={style} role="group" aria-label={ariaLabel}>
    {options.map(option => <button key={option.value} type="button" aria-pressed={value === option.value} disabled={option.disabled} onClick={() => onValueChange(option.value)}>{option.label}</button>)}
  </div>;
}
