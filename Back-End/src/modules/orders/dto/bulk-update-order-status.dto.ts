import { ArrayNotEmpty, IsArray, IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class BulkUpdateOrderStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  orderIds!: string[];

  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
