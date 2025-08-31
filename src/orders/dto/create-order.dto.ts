import { Type } from 'class-transformer';
import {
  ArrayMinSize, IsArray, IsEnum, IsNotEmpty,
  IsNumber, IsOptional, IsString, Min, ValidateNested
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../schemas/order.schema';

class DimensionsDto {
  @ApiProperty() @IsNumber() @Min(0) l!: number;
  @ApiProperty() @IsNumber() @Min(0) w!: number;
  @ApiProperty() @IsNumber() @Min(0) h!: number;
}
class PackageDto {
  @ApiProperty() @IsString() @IsNotEmpty() description!: string;
  @ApiProperty() @IsNumber() @Min(0) weight!: number;
  @ApiProperty({ type: DimensionsDto })
  @ValidateNested() @Type(() => DimensionsDto) dimensions!: DimensionsDto;
}

export class CreateOrderDto {
  @ApiProperty() @IsString() @IsNotEmpty() customerName!: string;
  @ApiProperty() @IsString() @IsNotEmpty() customerPhone!: string;
  @ApiProperty() @IsString() @IsNotEmpty() address!: string;

  // NUEVO
  @ApiProperty({ example: 'San Salvador' }) @IsString() @IsNotEmpty() department!: string;
  @ApiProperty({ example: 'San Salvador' }) @IsString() @IsNotEmpty() municipality!: string;

  @ApiPropertyOptional({ enum: ['PENDING','IN_PROGRESS','DELIVERED','CANCELLED'] })
  @IsOptional() @IsEnum(['PENDING','IN_PROGRESS','DELIVERED','CANCELLED'])
  status?: OrderStatus;

  @ApiProperty({ type: [PackageDto] })
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => PackageDto)
  packages!: PackageDto[];
}
