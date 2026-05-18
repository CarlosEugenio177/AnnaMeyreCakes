import { Injectable } from '@nestjs/common';
import { Settings, StoreStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(): Promise<Settings> {
    return this.prisma.settings.upsert({
      where: { key: 'global' },
      update: {},
      create: {
        key: 'global',
        whatsappNumber: process.env.DEFAULT_WHATSAPP_NUMBER ?? '',
        storeStatus: StoreStatus.OPEN,
      },
    });
  }

  async getPublicSettings() {
    const settings = await this.getSettings();

    return this.toSettingsDto(settings);
  }

  async getAdminSettings() {
    const settings = await this.getSettings();

    return this.toSettingsDto(settings);
  }

  async updateSettings(dto: UpdateSettingsDto) {
    await this.getSettings();

    const settings = await this.prisma.settings.update({
      where: { key: 'global' },
      data: {
        ...(dto.whatsappNumber !== undefined
          ? { whatsappNumber: dto.whatsappNumber }
          : {}),
        ...(dto.storeStatus !== undefined ? { storeStatus: dto.storeStatus } : {}),
      },
    });

    return this.toSettingsDto(settings);
  }

  private toSettingsDto(settings: Pick<Settings, 'whatsappNumber' | 'storeStatus'>) {
    return {
      whatsappNumber: settings.whatsappNumber,
      storeStatus: settings.storeStatus,
    };
  }
}
