import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export const ButtonGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, role = 'group', ...props }, ref) => (
    <div ref={ref} role={role} data-slot="button-group" className={cn('ui-button-group', className)} {...props} />
  ),
);
ButtonGroup.displayName = 'ButtonGroup';
