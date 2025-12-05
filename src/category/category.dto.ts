import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CategoryDTO {
  @IsOptional()
  id?: number | string | null;

  @IsString()
  @ApiProperty()
  name: string;
}
