import { IsString, IsOptional, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiPropertyOptional({
    example: 'Updated Note Title',
    description: 'Updated title of the note',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  readonly title?: string;

  @ApiPropertyOptional({
    example: 'Updated detailed markdown content...',
    description: 'Updated note content',
  })
  @IsOptional()
  @IsString()
  readonly content?: string;

  @ApiPropertyOptional({
    example: 'clz8w4m0j0000abc123',
    description: 'Update associated Idea ID',
  })
  @IsOptional()
  @IsString()
  readonly ideaId?: string | null;
}
