import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpsertDoughDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  colorHex!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpsertFillingDto extends UpsertDoughDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  extraPrice!: number;
}

export class UpsertToppingDto extends UpsertDoughDto {}

export class UpsertCakeSizeDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  slices!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpsertSweetTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePer100!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpsertSweetFlavorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  sweetTypeId!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
