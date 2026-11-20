import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Preserve legacy field styling while migrating existing screens. */
  unstyled?: boolean;
  controlSize?: 'medium' | 'small';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, unstyled = false, controlSize = 'medium', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={unstyled ? className : cn(
        'w-full min-w-0 rounded-lg border border-input bg-background px-[14px] text-sm leading-[22px] text-foreground outline-none',
        'placeholder:text-[#919eab] hover:border-foreground focus:border-2 focus:border-[var(--field-focus)]',
        'disabled:cursor-not-allowed disabled:bg-muted disabled:text-[#919eab] disabled:hover:border-input aria-invalid:border-2 aria-invalid:border-destructive',
        controlSize === 'small' ? 'h-10' : 'h-[54px]',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
