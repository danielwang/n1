import { forwardRef, type ButtonHTMLAttributes } from 'react';

// A dependency-free adaptation of the shadcn Button API, using the app's CSS.
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'ghost', size = 'default', type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} data-slot="button"
      className={`ui-button ui-button--${variant} ui-button--size-${size} ${className}`} {...props} />
  ),
);
Button.displayName = 'Button';
