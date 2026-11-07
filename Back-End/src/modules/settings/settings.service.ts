import { Injectable } from '@nestjs/common';
import { Settings, StoreStatus } from '@prisma/client';
import { buildPixPayload } from '../../common/utils/pix';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

export type PixCharge = {
  code: string;
  amount: number;
  key: string;
  merchantName: string;
};

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

    return {
      whatsappNumber: settings.whatsappNumber,
      storeStatus: settings.storeStatus,
    };
  }

  async getAdminSettings() {
    const settings = await this.getSettings();

    return this.toAdminDto(settings);
  }

  async updateSettings(dto: UpdateSettingsDto) {
    await this.getSettings();

    const data: Partial<Settings> = {};
    if (dto.whatsappNumber !== undefined) {
      data.whatsappNumber = dto.whatsappNumber;
    }
    if (dto.storeStatus !== undefined) {
      data.storeStatus = dto.storeStatus;
    }
    // Campos de Pix vazios desativam a cobranca via Pix.
    if (dto.pixKey !== undefined) {
      data.pixKey = dto.pixKey.trim() || null;
    }
    if (dto.pixMerchantName !== undefined) {
      data.pixMerchantName = dto.pixMerchantName.trim() || null;
    }
    if (dto.pixMerchantCity !== undefined) {
      data.pixMerchantCity = dto.pixMerchantCity.trim() || null;
    }

    const settings = await this.prisma.settings.update({
      where: { key: 'global' },
      data,
    });

    return this.toAdminDto(settings);
  }

  // Monta a cobranca Pix (copia e cola) de um valor, se a loja tiver Pix configurado.
  buildPixCharge(settings: Settings, amount: number, txid: string): PixCharge | null {
    if (!settings.pixKey || !settings.pixMerchantName || !settings.pixMerchantCity) {
      return null;
    }

    return {
      code: buildPixPayload({
        key: settings.pixKey,
        merchantName: settings.pixMerchantName,
        merchantCity: settings.pixMerchantCity,
        amount,
        txid,
      }),
      amount,
      key: settings.pixKey,
      merchantName: settings.pixMerchantName,
    };
  }

  private toAdminDto(settings: Settings) {
    return {
      whatsappNumber: settings.whatsappNumber,
      storeStatus: settings.storeStatus,
      pixKey: settings.pixKey ?? '',
      pixMerchantName: settings.pixMerchantName ?? '',
      pixMerchantCity: settings.pixMerchantCity ?? '',
    };
  }
}
