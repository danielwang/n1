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
        'min-h-[98px] w-full min-w-0 rounded-lg border border-input bg-background px-[14px] py-4 text-sm leading-[22px] text-foreground outline-none',
        'placeholder:text-[#919eab] hover:border-foreground focus:border-2 focus:border-[var(--field-focus)]',
        'disabled:cursor-not-allowed disabled:bg-muted disabled:text-[#919eab] disabled:hover:border-input aria-invalid:border-2 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
