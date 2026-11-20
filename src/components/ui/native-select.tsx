import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from './solar-icons';

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Keep existing select geometry and surrounding icons on migrated screens. */
  unstyled?: boolean;
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, unstyled = false, ...props }, ref) => {
    const select = <select
      ref={ref}
      data-slot="native-select"
      className={unstyled ? className : cn(
        'h-10 w-full min-w-0 appearance-none rounded-[var(--radius-control)] border border-[var(--color-border)] bg-white px-3 pr-10 text-sm text-[var(--color-text)]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >{children}</select>;

    if (unstyled) return select;
    return <span data-slot="native-select-wrapper" className="relative inline-flex w-full">
      {select}
      <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
    </span>;
  },
);
NativeSelect.displayName = 'NativeSelect';
