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
  const sweet = sweets[0];
  const selectedType = catalog.sweetTypes.find((item) => item.id === sweet?.sweetTypeId);
  const maxFlavors = getMaxSweetFlavors(sweet?.quantity);

  function updateSweet(partial: Partial<SweetSelection>) {
    const next: SweetSelection = {
      sweetTypeId: partial.sweetTypeId ?? sweet?.sweetTypeId ?? catalog.sweetTypes[0]?.id ?? '',
      quantity: partial.quantity ?? sweet?.quantity ?? 30,
      sweetFlavorIds: partial.sweetFlavorIds ?? sweet?.sweetFlavorIds ?? [],
    };
    onChange([next]);
  }

  function toggleFlavor(id: string) {
    const current = sweet?.sweetFlavorIds ?? [];
    const selected = current.includes(id);
    const nextFlavorIds = selected ? current.filter((item) => item !== id) : [...current, id].slice(0, maxFlavors);
    updateSweet({ sweetFlavorIds: nextFlavorIds });
  }

  return (
    <Card>
      <StepHeader eyebrow="Opcional" title="Docinhos" hint="A regra de sabores segue 30, 50 ou 100 unidades." />
      {!sweet ? (
        <Button type="button" variant="secondary" onClick={() => updateSweet({})}>
          Adicionar docinhos
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {catalog.sweetTypes.map((item) => (
              <OptionCard key={item.id} selected={item.id === sweet.sweetTypeId} onClick={() => updateSweet({ sweetTypeId: item.id, sweetFlavorIds: [] })}>
                <span className="block text-xl font-semibold">{item.name}</span>
                <span className="text-base text-muted">{currency.format(toNumber(item.pricePer100))} / 100 un.</span>
              </OptionCard>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {sweetQuantities.map((quantity) => (
              <OptionCard
                key={quantity}
                selected={quantity === sweet.quantity}
                onClick={() => updateSweet({ quantity, sweetFlavorIds: sweet.sweetFlavorIds.slice(0, getMaxSweetFlavors(quantity)) })}
                className="text-center"
              >
                <span className="block text-xl font-semibold">{quantity}</span>
                <span className="text-sm text-muted">unidades</span>
              </OptionCard>
            ))}
          </div>

          <p className="rounded-[18px] bg-blush px-4 py-3 text-sm font-semibold text-cocoa">{getSweetRuleText(sweet.quantity)}</p>

          {selectedType ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedType.flavors.map((flavor) => {
                const selected = sweet.sweetFlavorIds.includes(flavor.id);
                const disabled = !selected && sweet.sweetFlavorIds.length >= maxFlavors;
                return (
                  <OptionCard key={flavor.id} selected={selected} disabled={disabled} onClick={() => toggleFlavor(flavor.id)}>
                    <span className="text-lg font-semibold">{flavor.name}</span>
                  </OptionCard>
                );
              })}
            </div>
          ) : null}

          <Button type="button" variant="ghost" onClick={() => onChange([])}>
            Remover docinhos
          </Button>
        </div>
      )}
    </Card>
  );
}
