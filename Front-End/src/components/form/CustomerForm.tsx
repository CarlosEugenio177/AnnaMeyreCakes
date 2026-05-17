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
      <StepHeader eyebrow="Finalizacao" title="Seus dados" hint="Nome, WhatsApp e data sao obrigatorios." />
      <div className="grid gap-4 md:grid-cols-2 lg:gap-2.5">
        <Field label="Nome" error={errors.customerName}>
          <input {...register('customerName')} className={inputClassName} placeholder="Seu nome" />
        </Field>
        <Field label="WhatsApp" error={errors.customerPhone}>
          <input {...register('customerPhone')} className={inputClassName} inputMode="tel" placeholder="(00) 00000-0000" />
        </Field>
        <Field label="Email" error={errors.customerEmail}>
          <input {...register('customerEmail')} className={inputClassName} inputMode="email" placeholder="voce@email.com" />
        </Field>
        <Field label="Endereco" error={errors.customerAddress}>
          <input {...register('customerAddress')} className={inputClassName} placeholder="Rua, numero, bairro" />
        </Field>
        <Field label="Data de entrega" error={errors.desiredDate}>
          <input {...register('desiredDate')} className={inputClassName} min={minDate} type="date" />
        </Field>
        <Field label="Observações" error={errors.notes}>
          <textarea
            {...register('notes')}
            className={`${inputClassName} min-h-28 resize-none py-4`}
            placeholder="Tema, cores, retirada ou entrega..."
          />
        </Field>
      </div>
    </Card>
  );
}

const inputClassName =
  'w-full rounded-[22px] border border-line bg-white px-5 text-lg text-cocoa outline-none transition placeholder:text-muted/60 focus:border-cocoa min-h-16 lg:min-h-11 lg:rounded-[14px] lg:px-3.5 lg:text-sm';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-[0.18em] text-muted lg:mb-1.5 lg:text-[9px] lg:tracking-[0.14em]">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-semibold text-brand">{error}</span> : null}
    </label>
  );
}
