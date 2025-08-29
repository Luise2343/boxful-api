import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

class DimensionsDto {
  @IsNumber() @Min(0) l!: number;
  @IsNumber() @Min(0) w!: number;
  @IsNumber() @Min(0) h!: number;
}
class PackageDto {
  @IsString() @IsNotEmpty() description!: string;
  @IsNumber() @Min(0) weight!: number;
  @ValidateNested() @Type(() => DimensionsDto) dimensions!: DimensionsDto;
}
export class CreateOrderDto {
  @IsString() @IsNotEmpty() customerName!: string;
  @IsString() @IsNotEmpty() customerPhone!: string;
  @IsString() @IsNotEmpty() address!: string;
  @IsEnum(['PENDING','IN_PROGRESS','DELIVERED','CANCELLED']) status?: OrderStatus;
  @IsArray() @ArrayMinSize(1)
  @ValidateNested({ each: true }) @Type(() => PackageDto)
  packages!: PackageDto[];
}
