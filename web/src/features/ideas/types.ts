export type IdeaStatus = 'SEED' | 'THINKING' | 'BUILDING' | 'DORMANT' | 'COMPLETED' | 'ARCHIVED';

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  ideaId: string;
  action: string;
  timestamp: string;
}
