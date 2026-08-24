import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Note, UpdateNoteDto } from './types';

interface NotesState {
  notes: Note[];
  searchTerm: string;
  selectedIdeaIdFilter: string | 'ALL';
  selectedNoteId: string | null;
}

const initialState: NotesState = {
  notes: [],
  searchTerm: '',
  selectedIdeaIdFilter: 'ALL',
  selectedNoteId: null,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes(state, action: PayloadAction<Note[]>) {
      state.notes = action.payload;
    },
    addNote(state, action: PayloadAction<Note>) {
      state.notes.unshift(action.payload);
    },
    updateNote(state, action: PayloadAction<UpdateNoteDto>) {
      const index = state.notes.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = {
          ...state.notes[index]!,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter((n) => n.id !== action.payload);
      if (state.selectedNoteId === action.payload) {
        state.selectedNoteId = null;
      }
    },
    setNotesSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setIdeaFilter(state, action: PayloadAction<string | 'ALL'>) {
      state.selectedIdeaIdFilter = action.payload;
    },
    setSelectedNoteId(state, action: PayloadAction<string | null>) {
      state.selectedNoteId = action.payload;
    },
  },
});

export const {
  setNotes,
  addNote,
  updateNote,
  deleteNote,
  setNotesSearchTerm,
  setIdeaFilter,
  setSelectedNoteId,
} = notesSlice.actions;

export default notesSlice.reducer;
