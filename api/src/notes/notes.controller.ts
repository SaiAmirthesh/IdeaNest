import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { auth } from '../auth/auth';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteResponseDto } from './dto/note-response.dto';
import { GetNotesQueryDto } from './dto/get-notes.dto';
import { NoteMapper } from './mapper/note.mapper';
import { PaginatedResponseDto } from '../idea/dto/page-response.dto';

@Controller(['notes', 'api/notes'])
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(201)
  async createNote(
    @Req() req: Request,
    @Body() dto: CreateNoteDto,
  ): Promise<NoteResponseDto> {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session) {
      throw new UnauthorizedException();
    }

    const note = NoteMapper.fromCreateDto(dto, session.user.id);
    const created = await this.notesService.createNote(session.user.id, note);
    return NoteMapper.toResponseDto(created);
  }

  @Put(':id')
  @HttpCode(200)
  async updateNote(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session) {
      throw new UnauthorizedException();
    }

    const existing = await this.notesService.findById(session.user.id, id);
    const note = NoteMapper.fromUpdateDto(existing, dto);
    const updated = await this.notesService.updateNote(
      session.user.id,
      id,
      note,
    );
    return NoteMapper.toResponseDto(updated);
  }

  @Get()
  async getNotes(
    @Req() req: Request,
    @Query() query: GetNotesQueryDto,
  ): Promise<PaginatedResponseDto<NoteResponseDto>> {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session) {
      throw new UnauthorizedException();
    }

    const result = await this.notesService.findAll(session.user.id, query);
    return {
      ...result,
      data: result.data.map((n) => NoteMapper.toResponseDto(n)),
    };
  }

  @Get(':id')
  async getNoteById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<NoteResponseDto> {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session) {
      throw new UnauthorizedException();
    }

    const found = await this.notesService.findById(session.user.id, id);
    return NoteMapper.toResponseDto(found);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteNote(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<void> {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    if (!session) {
      throw new UnauthorizedException();
    }

    await this.notesService.deleteNote(session.user.id, id);
  }
}
