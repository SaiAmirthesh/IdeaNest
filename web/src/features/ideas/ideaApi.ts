import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Idea, IdeaStatus } from './types';

export interface PaginatedIdeasResponse {
  data: Idea[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetIdeasParams {
  page?: number;
  limit?: number;
}

export interface CreateIdeaDto {
  title: string;
  description: string;
  status?: IdeaStatus;
}

export interface UpdateIdeaDto {
  title?: string;
  description?: string;
  status?: IdeaStatus;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const ideaApi = createApi({
  reducerPath: 'ideaApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ['Idea'],
  endpoints: (builder) => ({
    getIdeas: builder.query<PaginatedIdeasResponse, GetIdeasParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && typeof params === 'object') {
          if (params.page !== undefined) queryParams.set('page', String(params.page));
          if (params.limit !== undefined) queryParams.set('limit', String(params.limit));
        }
        const qs = queryParams.toString();
        return qs ? `/ideas?${qs}` : '/ideas';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Idea' as const, id })),
              { type: 'Idea', id: 'LIST' },
            ]
          : [{ type: 'Idea', id: 'LIST' }],
    }),

    getIdea: builder.query<Idea, string>({
      query: (id) => `/ideas/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Idea', id }],
    }),

    createIdea: builder.mutation<Idea, CreateIdeaDto>({
      query: (body) => ({
        url: '/ideas',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Idea', id: 'LIST' }],
    }),

    updateIdea: builder.mutation<Idea, { id: string } & UpdateIdeaDto>({
      query: ({ id, ...body }) => ({
        url: `/ideas/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Idea', id },
        { type: 'Idea', id: 'LIST' },
      ],
    }),

    deleteIdea: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ideas/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Idea', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetIdeasQuery,
  useGetIdeaQuery,
  useCreateIdeaMutation,
  useUpdateIdeaMutation,
  useDeleteIdeaMutation,
} = ideaApi;

export default ideaApi;
