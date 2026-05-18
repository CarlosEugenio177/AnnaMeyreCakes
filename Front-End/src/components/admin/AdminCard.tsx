import type { ReactNode } from 'react';

type AdminCardProps = {
  children: ReactNode;
  className?: string;
};

export function AdminCard({ children, className = '' }: AdminCardProps) {
  return (
    <section className={`rounded-[22px] border border-line/90 bg-surface shadow-[0_16px_40px_rgba(138,75,62,0.04)] ${className}`}>
      {children}
    </section>
  );
}
