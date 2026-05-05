import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { IsEnum, IsISO8601, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsISO8601()
  paidAt?: string;
}
