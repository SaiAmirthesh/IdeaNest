import { IdeaStatus } from './idea-status.model';

export class Idea {
  id!: string;
  userId!: string;
  title!: string;
  description!: string;
  status!: IdeaStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
