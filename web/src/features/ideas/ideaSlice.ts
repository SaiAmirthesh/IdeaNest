import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Idea, IdeaStatus } from './types';

interface IdeasState {
  ideas: Idea[];
  searchTerm: string;
  statusFilter: IdeaStatus | 'ALL';
  selectedIdeaId: string | null;
}

const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'One-click Asset Defense',
    description: 'An advanced platform to protect and manage digital art assets using blockchain technology and AI verification. Inspired by DeFi Horizon systems.',
    status: 'BUILDING',
    notes: 'Implement soft glowing gradients, glass cards, and secure transaction validation wrappers. Reference the dashboard UI design guidelines.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Personal Knowledge Labyrinth',
    description: 'A second-brain application that maps complex concepts into interactive, navigable 3D node graphs with community detection.',
    status: 'THINKING',
    notes: 'Draft nodes layout in canvas. Integrate with graphify-windows system for persistence and god node grouping.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Drizzle Better Auth Adapter',
    description: 'Production-ready database adapter that securely handles cookie-based sessions inside NestJS microservices.',
    status: 'COMPLETED',
    notes: 'Tests written and passing. Session validation takes < 5ms under load. Schema setup with postgres is fully automated.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Automated Code Review Agent',
    description: 'An agentic AI reviewer that automatically runs on git push, analyzing file changes and proposing context-aware modifications.',
    status: 'SEED',
    notes: 'Investigate using DeepMind Antigravity models or custom local LLM pipelines for security code compliance.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Stitch UI Design Generator',
    description: 'Generate high-fidelity, premium glassmorphism interfaces directly from markdown wireframes and user system specifications.',
    status: 'DORMANT',
    notes: 'Currently on hold until Vite configuration updates are finalized. Resume in Q3.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialState: IdeasState = {
  ideas: mockIdeas,
  searchTerm: '',
  statusFilter: 'ALL',
  selectedIdeaId: null,
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    addIdea(state, action: PayloadAction<Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>>) {
      const newIdea: Idea = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.ideas.unshift(newIdea);
    },
    updateIdea(state, action: PayloadAction<Partial<Idea> & { id: string }>) {
      const index = state.ideas.findIndex(idea => idea.id === action.payload.id);
      if (index !== -1) {
        state.ideas[index] = {
          ...state.ideas[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteIdea(state, action: PayloadAction<string>) {
      state.ideas = state.ideas.filter(idea => idea.id !== action.payload);
      if (state.selectedIdeaId === action.payload) {
        state.selectedIdeaId = null;
      }
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<IdeaStatus | 'ALL'>) {
      state.statusFilter = action.payload;
    },
    setSelectedIdeaId(state, action: PayloadAction<string | null>) {
      state.selectedIdeaId = action.payload;
    },
  },
});

export const {
  addIdea,
  updateIdea,
  deleteIdea,
  setSearchTerm,
  setStatusFilter,
  setSelectedIdeaId,
} = ideasSlice.actions;

export default ideasSlice.reducer;
