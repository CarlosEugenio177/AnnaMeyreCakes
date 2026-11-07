import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
};

export const buttonVariants = {
  primary: 'bg-brand text-white shadow-button hover:-translate-y-0.5 hover:brightness-105 disabled:bg-brand/40 disabled:shadow-none disabled:hover:translate-y-0',
  secondary: 'border-2 border-choco/10 bg-surface text-choco hover:border-choco/30 disabled:text-choco/40',
  ghost: 'text-choco hover:bg-choco/5 disabled:text-choco/40',
  dark: 'bg-choco text-cream hover:-translate-y-0.5 hover:bg-[#3a2119] disabled:opacity-50',
};

export const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100';

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
