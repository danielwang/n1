import type { ComponentProps } from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '../../lib/utils';
import switchOff from '../../assets/management/instance-settings/switch-off.svg';
import switchOn from '../../assets/forms/switch-on.svg';
import switchThumb from '../../assets/management/instance-settings/switch-thumb.svg';
import switchTick from '../../assets/management/instance-settings/switch-tick.svg';

type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root> & { tone?: 'neutral' | 'dark' };

export function Switch({ className, tone = 'neutral', ...props }: SwitchProps) {
  return <SwitchPrimitive.Root data-slot="switch"
    className={cn('group relative inline-flex size-11 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent', className)}
    {...props}>
    <img src={switchOff} alt="" width="33" height="20" className="group-data-[state=checked]:hidden" />
    <SwitchPrimitive.Thumb data-slot="switch-thumb" className="hidden group-data-[state=checked]:block">
      {tone === 'dark' ? <span className="relative block h-5 w-[33px] rounded-full bg-[#212b36]">
        <img src={switchThumb} alt="" width="14" height="14" className="absolute right-[3px] top-[3px]" />
        <img src={switchTick} alt="" width="12" height="12" className="absolute left-[17px] top-1" />
      </span> : <img src={switchOn} alt="" width="33" height="20" />}
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>;
}
