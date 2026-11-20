import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Preserve legacy field styling while migrating existing screens. */
  unstyled?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, unstyled = false, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={unstyled ? className : cn(
        'h-10 w-full min-w-0 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-text)]',
        'placeholder:text-[var(--color-text-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
        'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--color-error)]',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
