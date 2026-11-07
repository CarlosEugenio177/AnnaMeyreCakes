import type { Catalog } from '../../types';
import { currency, toNumber } from '../../utils/pricePreview';
import { toSlug } from '../../utils/slug';
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
    <>
      <Card>
        <StepHeader step={1} title="Massa" hint="A base de tudo." />
        <div className="grid gap-2.5 sm:grid-cols-3">
          {catalog.doughs.map((item) => (
            <OptionCard
              key={item.id}
              selected={item.id === selectedDoughId}
              color={item.colorHex}
              testId={`dough-option-${toSlug(item.name)}`}
              onClick={() => onSelect('selectedDoughId', item.id)}
            >
              <span className="block font-semibold">{item.name}</span>
              <span className="block text-xs text-muted">{getDoughDescription(item.name)}</span>
            </OptionCard>
          ))}
        </div>
      </Card>

      <Card>
        <StepHeader step={2} title="Tamanho" hint="Quantas fatias você precisa?" />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {catalog.cakeSizes.map((item) => (
            <OptionCard
              key={item.id}
              selected={item.id === selectedCakeSizeId}
              testId={`size-option-${item.slices}`}
              onClick={() => onSelect('selectedCakeSizeId', item.id)}
            >
              <span className="block font-semibold">{item.slices} fatias</span>
              <span className="block text-xs text-muted">{currency.format(toNumber(item.price))}</span>
            </OptionCard>
          ))}
        </div>
      </Card>

      <FillingStep
        step={3}
        title="Primeiro recheio"
        fillings={catalog.fillings}
        selectedId={selectedFilling1Id}
        onSelect={(id) => onSelect('selectedFilling1Id', id)}
      />
      <FillingStep
        step={4}
        title="Segundo recheio"
        fillings={catalog.fillings}
        selectedId={selectedFilling2Id}
        onSelect={(id) => onSelect('selectedFilling2Id', id)}
      />

      <Card>
        <StepHeader step={5} title="Cobertura" hint="O acabamento por fora." />
        <div className="grid gap-2.5 sm:grid-cols-3">
          {catalog.toppings.map((item) => (
            <OptionCard
              key={item.id}
              selected={item.id === selectedToppingId}
              color={item.colorHex}
              testId={`topping-option-${toSlug(item.name)}`}
              onClick={() => onSelect('selectedToppingId', item.id)}
            >
              <span className="block font-semibold">{item.name}</span>
            </OptionCard>
          ))}
        </div>
      </Card>
    </>
  );
}

type FillingStepProps = {
  step: number;
  title: string;
  fillings: Catalog['fillings'];
  selectedId?: string;
  onSelect: (id: string) => void;
};

function FillingStep({ step, title, fillings, selectedId, onSelect }: FillingStepProps) {
  return (
    <Card>
      <StepHeader step={step} title={title} hint="Recheios especiais têm um pequeno acréscimo." />
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-3">
        {fillings.map((item) => (
          <OptionCard
            key={item.id}
            selected={item.id === selectedId}
            color={item.colorHex}
            testId={`filling-option-${toSlug(item.name)}`}
            onClick={() => onSelect(item.id)}
          >
            <span className="block text-sm font-semibold">{item.name}</span>
            {toNumber(item.extraPrice) > 0 ? (
              <span className="block text-xs font-medium text-brand">+ {currency.format(toNumber(item.extraPrice))}</span>
            ) : null}
          </OptionCard>
        ))}
      </div>
    </Card>
  );
}

function getDoughDescription(name: string) {
  const normalized = name.toLowerCase();
  if (normalized.includes('branca')) {
    return 'Fofinha, sabor baunilha';
  }
  if (normalized.includes('chocolate')) {
    return 'Intensa e molhadinha';
  }
  if (normalized.includes('mista')) {
    return 'Branca e chocolate juntas';
  }

  return 'Feita com carinho';
}
