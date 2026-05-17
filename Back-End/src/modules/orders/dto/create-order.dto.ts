import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsISO8601,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CustomerContactDto } from '../../customers/dto/customer-contact.dto';
import { CreateCakeOrderDto } from './create-cake-order.dto';
import { CreateSweetOrderDto } from './create-sweet-order.dto';

export class CreateOrderDto extends CustomerContactDto {
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
