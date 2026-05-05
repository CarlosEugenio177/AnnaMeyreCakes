import { StoreStatus } from '@prisma/client';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  const tx = {
    settings: {
      findMany: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const prisma = {
    settings: {
      update: jest.fn(),
    },
    $transaction: jest.fn((callback: (client: typeof tx) => unknown) =>
      callback(tx),
    ),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates the singleton settings record when missing', async () => {
    tx.settings.findMany.mockResolvedValue([]);
    tx.settings.create.mockResolvedValue({
      id: 'settings-id',
      whatsappNumber: '',
      storeStatus: StoreStatus.OPEN,
    });

    await expect(
      new SettingsService(prisma as never).getSettings(),
    ).resolves.toMatchObject({ storeStatus: StoreStatus.OPEN });
  });

  it('removes extra settings records and returns the first one', async () => {
    tx.settings.findMany.mockResolvedValue([
      { id: 'first' },
      { id: 'second' },
      { id: 'third' },
    ]);

    await expect(
      new SettingsService(prisma as never).getSettings(),
    ).resolves.toEqual({ id: 'first' });
    expect(tx.settings.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['second', 'third'] } },
    });
  });

  it('updates only provided settings fields', async () => {
    tx.settings.findMany.mockResolvedValue([{ id: 'settings-id' }]);
    prisma.settings.update.mockResolvedValue({
      id: 'settings-id',
      whatsappNumber: '5511999999999',
    });

    await new SettingsService(prisma as never).updateSettings({
      whatsappNumber: '5511999999999',
    });

    expect(prisma.settings.update).toHaveBeenCalledWith({
      where: { id: 'settings-id' },
      data: { whatsappNumber: '5511999999999' },
    });
  });
});
