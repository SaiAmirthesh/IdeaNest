import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Note, CreateNoteDto, UpdateNoteDto, GetNotesParams } from './types';

export interface PaginatedNotesResponse {
  data: Note[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const noteApi = createApi({
  reducerPath: 'noteApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ['Note'],
  endpoints: (builder) => ({
    getNotes: builder.query<PaginatedNotesResponse, GetNotesParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && typeof params === 'object') {
          if (params.ideaId) queryParams.set('ideaId', params.ideaId);
          if (params.page !== undefined) queryParams.set('page', String(params.page));
          if (params.limit !== undefined) queryParams.set('limit', String(params.limit));
        }
        const qs = queryParams.toString();
        return qs ? `/notes?${qs}` : '/notes';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Note' as const, id })),
              { type: 'Note', id: 'LIST' },
            ]
          : [{ type: 'Note', id: 'LIST' }],
    }),

    getNote: builder.query<Note, string>({
      query: (id) => `/notes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Note', id }],
    }),

    createNote: builder.mutation<Note, CreateNoteDto>({
      query: (body) => ({
        url: '/notes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),

    updateNote: builder.mutation<Note, UpdateNoteDto>({
      query: ({ id, ...body }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Note', id },
        { type: 'Note', id: 'LIST' },
      ],
    }),

    deleteNote: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = noteApi;

export default noteApi;
