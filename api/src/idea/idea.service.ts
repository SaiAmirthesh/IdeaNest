import { Injectable, NotFoundException } from '@nestjs/common';
import { GetIdeasQueryDto } from './dto/get-idea.dto';
import { PaginatedResponseDto } from './dto/page-response.dto';
import { Idea } from './model/idea.model';
import { db } from '../db';
import { idea } from '../db/schema';
import { IdeaMapper } from './mapper/idea.mapper';
import { eq, and, count, desc } from 'drizzle-orm';
@Injectable()
export class IdeaService {
  async createIdea(newIdea: Idea): Promise<Idea> {
    newIdea.id = crypto.randomUUID();

    const entity = IdeaMapper.toDatabase(newIdea);
    const [created] = await db.insert(idea).values(entity).returning();

    if (!created) {
      throw new Error('Failed to create idea');
    }

    return IdeaMapper.fromDatabase(created);
  }

  async updateIdea(
    userId: string,
    id: string,
    updatedIdea: Idea,
  ): Promise<Idea> {
    await this.findById(userId, id);
    const [updated] = await db
      .update(idea)
      .set({
        title: updatedIdea.title,
        description: updatedIdea.description,
        status: updatedIdea.status,
        updatedAt: new Date(),
      })
      .where(and(eq(idea.id, id), eq(idea.userId, userId)))
      .returning();

    if (!updated) {
      throw new NotFoundException('Idea not found');
    }

    return IdeaMapper.fromDatabase(updated);
  }

  async findById(userId: string, id: string): Promise<Idea> {
    const [found] = await db
      .select()
      .from(idea)
      .where(and(eq(idea.id, id), eq(idea.userId, userId)));

    if (!found) {
      throw new NotFoundException('Idea Not Found');
    }
    return IdeaMapper.fromDatabase(found);
  }

  async findAll(
    userId: string,
    query: GetIdeasQueryDto,
  ): Promise<PaginatedResponseDto<Idea>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const offset = (page - 1) * limit;

    const ideas = await db
      .select()
      .from(idea)
      .where(eq(idea.userId, userId))
      .orderBy(desc(idea.updatedAt))
      .limit(limit)
      .offset(offset);

    const [{ count: total } = { count: 0 }] = await db
      .select({
        count: count(),
      })
      .from(idea)
      .where(eq(idea.userId, userId));

    return {
      data: ideas.map((idea) => IdeaMapper.fromDatabase(idea)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteIdea(userId: string, id: string): Promise<void> {
    await this.findById(userId, id);
    await db.delete(idea).where(and(eq(idea.id, id), eq(idea.userId, userId)));
  }
}
