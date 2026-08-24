export class Note {
  id!: string;
  userId!: string;
  ideaId?: string | null;
  title!: string;
  content!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
