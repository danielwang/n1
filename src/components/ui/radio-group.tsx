import type { ComponentProps } from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '../../lib/utils';
import radioOff from '../../assets/forms/radio-off.svg';
import radioOn from '../../assets/forms/radio-on.svg';

export function RadioGroup({ className, onKeyDownCapture, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('grid', className)}
    onKeyDownCapture={event => {
      onKeyDownCapture?.(event);
      if (event.defaultPrevented || !['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-slot="radio-group-item"]:not([data-disabled])'));
      const current = items.indexOf(event.target as HTMLButtonElement);
      if (current < 0 || items.length < 2) return;
      // Keep the checked value with roving focus when a controlled group uses arrow keys.
      event.preventDefault();
      event.stopPropagation();
      const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      const next = items[(current + direction + items.length) % items.length];
      next.click();
      next.focus();
    }} {...props} />;
}

export function RadioGroupItem({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return <RadioGroupPrimitive.Item data-slot="radio-group-item"
    className={cn('group relative inline-flex size-10 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-2 outline-none after:absolute after:-inset-0.5 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent', className)}
    {...props}>
    <img src={radioOff} alt="" width="24" height="24" className="group-data-[state=checked]:hidden" />
    <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="grid place-items-center">
      <img src={radioOn} alt="" width="24" height="24" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>;
}
