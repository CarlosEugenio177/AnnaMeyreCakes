import { IsUUID } from 'class-validator';

export class CreateCakeOrderDto {
  @IsUUID()
  doughId!: string;

  @IsUUID()
  cakeSizeId!: string;

  @IsUUID()
  filling1Id!: string;

  @IsUUID()
  filling2Id!: string;

  @IsUUID()
  toppingId!: string;
}
