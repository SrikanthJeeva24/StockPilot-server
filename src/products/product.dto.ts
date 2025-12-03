import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ProductDTO {
  @IsOptional()
  id?: number | string | null;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  sku: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiProperty()
  stock: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number | string | null;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  createdAt?: string;

  @IsOptional()
  updatedAt?: string;
}

export class GetProductsQueryDTO {
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  categoryId?: number;
}
