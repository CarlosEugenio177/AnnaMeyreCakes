import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StoreStatusToggle } from '../../components/admin/StoreStatusToggle';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
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
  const [isStatusSaving, setIsStatusSaving] = useState(false);
  const setGlobalSettings = useSettingsStore((state) => state.setSettings);

  useEffect(() => {
    getAdminSettings().then(setSettings);
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(undefined);
    try {
      const updated = await updateAdminSettings(settings);
      setSettings(updated);
      setGlobalSettings(updated);
      setMessage('Configurações salvas.');
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    }
  }

  async function handleStoreStatusChange(storeStatus: StoreStatus) {
    const previousSettings = settings;
    const nextSettings = { ...settings, storeStatus };

    setSettings(nextSettings);
    setMessage(undefined);
    setIsStatusSaving(true);

    try {
      const updated = await updateAdminSettings({ storeStatus });
      setSettings(updated);
      setGlobalSettings(updated);
      setMessage(storeStatus === 'OPEN' ? 'Loja aberta.' : 'Loja fechada.');
    } catch (error) {
      setSettings(previousSettings);
      setMessage(getApiErrorMessage(error));
    } finally {
      setIsStatusSaving(false);
    }
  }

  return (
    <AdminLayout title="Configurações" navigate={navigate}>
      <Card className="max-w-2xl">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-roseText">Número do WhatsApp</span>
            <input
              className="min-h-14 w-full rounded-[22px] border border-brand/10 bg-white px-4 text-cocoa outline-none focus:border-brand"
              value={settings.whatsappNumber}
              onChange={(event) => setSettings((current) => ({ ...current, whatsappNumber: event.target.value }))}
              placeholder="55..."
            />
          </label>
          <StoreStatusToggle
            value={settings.storeStatus}
            disabled={isStatusSaving}
            onChange={handleStoreStatusChange}
          />
          {isStatusSaving ? <p className="text-sm font-semibold text-muted">Atualizando status da loja...</p> : null}
          {message ? <p className="rounded-[18px] bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">{message}</p> : null}
          <Button className="w-full py-5" type="submit">Salvar configurações</Button>
        </form>
      </Card>
    </AdminLayout>
  );
}
