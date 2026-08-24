import { Injectable, NotFoundException } from '@nestjs/common';
import { GetNotesQueryDto } from './dto/get-notes.dto';
import { PaginatedResponseDto } from '../idea/dto/page-response.dto';
import { Note } from './model/note.model';
import { db } from '../db';
import { note } from '../db/schema';
import { NoteMapper } from './mapper/note.mapper';
import { eq, and, count, desc } from 'drizzle-orm';

@Injectable()
export class NotesService {
  async createNote(userId: string, newNote: Note): Promise<Note> {
    newNote.id = crypto.randomUUID();
    newNote.userId = userId;

    const entity = NoteMapper.toDatabase(newNote);
    const [created] = await db.insert(note).values(entity).returning();

    if (!created) {
      throw new Error('Failed to create note');
    }

    return NoteMapper.fromDatabase(created);
  }

  async updateNote(
    userId: string,
    id: string,
    updatedNote: Note,
  ): Promise<Note> {
    await this.findById(userId, id);
    const [updated] = await db
      .update(note)
      .set({
        title: updatedNote.title,
        content: updatedNote.content,
        ideaId: updatedNote.ideaId ?? null,
        updatedAt: new Date(),
      })
      .where(and(eq(note.id, id), eq(note.userId, userId)))
      .returning();

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return NoteMapper.fromDatabase(updated);
  }

  async findById(userId: string, id: string): Promise<Note> {
    const [found] = await db
      .select()
      .from(note)
      .where(and(eq(note.id, id), eq(note.userId, userId)));

    if (!found) {
      throw new NotFoundException('Note not found');
    }
    return NoteMapper.fromDatabase(found);
  }

  async findAll(
    userId: string,
    query: GetNotesQueryDto,
  ): Promise<PaginatedResponseDto<Note>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const offset = (page - 1) * limit;

    const whereConditions = query.ideaId
      ? and(eq(note.userId, userId), eq(note.ideaId, query.ideaId))
      : eq(note.userId, userId);

    const notes = await db
      .select()
      .from(note)
      .where(whereConditions)
      .orderBy(desc(note.updatedAt))
      .limit(limit)
      .offset(offset);

    const [{ count: total } = { count: 0 }] = await db
      .select({
        count: count(),
      })
      .from(note)
      .where(whereConditions);

    return {
      data: notes.map((n) => NoteMapper.fromDatabase(n)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteNote(userId: string, id: string): Promise<void> {
    await this.findById(userId, id);
    await db.delete(note).where(and(eq(note.id, id), eq(note.userId, userId)));
  }
}
