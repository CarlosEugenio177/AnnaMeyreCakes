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
  onToggleFilling: (id: string) => void;
};

export function CakeBuilderForm({
  catalog,
  selectedDoughId,
  selectedCakeSizeId,
  selectedFilling1Id,
  selectedFilling2Id,
  selectedToppingId,
  onSelect,
  onToggleFilling,
}: CakeBuilderFormProps) {
  const fillingCount = [selectedFilling1Id, selectedFilling2Id].filter(Boolean).length;

  return (
    <>
      <Card>
        <StepHeader step={1} title="A massa" hint="A base de tudo." />
        <div className="grid gap-2.5 sm:grid-cols-3">
          {catalog.doughs.map((item) => (
            <OptionCard
              key={item.id}
              selected={item.id === selectedDoughId}
              color={item.colorHex}
              testId={`dough-option-${toSlug(item.name)}`}
              onClick={() => onSelect('selectedDoughId', item.id)}
            >
              <span className="block font-bold">{item.name}</span>
              <span className="block text-xs text-muted">{getDoughDescription(item.name)}</span>
            </OptionCard>
          ))}
        </div>
      </Card>

      <Card>
        <StepHeader step={2} title="O tamanho" hint="Quantas pessoas vão adoçar a festa?" />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {catalog.cakeSizes.map((item) => (
            <OptionCard
              key={item.id}
              selected={item.id === selectedCakeSizeId}
              testId={`size-option-${item.slices}`}
              onClick={() => onSelect('selectedCakeSizeId', item.id)}
            >
              <span className="block font-display text-2xl leading-none">{item.slices}</span>
              <span className="mt-1 block text-xs font-semibold text-muted">fatias · {currency.format(toNumber(item.price))}</span>
            </OptionCard>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <StepHeader step={3} title="Os recheios" hint="Escolha 2. Especiais têm um pequeno acréscimo." />
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${fillingCount === 2 ? 'bg-emerald-50 text-emerald-700' : 'bg-blush text-brand'}`}
            aria-live="polite"
          >
            {fillingCount}/2 escolhidos
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-3">
          {catalog.fillings.map((item) => {
            const badge = item.id === selectedFilling1Id ? '1º' : item.id === selectedFilling2Id ? '2º' : undefined;
            return (
              <OptionCard
                key={item.id}
                selected={badge !== undefined}
                badge={badge}
                color={item.colorHex}
                testId={`filling-option-${toSlug(item.name)}`}
                onClick={() => onToggleFilling(item.id)}
              >
                <span className="block text-sm font-bold">{item.name}</span>
                {toNumber(item.extraPrice) > 0 ? (
                  <span className="block text-xs font-bold text-brand">+ {currency.format(toNumber(item.extraPrice))}</span>
                ) : null}
              </OptionCard>
            );
          })}
        </div>
      </Card>

      <Card>
        <StepHeader step={4} title="A cobertura" hint="O acabamento que todo mundo vê primeiro." />
        <div className="grid gap-2.5 sm:grid-cols-3">
          {catalog.toppings.map((item) => (
            <OptionCard
              key={item.id}
              selected={item.id === selectedToppingId}
              color={item.colorHex}
              testId={`topping-option-${toSlug(item.name)}`}
              onClick={() => onSelect('selectedToppingId', item.id)}
            >
              <span className="block font-bold">{item.name}</span>
            </OptionCard>
          ))}
        </div>
      </Card>
    </>
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
