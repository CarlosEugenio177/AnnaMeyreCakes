import { StoreStatus } from '@prisma/client';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  const prisma = {
    settings: {
      upsert: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('upserts the singleton settings record', async () => {
    prisma.settings.upsert.mockResolvedValue({
      id: 'settings-id',
      key: 'global',
      whatsappNumber: '5599999999999',
      storeStatus: StoreStatus.OPEN,
    });

    await expect(
      new SettingsService(prisma as never).getSettings(),
    ).resolves.toMatchObject({ storeStatus: StoreStatus.OPEN });
    expect(prisma.settings.upsert).toHaveBeenCalledWith({
      where: { key: 'global' },
      update: {},
      create: {
        key: 'global',
        whatsappNumber: process.env.DEFAULT_WHATSAPP_NUMBER ?? '',
        storeStatus: StoreStatus.OPEN,
      },
    });
  });

  it('updates only provided settings fields', async () => {
    prisma.settings.upsert.mockResolvedValue({ id: 'settings-id' });
    prisma.settings.update.mockResolvedValue({
      id: 'settings-id',
      whatsappNumber: '5511999999999',
    });

    await new SettingsService(prisma as never).updateSettings({
      whatsappNumber: '5511999999999',
    });

    expect(prisma.settings.update).toHaveBeenCalledWith({
      where: { key: 'global' },
      data: { whatsappNumber: '5511999999999' },
    });
  });
});
