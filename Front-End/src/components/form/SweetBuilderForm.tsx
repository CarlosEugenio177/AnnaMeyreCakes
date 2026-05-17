import type { Catalog, SweetSelection } from '../../types';
import { currency, toNumber } from '../../utils/pricePreview';
import { getMaxSweetFlavors, getSweetRuleText, sweetQuantities, type SweetQuantity } from '../../utils/sweetRules';
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
    const sweet = sweets[index];
    const next: SweetSelection = {
      sweetTypeId: partial.sweetTypeId ?? sweet?.sweetTypeId ?? catalog.sweetTypes[0]?.id ?? '',
      quantity: partial.quantity ?? sweet?.quantity ?? 30,
      sweetFlavorIds: partial.sweetFlavorIds ?? sweet?.sweetFlavorIds ?? [],
    };
    onChange(sweets.map((item, itemIndex) => (itemIndex === index ? next : item)));
  }

  function addSweet() {
    const selectedTypeIds = new Set(sweets.map((sweet) => sweet.sweetTypeId));
    const nextType = catalog.sweetTypes.find((type) => !selectedTypeIds.has(type.id)) ?? catalog.sweetTypes[0];

    onChange([
      ...sweets,
      {
        sweetTypeId: nextType?.id ?? '',
        quantity: 30,
        sweetFlavorIds: [],
      },
    ]);
  }

  function removeSweet(index: number) {
    onChange(sweets.filter((_, itemIndex) => itemIndex !== index));
  }

  function toggleFlavor(index: number, id: string) {
    const sweet = sweets[index];
    const current = sweet?.sweetFlavorIds ?? [];
    const selected = current.includes(id);
    const maxFlavors = getMaxSweetFlavors(sweet?.quantity);
    const nextFlavorIds = selected ? current.filter((item) => item !== id) : [...current, id].slice(0, maxFlavors);
    updateSweet(index, { sweetFlavorIds: nextFlavorIds });
  }

  return (
    <Card>
      <StepHeader eyebrow="Opcional" title="Docinhos" hint="A regra de sabores segue 30, 50 ou 100 unidades." />
      {sweets.length === 0 ? (
        <Button type="button" variant="secondary" onClick={addSweet}>
          Adicionar docinhos
        </Button>
      ) : (
        <div className="space-y-4 lg:space-y-2.5">
          {sweets.map((sweet, index) => {
            const selectedType = catalog.sweetTypes.find((item) => item.id === sweet.sweetTypeId);
            const maxFlavors = getMaxSweetFlavors(sweet.quantity);

            return (
              <div key={`${sweet.sweetTypeId}-${index}`} className="space-y-4 rounded-[24px] border border-brand/10 bg-white/55 p-4 md:p-5 lg:space-y-2.5 lg:rounded-[18px] lg:p-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:gap-2">
                  {catalog.sweetTypes.map((item) => (
                    <OptionCard
                      key={item.id}
                      selected={item.id === sweet.sweetTypeId}
                      onClick={() => updateSweet(index, { sweetTypeId: item.id, sweetFlavorIds: [] })}
                    >
                      <span className="block text-xl font-semibold lg:text-[13px]">{item.name}</span>
                      <span className="text-base text-muted lg:text-[11px]">{currency.format(toNumber(item.pricePer100))} / 100 un.</span>
                    </OptionCard>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 lg:gap-2">
                  {sweetQuantities.map((quantity) => (
                    <OptionCard
                      key={quantity}
                      selected={quantity === sweet.quantity}
                      onClick={() => updateSweet(index, { quantity, sweetFlavorIds: sweet.sweetFlavorIds.slice(0, getMaxSweetFlavors(quantity)) })}
                      className="text-center"
                    >
                      <span className="block text-xl font-semibold lg:text-[15px]">{quantity}</span>
                      <span className="text-sm text-muted lg:text-[11px]">unidades</span>
                    </OptionCard>
                  ))}
                </div>

                <p className="rounded-[16px] bg-blush px-4 py-3 text-sm font-semibold text-cocoa lg:px-3 lg:py-2 lg:text-[11px]">{getSweetRuleText(sweet.quantity)}</p>

                {selectedType ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-2">
                    {selectedType.flavors.map((flavor) => {
                      const selected = sweet.sweetFlavorIds.includes(flavor.id);
                      const disabled = !selected && sweet.sweetFlavorIds.length >= maxFlavors;
                      return (
                        <OptionCard key={flavor.id} selected={selected} disabled={disabled} onClick={() => toggleFlavor(index, flavor.id)}>
                          <span className="text-lg font-semibold lg:text-[13px]">{flavor.name}</span>
                        </OptionCard>
                      );
                    })}
                  </div>
                ) : null}

                <Button type="button" variant="ghost" onClick={() => removeSweet(index)}>
                  Remover docinhos
                </Button>
              </div>
            );
          })}

          {sweets.length < catalog.sweetTypes.length ? (
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={addSweet} className="lg:min-h-10 lg:px-4 lg:text-sm">
                Adicionar outro tipo
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
