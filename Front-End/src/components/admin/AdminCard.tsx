import type { ReactNode } from 'react';

type AdminCardProps = {
  children: ReactNode;
  className?: string;
};

export function AdminCard({ children, className = '' }: AdminCardProps) {
  return <section className={`rounded-[24px] bg-surface shadow-soft ${className}`}>{children}</section>;
}
