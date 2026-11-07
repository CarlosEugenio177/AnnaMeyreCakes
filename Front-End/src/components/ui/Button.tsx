import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-brand text-white shadow-button hover:brightness-95 disabled:bg-brand/40 disabled:shadow-none',
    secondary: 'border border-line bg-surface text-cocoa hover:border-cocoa/30 disabled:text-cocoa/40',
    ghost: 'text-cocoa hover:bg-blush disabled:text-cocoa/40',
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
