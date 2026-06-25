import clsx from 'clsx';
import type { ButtonVariant, ButtonSize } from '../../types';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

/** 按钮组件 */
export default function Button({
  variant = 'primary',
  size = 'default',
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        variant === 'ghost' && 'btn-ghost',
        variant === 'danger' && 'btn-danger',
        size === 'sm' && 'btn-sm',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
