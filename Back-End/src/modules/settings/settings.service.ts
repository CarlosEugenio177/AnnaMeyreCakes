import { Injectable } from '@nestjs/common';
import { Settings, StoreStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(): Promise<Settings> {
    return this.prisma.$transaction(async (tx) => {
      const records = await tx.settings.findMany({
        orderBy: { createdAt: 'asc' },
      });

      if (records.length === 0) {
        return tx.settings.create({
          data: {
            whatsappNumber: process.env.DEFAULT_WHATSAPP_NUMBER ?? '',
            storeStatus: StoreStatus.OPEN,
          },
        });
      }

      const [first, ...extraRecords] = records;

      if (extraRecords.length > 0) {
        await tx.settings.deleteMany({
          where: {
            id: { in: extraRecords.map((settings) => settings.id) },
          },
        });
      }

      return first;
    });
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<Settings> {
    const settings = await this.getSettings();

    return this.prisma.settings.update({
      where: { id: settings.id },
      data: {
        ...(dto.whatsappNumber !== undefined
          ? { whatsappNumber: dto.whatsappNumber }
          : {}),
        ...(dto.storeStatus !== undefined ? { storeStatus: dto.storeStatus } : {}),
      },
    });
  }
}
