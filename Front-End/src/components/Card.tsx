import type { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className = '' }: CardProps) {
  return (
    <section className={`rounded-[28px] bg-white/86 p-5 shadow-soft ring-1 ring-white/70 ${className}`}>
      {children}
    </section>
  );
}
