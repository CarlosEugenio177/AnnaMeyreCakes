import { Plus, Trash2 } from 'lucide-react';
import type { Catalog, SweetSelection } from '../../types';
import { currency, toNumber } from '../../utils/pricePreview';
import { toSlug } from '../../utils/slug';
import { getMaxSweetFlavors, sweetQuantities } from '../../utils/sweetRules';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { OptionCard } from './OptionCard';
import { StepHeader } from './StepHeader';

type SweetBuilderFormProps = {
  catalog: Catalog;
  sweets: SweetSelection[];
  onChange: (sweets: SweetSelection[]) => void;
};

export function SweetBuilderForm({ catalog, sweets, onChange }: SweetBuilderFormProps) {
  function updateSweet(index: number, partial: Partial<SweetSelection>) {
    onChange(sweets.map((item, itemIndex) => (itemIndex === index ? { ...item, ...partial } : item)));
  }

  function addSweet() {
    const selectedTypeIds = new Set(sweets.map((sweet) => sweet.sweetTypeId));
    const nextType = catalog.sweetTypes.find((type) => !selectedTypeIds.has(type.id)) ?? catalog.sweetTypes[0];
    onChange([...sweets, { sweetTypeId: nextType?.id ?? '', quantity: 30, sweetFlavorIds: [] }]);
  }

  function removeSweet(index: number) {
    onChange(sweets.filter((_, itemIndex) => itemIndex !== index));
  }

  function toggleFlavor(index: number, id: string) {
    const sweet = sweets[index];
    const current = sweet.sweetFlavorIds;
    const nextFlavorIds = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id].slice(0, getMaxSweetFlavors(sweet.quantity));
    updateSweet(index, { sweetFlavorIds: nextFlavorIds });
  }

  return (
    <Card>
      <StepHeader step={5} title="Docinhos" hint="Opcional. Brigadeiros e companhia para completar a mesa." />

      <div className="space-y-4">
        {sweets.map((sweet, index) => {
          const selectedType = catalog.sweetTypes.find((item) => item.id === sweet.sweetTypeId);
          const maxFlavors = getMaxSweetFlavors(sweet.quantity);

          return (
            <div key={index} className="space-y-4 rounded-3xl bg-cream p-4 sm:p-5">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {catalog.sweetTypes.map((item) => (
                  <OptionCard
                    key={item.id}
                    selected={item.id === sweet.sweetTypeId}
                    testId={`sweet-option-${toSlug(item.name)}`}
                    onClick={() => updateSweet(index, { sweetTypeId: item.id, sweetFlavorIds: [] })}
                  >
                    <span className="block text-sm font-semibold">{item.name}</span>
                    <span className="block text-xs text-muted">{currency.format(toNumber(item.pricePer100))} o cento</span>
                  </OptionCard>
                ))}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Quantidade</p>
                <div className="inline-flex rounded-full border-2 border-line bg-surface p-1">
                  {sweetQuantities.map((quantity) => (
                    <button
                      key={quantity}
                      type="button"
                      aria-pressed={quantity === sweet.quantity}
                      onClick={() =>
                        updateSweet(index, { quantity, sweetFlavorIds: sweet.sweetFlavorIds.slice(0, getMaxSweetFlavors(quantity)) })
                      }
                      className={`min-h-9 rounded-full px-4 text-sm font-semibold transition ${
                        quantity === sweet.quantity ? 'bg-choco text-cream' : 'text-choco hover:bg-blush'
                      }`}
                    >
                      {quantity} un.
                    </button>
                  ))}
                </div>
              </div>

              {selectedType ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    Sabores · escolha até {maxFlavors} ({sweet.sweetFlavorIds.length}/{maxFlavors})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedType.flavors.map((flavor) => {
                      const selected = sweet.sweetFlavorIds.includes(flavor.id);
                      const disabled = !selected && sweet.sweetFlavorIds.length >= maxFlavors;
                      return (
                        <button
                          key={flavor.id}
                          type="button"
                          data-testid={`sweet-flavor-option-${toSlug(flavor.name)}`}
                          aria-pressed={selected}
                          disabled={disabled}
                          onClick={() => toggleFlavor(index, flavor.id)}
                          className={`min-h-10 rounded-full border-2 px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                            selected ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-choco hover:border-choco/30'
                          }`}
                        >
                          {flavor.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => removeSweet(index)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Remover
              </button>
            </div>
          );
        })}

        {sweets.length < catalog.sweetTypes.length ? (
          <Button type="button" variant="secondary" onClick={addSweet}>
            <Plus className="h-4 w-4" aria-hidden />
            {sweets.length === 0 ? 'Adicionar docinhos' : 'Adicionar outro tipo'}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
