import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Idea, IdeaStatus } from './types';

interface IdeasState {
  ideas: Idea[];
  searchTerm: string;
  statusFilter: IdeaStatus | 'ALL';
  selectedIdeaId: string | null;
}

const initialState: IdeasState = {
  ideas: [],
  searchTerm: '',
  statusFilter: 'ALL',
  selectedIdeaId: null,
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    setIdeas(state, action: PayloadAction<Idea[]>) {
      state.ideas = action.payload;
    },
    addIdea(state, action: PayloadAction<Idea>) {
      state.ideas.unshift(action.payload);
    },
    updateIdea(state, action: PayloadAction<Partial<Idea> & { id: string }>) {
      const index = state.ideas.findIndex((idea) => idea.id === action.payload.id);
      if (index !== -1) {
        state.ideas[index] = {
          ...state.ideas[index]!,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteIdea(state, action: PayloadAction<string>) {
      state.ideas = state.ideas.filter((idea) => idea.id !== action.payload);
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
  setIdeas,
  addIdea,
  updateIdea,
  deleteIdea,
  setSearchTerm,
  setStatusFilter,
  setSelectedIdeaId,
} = ideasSlice.actions;

export default ideasSlice.reducer;
