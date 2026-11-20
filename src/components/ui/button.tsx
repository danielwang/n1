import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Keep the established CSS classes while using shadcn's variant architecture.
export const buttonVariants = cva('ui-button', {
  variants: {
    variant: {
      default: 'ui-button--default',
      outline: 'ui-button--outline',
      ghost: 'ui-button--ghost',
    },
    size: {
      default: 'ui-button--size-default',
      icon: 'ui-button--size-icon',
      large: 'ui-button--size-large',
      medium: 'ui-button--size-medium',
      small: 'ui-button--size-small',
    },
  },
  defaultVariants: { variant: 'ghost', size: 'default' },
});

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'ghost', size = 'default', type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} data-slot="button" data-variant={variant} data-size={size}
      className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';
