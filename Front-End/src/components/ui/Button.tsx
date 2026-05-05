import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-brand text-white shadow-button hover:bg-brand/90 disabled:bg-brand/35',
    secondary: 'border border-line bg-white text-cocoa hover:border-cocoa/40 disabled:text-cocoa/35',
    ghost: 'text-cocoa hover:bg-blush/40 disabled:text-cocoa/35',
  };

  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-bold transition disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
