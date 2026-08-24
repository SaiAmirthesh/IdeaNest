import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetNotesQueryDto {
  @ApiPropertyOptional({
    example: 'clz8w4m0j0000abc123',
    description: 'Filter notes by associated Idea ID',
  })
  @IsOptional()
  @IsString()
  readonly ideaId?: string;

  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page?: number;

  @ApiPropertyOptional({ example: 10, description: 'Limit per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly limit?: number;
}
