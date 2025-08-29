import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

export class ListOrdersDto {
  @IsOptional() @IsString() search?: string; // name or phone (contains)
  @IsOptional() @IsEnum(['PENDING','IN_PROGRESS','DELIVERED','CANCELLED']) status?: OrderStatus;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @IsPositive() limit: number = 10;
}
