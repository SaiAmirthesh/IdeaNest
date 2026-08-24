import { IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetIdeasQueryDto {
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @Max(100)
  limit: number = 50;
}
