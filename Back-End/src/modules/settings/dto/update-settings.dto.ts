import { StoreStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MinLength(8)
  whatsappNumber?: string;

  @IsOptional()
  @IsEnum(StoreStatus)
  storeStatus?: StoreStatus;
}
