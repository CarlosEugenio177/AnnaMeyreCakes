import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateCakeOrderDto } from './create-cake-order.dto';
import { CreateSweetOrderDto } from './create-sweet-order.dto';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsString()
  @MinLength(8)
  customerPhone!: string;

  @IsISO8601()
  desiredDate!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @ValidateNested()
  @Type(() => CreateCakeOrderDto)
  cake!: CreateCakeOrderDto;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateSweetOrderDto)
  sweets?: CreateSweetOrderDto[];
}
