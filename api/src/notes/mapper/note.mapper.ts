import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { NoteResponseDto } from '../dto/note-response.dto';
import { Note } from '../model/note.model';
import type { InferSelectModel } from 'drizzle-orm';
import { note } from '../../db/schema';

export class NoteMapper {
  static fromCreateDto(dto: CreateNoteDto, userId: string): Note {
    const now = new Date();
    return {
      id: '',
      userId,
      ideaId: dto.ideaId || null,
      title: dto.title,
      content: dto.content,
      createdAt: now,
      updatedAt: now,
    };
  }

  static fromUpdateDto(existing: Note, dto: UpdateNoteDto): Note {
    return {
      ...existing,
      title: dto.title !== undefined ? dto.title : existing.title,
      content: dto.content !== undefined ? dto.content : existing.content,
      ideaId: dto.ideaId !== undefined ? dto.ideaId : existing.ideaId,
      updatedAt: new Date(),
    };
  }

  static toResponseDto(model: Note): NoteResponseDto {
    return {
      id: model.id,
      ideaId: model.ideaId,
      title: model.title,
      content: model.content,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  static toDatabase(model: Note) {
    return {
      id: model.id,
      userId: model.userId,
      ideaId: model.ideaId ?? null,
      title: model.title,
      content: model.content,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  static fromDatabase(entity: InferSelectModel<typeof note>): Note {
    return {
      id: entity.id,
      userId: entity.userId,
      ideaId: entity.ideaId,
      title: entity.title,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
