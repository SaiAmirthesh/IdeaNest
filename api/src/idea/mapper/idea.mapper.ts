import { CreateIdeaDto } from '../dto/create-idea.dto';
import { UpdateIdeaDto } from '../dto/update-idea.dto';
import { IdeaResponseDto } from '../dto/idea-response.dto';
import { Idea } from '../model/idea.model';
import { IdeaStatus } from '../model/idea-status.model';
import type { InferSelectModel } from 'drizzle-orm';
import { idea } from '../../db/schema';

export class IdeaMapper {
  static fromCreateDto(dto: CreateIdeaDto, userId: string): Idea {
    const now = new Date();

    return {
      id: '',
      userId,
      title: dto.title,
      description: dto.description,
      status: dto.status ?? IdeaStatus.SEED,
      createdAt: now,
      updatedAt: now,
    };
  }

  static fromUpdateDto(existing: Idea, dto: UpdateIdeaDto): Idea {
    return {
      ...existing,
      title: dto.title !== undefined ? dto.title : existing.title,
      description:
        dto.description !== undefined ? dto.description : existing.description,
      status: dto.status !== undefined ? dto.status : existing.status,
      updatedAt: new Date(),
    };
  }

  static toResponseDto(idea: Idea): IdeaResponseDto {
    return {
      id: idea.id,
      title: idea.title,
      description: idea.description,
      status: idea.status,
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
    };
  }

  static toDatabase(model: Idea) {
    return {
      id: model.id,
      userId: model.userId,
      title: model.title,
      description: model.description,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  static fromDatabase(entity: InferSelectModel<typeof idea>): Idea {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      status: entity.status as IdeaStatus,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
