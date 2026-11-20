import type { ComponentProps } from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { cn } from '../../lib/utils';
import checkboxOff from '../../assets/forms/checkbox-off.svg';
import checkboxOn from '../../assets/forms/checkbox-on.svg';

export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return <CheckboxPrimitive.Root data-slot="checkbox"
    className={cn('group relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-2 outline-none after:absolute after:-inset-0.5 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent', className)}
    {...props}>
    <img src={checkboxOff} alt="" width="24" height="24" className="group-data-[state=checked]:hidden group-data-[state=indeterminate]:hidden" />
    <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className="grid place-items-center">
      <img src={checkboxOn} alt="" width="24" height="24" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>;
}
