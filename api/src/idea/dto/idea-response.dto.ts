import { ApiProperty } from '@nestjs/swagger';
import { IdeaStatus } from '../model/idea-status.model';

export class IdeaResponseDto {
  @ApiProperty({
    example: 'clz8w4m0j0000abc123',
    description: 'Unique identifier',
  })
  readonly id!: string;

  @ApiProperty({ example: 'BuildFlow AI', description: 'Title of the entity' })
  readonly title!: string;

  @ApiProperty({
    example: 'AI operating system for product development',
    description: 'Detailed description',
  })
  readonly description!: string;

  @ApiProperty({
    enum: IdeaStatus,
    example: IdeaStatus.THINKING,
    description: 'Current status of the idea',
  })
  readonly status!: IdeaStatus;

  @ApiProperty({
    example: '2026-07-02T13:25:11.215Z',
    description: 'Creation timestamp',
    format: 'date-time',
  })
  readonly createdAt!: Date;

  @ApiProperty({
    example: '2026-07-02T13:25:11.215Z',
    description: 'Last update timestamp',
    format: 'date-time',
  })
  readonly updatedAt!: Date;
}
