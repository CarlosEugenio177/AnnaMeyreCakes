import type { Catalog } from '../../types';
import { currency, toNumber } from '../../utils/pricePreview';
import { Card } from '../ui/Card';
import { OptionCard } from './OptionCard';
import { StepHeader } from './StepHeader';

type CakeBuilderFormProps = {
  catalog: Catalog;
  selectedDoughId?: string;
  selectedCakeSizeId?: string;
  selectedFilling1Id?: string;
  selectedFilling2Id?: string;
  selectedToppingId?: string;
  onSelect: (field: string, value: string) => void;
};

export function CakeBuilderForm({
  catalog,
  selectedDoughId,
  selectedCakeSizeId,
  selectedFilling1Id,
  selectedFilling2Id,
  selectedToppingId,
  onSelect,
}: CakeBuilderFormProps) {
  return (
    <div className="space-y-5">
      <Card>
        <StepHeader eyebrow="Passo 1" title="Escolha a massa" hint="A base de tudo." />
        <div className="grid gap-4">
          {catalog.doughs.map((item) => (
            <OptionCard key={item.id} selected={item.id === selectedDoughId} color={item.colorHex} onClick={() => onSelect('selectedDoughId', item.id)}>
              <span className="block text-2xl font-semibold">{getDoughDisplayName(item.name)}</span>
              <span className="mt-1 block text-lg text-muted">{getDoughDescription(item.name)}</span>
            </OptionCard>
          ))}
        </div>
      </Card>

      <Card>
        <StepHeader eyebrow="Passo 2" title="Escolha o tamanho" hint="O total usa o valor do catalogo." />
        <div className="grid grid-cols-2 gap-3">
          {catalog.cakeSizes.map((item) => (
            <OptionCard key={item.id} selected={item.id === selectedCakeSizeId} onClick={() => onSelect('selectedCakeSizeId', item.id)}>
              <span className="block text-2xl font-semibold">{item.slices} fatias</span>
              <span className="text-lg text-muted">{currency.format(toNumber(item.price))}</span>
            </OptionCard>
          ))}
        </div>
      </Card>

      <FillingStep
        step="Passo 3"
        title="Escolha o recheio 1"
        fillings={catalog.fillings}
        selectedId={selectedFilling1Id}
        onSelect={(id) => onSelect('selectedFilling1Id', id)}
      />
      <FillingStep
        step="Passo 4"
        title="Escolha o recheio 2"
        fillings={catalog.fillings}
        selectedId={selectedFilling2Id}
        onSelect={(id) => onSelect('selectedFilling2Id', id)}
      />

      <Card>
        <StepHeader eyebrow="Passo 5" title="Escolha a cobertura" hint="O catalogo oficial nao possui chantilly." />
        <div className="grid gap-3 sm:grid-cols-2">
          {catalog.toppings.map((item) => (
            <OptionCard key={item.id} selected={item.id === selectedToppingId} color={item.colorHex} onClick={() => onSelect('selectedToppingId', item.id)}>
              <span className="block text-xl font-semibold">{item.name}</span>
            </OptionCard>
          ))}
        </div>
      </Card>
    </div>
  );
}

type FillingStepProps = {
  step: string;
  title: string;
  fillings: Catalog['fillings'];
  selectedId?: string;
  onSelect: (id: string) => void;
};

function FillingStep({ step, title, fillings, selectedId, onSelect }: FillingStepProps) {
  return (
    <Card>
      <StepHeader eyebrow={step} title={title} hint="Recheios especiais podem somar acrescimo ao tamanho." />
      <div className="grid gap-3 sm:grid-cols-2">
        {fillings.map((item) => (
          <OptionCard key={item.id} selected={item.id === selectedId} color={item.colorHex} onClick={() => onSelect(item.id)}>
            <span className="block text-xl font-semibold">{item.name}</span>
            {toNumber(item.extraPrice) > 0 ? (
              <span className="text-base text-muted">+ {currency.format(toNumber(item.extraPrice))}</span>
            ) : (
              <span className="text-base text-muted">Classico da casa</span>
            )}
          </OptionCard>
        ))}
      </div>
    </Card>
  );
}

function getDoughDisplayName(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes('branca')) {
    return 'Branca Baunilha';
  }
  if (normalized.includes('chocolate')) {
    return 'Chocolate Belga';
  }
  if (normalized.includes('mista')) {
    return 'Massa Mista';
  }

  return name;
}

function getDoughDescription(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes('branca')) {
    return 'Fofinha e classica';
  }
  if (normalized.includes('chocolate')) {
    return 'Intensa e molhadinha';
  }
  if (normalized.includes('mista')) {
    return 'Dois sabores no mesmo bolo';
  }

  return 'Preparada com cuidado';
}
