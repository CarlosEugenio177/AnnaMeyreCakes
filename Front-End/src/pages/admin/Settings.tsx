import { AlertTriangle, MessageCircle, Save, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { ErrorState } from '../../components/admin/ErrorState';
import { LoadingSkeleton } from '../../components/admin/LoadingSkeleton';
import { StoreStatusToggle } from '../../components/admin/StoreStatusToggle';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getApiErrorMessage } from '../../services/api';
import { getAdminSettings, updateAdminSettings } from '../../services/settingsService';
import { useSettingsStore } from '../../store/settingsStore';
import type { Settings as SettingsType, StoreStatus } from '../../types';

type SettingsProps = {
  navigate: (path: string) => void;
};

export function Settings({ navigate }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsType>({ whatsappNumber: '', storeStatus: 'OPEN' });
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isStatusSaving, setIsStatusSaving] = useState(false);
  const setGlobalSettings = useSettingsStore((state) => state.setSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setIsLoading(true);
    setError(undefined);
    try {
      setSettings(await getAdminSettings());
    } catch {
      setError('Nao conseguimos carregar as configuracoes.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(undefined);
    setError(undefined);

    if (!/^\d{10,15}$/.test(settings.whatsappNumber)) {
      setError('Informe o WhatsApp em formato internacional, apenas numeros. Exemplo: 5586999999999.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateAdminSettings({ whatsappNumber: settings.whatsappNumber });
      setSettings(updated);
      setGlobalSettings(updated);
      setMessage('Configuracoes salvas com sucesso.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStoreStatusChange(storeStatus: StoreStatus) {
    const previousSettings = settings;
    const nextSettings = { ...settings, storeStatus };

    setSettings(nextSettings);
    setMessage(undefined);
    setError(undefined);
    setIsStatusSaving(true);

    try {
      const updated = await updateAdminSettings({ storeStatus });
      setSettings(updated);
      setGlobalSettings(updated);
      setMessage(storeStatus === 'OPEN' ? 'Loja aberta para novas encomendas.' : 'Loja fechada para novas encomendas.');
    } catch (requestError) {
      setSettings(previousSettings);
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsStatusSaving(false);
    }
  }

  return (
    <AdminLayout title="Configuracoes" navigate={navigate}>
      <AdminPageHeader title="Configuracoes" subtitle="Controle atendimento, status da loja e dados usados na finalizacao dos pedidos." />

      {isLoading ? (
        <AdminCard className="p-5"><LoadingSkeleton /></AdminCard>
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[1fr_1fr]">
          <AdminCard className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-blush text-brand">
                  <Store className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold text-roseText">Status da loja</h2>
                <p className="mt-2 text-sm leading-6 text-muted">Controle se a loja esta aceitando novas encomendas.</p>
              </div>
              <Badge tone={settings.storeStatus === 'OPEN' ? 'green' : 'rose'}>{settings.storeStatus === 'OPEN' ? 'Aberta' : 'Fechada'}</Badge>
            </div>
            <div className="mt-5">
              <StoreStatusToggle value={settings.storeStatus} disabled={isStatusSaving} onChange={handleStoreStatusChange} />
              {settings.storeStatus === 'CLOSED' ? (
                <div className="mt-4 flex gap-3 rounded-[18px] border border-brand/10 bg-brand/10 p-4 text-sm font-semibold text-brand">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  A finalizacao de pedidos fica bloqueada enquanto a loja estiver fechada.
                </div>
              ) : null}
            </div>
          </AdminCard>

          <AdminCard className="p-5 md:p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush text-brand">
                <MessageCircle className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold text-roseText">WhatsApp de atendimento</h2>
                <p className="mt-2 text-sm leading-6 text-muted">Numero usado para receber os pedidos finalizados.</p>
              </div>
            </div>
            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-muted">Numero internacional</span>
                <input
                  className="min-h-12 w-full rounded-[18px] border border-line bg-white px-4 text-cocoa outline-none transition placeholder:text-muted/70 focus:border-brand"
                  inputMode="numeric"
                  value={settings.whatsappNumber}
                  onChange={(event) => setSettings((current) => ({ ...current, whatsappNumber: event.target.value.replace(/\D/g, '') }))}
                  placeholder="5586999999999"
                />
              </label>
              <Button className="min-h-11 px-5 text-sm" type="submit" disabled={isSaving}>
                <Save className="h-4 w-4" aria-hidden />
                {isSaving ? 'Salvando...' : 'Salvar WhatsApp'}
              </Button>
            </form>
          </AdminCard>
        </div>
      )}

      {isStatusSaving ? <p className="mt-4 text-sm font-semibold text-muted">Atualizando status da loja...</p> : null}
      {message ? <p className="mt-4 rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <div className="mt-4"><ErrorState message={error} onRetry={loadSettings} /></div> : null}
    </AdminLayout>
  );
}
