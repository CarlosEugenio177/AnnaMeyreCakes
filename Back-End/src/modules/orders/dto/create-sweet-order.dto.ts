import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  IsUUID,
} from 'class-validator';

export class CreateSweetOrderDto {
  @IsUUID()
  sweetTypeId!: string;

  @IsInt()
  quantity!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  sweetFlavorIds!: string[];
}
