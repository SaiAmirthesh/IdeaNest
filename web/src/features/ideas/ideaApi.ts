import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Idea {
  id: string;
  title: string;
  description: string;
  status:
    | "SEED"
    | "THINKING"
    | "BUILDING"
    | "DORMANT"
    | "COMPLETED"
    | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
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
}

export interface UpdateIdeaDto {
  title?: string;
  description?: string;
  status?: Idea["status"];
}

// TODO: Replace with your actual backend URL when integrating
const baseUrl = '/api';

export const ideaApi = createApi({
  reducerPath: 'ideaApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      // Better Auth credentials are cookie-based, but headers can be appended here if needed
      return headers;
    },
  }),
  tagTypes: ['Idea'],
  endpoints: () => ({
    // TODO: Implement endpoints:
    // - getIdeas (Query)
    // - getIdea (Query)
    // - createIdea (Mutation)
    // - updateIdea (Mutation)
    // - deleteIdea (Mutation)
  }),
});

export const {} = ideaApi; // Add exported hooks here once endpoints are defined
export default ideaApi;
