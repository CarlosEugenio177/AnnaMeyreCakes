import type { ReactNode } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import type { CustomerData } from '../../types';
import { Card } from '../ui/Card';
import { StepHeader } from './StepHeader';

type CustomerFormProps = {
  register: UseFormRegister<CustomerData>;
  minDate: string;
  errors: Partial<Record<keyof CustomerData, string>>;
};

export function CustomerForm({ register, minDate, errors }: CustomerFormProps) {
  return (
    <Card>
      <StepHeader step={7} title="Seus dados" hint="Usamos para confirmar o pedido com você pelo WhatsApp." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" error={errors.customerName}>
          <input {...register('customerName')} className={inputClassName} data-testid="contact-name-input" autoComplete="name" placeholder="Seu nome" />
        </Field>
        <Field label="WhatsApp" error={errors.customerPhone}>
          <input
            {...register('customerPhone')}
            className={inputClassName}
            data-testid="contact-phone-input"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
          />
        </Field>
        <Field label="E-mail" optional error={errors.customerEmail}>
          <input
            {...register('customerEmail')}
            className={inputClassName}
            data-testid="contact-email-input"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@email.com"
          />
        </Field>
        <Field label="Data de entrega" error={errors.desiredDate}>
          <input {...register('desiredDate')} className={inputClassName} min={minDate} type="date" />
        </Field>
        <Field label="Endereço" optional error={errors.customerAddress} className="sm:col-span-2">
          <input
            {...register('customerAddress')}
            className={inputClassName}
            data-testid="contact-address-input"
            autoComplete="street-address"
            placeholder="Rua, número e bairro (se for entrega)"
          />
        </Field>
        <Field label="Observações" optional error={errors.notes} className="sm:col-span-2">
          <textarea
            {...register('notes')}
            className={`${inputClassName} min-h-24 resize-y py-3`}
            placeholder="Tema, cores, frase no topo, retirada ou entrega..."
          />
        </Field>
      </div>
    </Card>
  );
}

const inputClassName =
  'min-h-12 w-full rounded-xl border border-line bg-surface px-4 text-sm text-cocoa outline-none transition placeholder:text-muted/60 focus:border-cocoa/40 focus:ring-2 focus:ring-blush';

type FieldProps = {
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

function Field({ label, error, optional, className = '', children }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-cocoa">
        {label}
        {optional ? <span className="ml-1 font-normal text-muted">(opcional)</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs font-medium text-brand">{error}</span> : null}
    </label>
  );
}
