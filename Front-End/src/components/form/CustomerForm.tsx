import type { ReactNode } from 'react';
import type { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import type { CustomerData } from '../../types';
import { formatPhone } from '../../utils/phone';
import { Card } from '../ui/Card';
import { StepHeader } from './StepHeader';

type CustomerFormProps = {
  register: UseFormRegister<CustomerData>;
  setValue: UseFormSetValue<CustomerData>;
  minDate: string;
  errors: Partial<Record<keyof CustomerData, string>>;
};

export function CustomerForm({ register, setValue, minDate, errors }: CustomerFormProps) {
  return (
    <Card>
      <div id="customer-step" className="scroll-mt-28" />
      <StepHeader step={6} title="Seus dados" hint="Para confirmarmos tudo com você pelo WhatsApp." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" error={errors.customerName}>
          <input {...register('customerName')} className={inputClassName(errors.customerName)} data-testid="contact-name-input" autoComplete="name" placeholder="Seu nome" />
        </Field>
        <Field label="WhatsApp" error={errors.customerPhone}>
          <input
            {...register('customerPhone', {
              onChange: (event) => setValue('customerPhone', formatPhone(event.target.value)),
            })}
            className={inputClassName(errors.customerPhone)}
            data-testid="contact-phone-input"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
          />
        </Field>
        <Field label="E-mail" optional error={errors.customerEmail}>
          <input
            {...register('customerEmail')}
            className={inputClassName(errors.customerEmail)}
            data-testid="contact-email-input"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@email.com"
          />
        </Field>
        <Field label="Data de entrega" error={errors.desiredDate}>
          <input {...register('desiredDate')} className={inputClassName(errors.desiredDate)} min={minDate} type="date" />
        </Field>
        <Field label="Endereço" optional error={errors.customerAddress} className="sm:col-span-2">
          <input
            {...register('customerAddress')}
            className={inputClassName(errors.customerAddress)}
            data-testid="contact-address-input"
            autoComplete="street-address"
            placeholder="Rua, número e bairro (se for entrega)"
          />
        </Field>
        <Field label="Observações" optional error={errors.notes} className="sm:col-span-2">
          <textarea
            {...register('notes')}
            className={`${inputClassName(errors.notes)} min-h-24 resize-y py-3`}
            placeholder="Tema, cores, frase no topo, retirada ou entrega..."
          />
        </Field>
      </div>
    </Card>
  );
}

function inputClassName(error?: string) {
  return `min-h-12 w-full rounded-2xl border-2 bg-cream/60 px-4 text-sm text-choco outline-none transition placeholder:text-muted/60 focus:bg-surface ${
    error ? 'border-brand/60 focus:border-brand' : 'border-line focus:border-choco/40'
  }`;
}

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
      <span className="mb-1.5 block text-sm font-bold text-choco">
        {label}
        {optional ? <span className="ml-1 font-medium text-muted">(opcional)</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs font-semibold text-brand">{error}</span> : null}
    </label>
  );
}
