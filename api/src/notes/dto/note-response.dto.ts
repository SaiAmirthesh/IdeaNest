import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty({
    example: 'clz8w4m0j0000abc123',
    description: 'Unique identifier',
  })
  readonly id!: string;

  @ApiPropertyOptional({
    example: 'clz8w4m0j0000abc123',
    description: 'Associated Idea ID',
  })
  readonly ideaId?: string | null;

  @ApiProperty({
    example: 'Architecture & System Requirements',
    description: 'Title of the note',
  })
  readonly title!: string;

  @ApiProperty({
    example: 'Detailed markdown specifications and research notes.',
    description: 'Note content',
  })
  readonly content!: string;

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
