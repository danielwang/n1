import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from './solar-icons';

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Keep existing select geometry and surrounding icons on migrated screens. */
  unstyled?: boolean;
  controlSize?: 'medium' | 'small';
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, unstyled = false, controlSize = 'medium', ...props }, ref) => {
    const select = <select
      ref={ref}
      data-slot="native-select"
      className={unstyled ? className : cn(
        'w-full min-w-0 appearance-none rounded-lg border border-input bg-background px-[14px] pr-10 text-sm leading-[22px] text-foreground outline-none',
        'hover:border-foreground focus:border-2 focus:border-[var(--field-focus)] disabled:cursor-not-allowed disabled:bg-muted disabled:text-[#919eab] disabled:hover:border-input aria-invalid:border-2 aria-invalid:border-destructive',
        controlSize === 'small' ? 'h-10' : 'h-[54px]',
        className,
      )}
      {...props}
    >{children}</select>;

    if (unstyled) return select;
    return <span data-slot="native-select-wrapper" className="relative inline-flex w-full">
      {select}
      <ChevronDown size={20} className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-muted-foreground" />
    </span>;
  },
);
NativeSelect.displayName = 'NativeSelect';
