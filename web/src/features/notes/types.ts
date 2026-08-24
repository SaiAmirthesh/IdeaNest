export interface Note {
  id: string;
  userId?: string;
  ideaId?: string | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  ideaId?: string | null;
}

export interface UpdateNoteDto {
  id: string;
  title?: string;
  content?: string;
  ideaId?: string | null;
}

export interface GetNotesParams {
  ideaId?: string;
  page?: number;
  limit?: number;
}
