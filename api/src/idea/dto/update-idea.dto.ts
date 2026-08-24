import { IsString, IsOptional, Length, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IdeaStatus } from '../model/idea-status.model';

export class UpdateIdeaDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @ApiPropertyOptional({
    example: 'Idea Storage',
    description: 'Title of the entity',
  })
  readonly title?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @ApiPropertyOptional({
    example: 'A workspace to store and refine thoughts',
    description: 'Detailed description',
  })
  readonly description?: string;

  @ApiPropertyOptional({
    enum: IdeaStatus,
    example: IdeaStatus.THINKING,
    description: 'Current status of the idea',
  })
  @IsOptional()
  @IsEnum(IdeaStatus, {
    message:
      'Status must be one of SEED, THINKING, BUILDING, DORMANT, COMPLETED, ARCHEIVED',
  })
  readonly status?: IdeaStatus;
}
