import { StoreStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MinLength(8)
  whatsappNumber?: string;

  @IsOptional()
  @IsEnum(StoreStatus)
  storeStatus?: StoreStatus;

  // Chave Pix: CPF/CNPJ, e-mail, telefone (+55...) ou chave aleatoria.
  @IsOptional()
  @IsString()
  @MaxLength(77)
  pixKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  pixMerchantName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  pixMerchantCity?: string;
}
