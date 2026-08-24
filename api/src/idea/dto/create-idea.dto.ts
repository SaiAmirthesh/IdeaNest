import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IdeaStatus } from '../model/idea-status.model';

export class CreateIdeaDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @ApiProperty({ example: 'Idea Storage', description: 'Title of the entity' })
  readonly title!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  @ApiProperty({
    example: 'A workspace to store and refine thoughts',
    description: 'Detailed description',
  })
  readonly description!: string;

  @ApiPropertyOptional({
    enum: IdeaStatus,
    example: IdeaStatus.SEED,
    description: 'Initial status of the idea',
  })
  @IsOptional()
  @IsEnum(IdeaStatus, {
    message:
      'Status must be one of SEED, THINKING, BUILDING, DORMANT, COMPLETED, ARCHEIVED',
  })
  readonly status?: IdeaStatus;
}
