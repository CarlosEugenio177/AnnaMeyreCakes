import { useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { Logo } from '../components/Logo';
import { OptionCard } from '../components/OptionCard';
import { OrderSummary } from '../components/OrderSummary';
import { SectionTitle } from '../components/SectionTitle';
import { WhatsAppButton } from '../components/WhatsAppButton';
import {
  cakeBases,
  cakeSizes,
  fillings,
  specialFillings,
  sweetOptions,
  toppings,
  type CakeBase,
  type CakeSize,
  type CustomerData,
  type Filling,
  type Order,
  type SweetOption,
  type Topping,
} from '../data/menu';
import { currency } from '../utils/price';
import { buildWhatsAppLink } from '../utils/whatsapp';

const initialCustomer: CustomerData = {
  name: '',
  whatsapp: '',
  desiredDate: '',
  notes: '',
};

export function CakeBuilder() {
  const [base, setBase] = useState<CakeBase>('Branca');
  const [size, setSize] = useState<CakeSize>(cakeSizes[0]);
  const [selectedFillings, setSelectedFillings] = useState<Filling[]>([]);
  const [topping, setTopping] = useState<Topping>('Acetato');
  const [sweets, setSweets] = useState<SweetOption | null>(null);
  const [customer, setCustomer] = useState<CustomerData>(initialCustomer);

  const minDate = useMemo(() => getMinimumOrderDate(), []);

  const order: Order = {
    base,
    size,
    fillings: selectedFillings,
    topping,
    sweets,
    customer,
  };

  const isComplete =
    selectedFillings.length === 2 &&
    customer.name.trim().length > 0 &&
    customer.whatsapp.trim().length > 0 &&
    customer.desiredDate.trim().length > 0;

  const whatsappLink = isComplete ? buildWhatsAppLink(order) : undefined;

  function toggleFilling(filling: Filling) {
    setSelectedFillings((current) => {
      if (current.includes(filling)) {
        return current.filter((item) => item !== filling);
      }

      if (current.length >= 2) {
        return current;
      }

      return [...current, filling];
    });
  }

  function updateCustomer(field: keyof CustomerData, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="px-5 pb-32 pt-7">
      <header className="text-center">
        <Logo compact />
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-brand">Monte seu bolo</h1>
        <p className="mx-auto mt-2 max-w-72 text-base leading-relaxed text-softGray">Escolha massa, recheios e tamanho.</p>
      </header>

      <div className="mt-8 space-y-6">
        <Card>
          <SectionTitle title="Massa" hint="Cada bolo tem 3 discos de massa." />
          <div className="grid grid-cols-3 gap-3">
            {cakeBases.map((item) => (
              <OptionCard key={item} selected={item === base} onClick={() => setBase(item)} className="min-h-20 rounded-full px-2">
                <span className="block text-sm font-bold">{item}</span>
              </OptionCard>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Tamanho" />
          <div className="grid grid-cols-2 gap-3">
            {cakeSizes.map((item) => (
              <OptionCard key={item.label} selected={item.label === size.label} onClick={() => setSize(item)}>
                <span className="block text-lg font-bold">{item.label}</span>
                <span className="mt-1 block text-sm opacity-85">{currency.format(item.price)}</span>
              </OptionCard>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Recheios" hint="Escolha 2 recheios. Nutella, Morango e Geleia adicionam R$ 30,00 cada." />
          <div className="mb-4 rounded-2xl bg-petal px-4 py-3 text-center text-sm font-semibold text-brand">
            {selectedFillings.length}/2 recheios selecionados
          </div>
          <div className="grid gap-3">
            {fillings.map((filling) => {
              const selected = selectedFillings.includes(filling);
              const disabled = !selected && selectedFillings.length >= 2;
              const isSpecial = specialFillings.includes(filling as (typeof specialFillings)[number]);

              return (
                <OptionCard key={filling} selected={selected} disabled={disabled} onClick={() => toggleFilling(filling)} className="min-h-[72px]">
                  <span className="block font-bold">{filling}</span>
                  {isSpecial ? <span className="mt-1 block text-xs opacity-85">+ R$ 30,00</span> : null}
                </OptionCard>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Cobertura" />
          <div className="grid gap-3">
            {toppings.map((item) => (
              <OptionCard key={item} selected={item === topping} onClick={() => setTopping(item)} className="min-h-[76px]">
                <span className="font-bold">{item}</span>
              </OptionCard>
            ))}
          </div>
          <p className="mt-4 rounded-2xl bg-petal px-4 py-3 text-center text-sm font-bold text-brand">Não trabalhamos com chantilly.</p>
        </Card>

        <Card>
          <SectionTitle title="Docinhos" hint="Opcional para completar a encomenda." />
          <div className="space-y-3">
            {sweetOptions.map((option) => (
              <OptionCard
                key={option.id}
                selected={sweets?.id === option.id}
                onClick={() => setSweets((current) => (current?.id === option.id ? null : option))}
                className="min-h-[116px] text-left"
              >
                <span className="block text-lg font-bold">{option.label}</span>
                <span className="mt-1 block text-sm opacity-90">{option.flavors.join(', ')}</span>
                <span className="mt-2 block text-base font-bold">{currency.format(option.price)}</span>
              </OptionCard>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle title="Dados do cliente" hint="Encomendas somente pelo WhatsApp." />
          <div className="space-y-4">
            <Field label="Nome" value={customer.name} onChange={(value) => updateCustomer('name', value)} placeholder="Seu nome" />
            <Field
              label="WhatsApp"
              value={customer.whatsapp}
              onChange={(value) => updateCustomer('whatsapp', value)}
              placeholder="(00) 00000-0000"
              inputMode="tel"
            />
            <Field
              label="Data desejada"
              value={customer.desiredDate}
              onChange={(value) => updateCustomer('desiredDate', value)}
              type="date"
              min={minDate}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-roseText">Observações</span>
              <textarea
                value={customer.notes}
                onChange={(event) => updateCustomer('notes', event.target.value)}
                placeholder="Tema, cores, detalhes do bolo..."
                rows={4}
                className="w-full resize-none rounded-[22px] border border-brand/10 bg-white px-4 py-4 text-base outline-none transition placeholder:text-softGray/60 focus:border-brand"
              />
            </label>
          </div>
        </Card>

        <OrderSummary order={order} />
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[430px] bg-gradient-to-t from-petal via-petal to-petal/0 px-5 pb-5 pt-10">
        <WhatsAppButton href={whatsappLink} disabled={!isComplete}>Enviar pedido pelo WhatsApp</WhatsAppButton>
        {!isComplete ? <p className="mt-2 text-center text-xs font-semibold text-softGray">Complete os 2 recheios e seus dados.</p> : null}
      </footer>
    </main>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  inputMode?: 'text' | 'tel';
};

function Field({ label, value, onChange, placeholder, type = 'text', min, inputMode = 'text' }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-roseText">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        min={min}
        inputMode={inputMode}
        className="h-14 w-full rounded-[22px] border border-brand/10 bg-white px-4 text-base outline-none transition placeholder:text-softGray/60 focus:border-brand"
      />
    </label>
  );
}

function getMinimumOrderDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);

  return date.toISOString().slice(0, 10);
}
