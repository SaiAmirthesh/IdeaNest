import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiPropertyOptional({
    example: 'clz8w4m0j0000abc123',
    description: 'Optional associated Idea ID',
  })
  @IsOptional()
  @IsString()
  readonly ideaId?: string;

  @ApiProperty({
    example: 'Architecture & System Requirements',
    description: 'Title or subject of the note',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  readonly title!: string;

  @ApiProperty({
    example:
      'Detailed markdown specifications, checklist items, and research links.',
    description: 'Note content',
  })
  @IsNotEmpty()
  @IsString()
  readonly content!: string;
}
