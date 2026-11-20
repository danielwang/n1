import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Preserve legacy field styling while migrating existing screens. */
  unstyled?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, unstyled = false, ...props }, ref) => (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={unstyled ? className : cn(
        'min-h-16 w-full min-w-0 rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text)]',
        'placeholder:text-[var(--color-text-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
        'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--color-error)]',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
