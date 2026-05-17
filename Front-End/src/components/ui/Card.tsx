import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return <section className={`rounded-[30px] border border-line bg-surface p-6 shadow-[0_18px_48px_rgba(138,75,62,0.045)] md:p-7 lg:rounded-[20px] lg:p-4 lg:shadow-[0_8px_24px_rgba(138,75,62,0.03)] ${className}`}>{children}</section>;
}
