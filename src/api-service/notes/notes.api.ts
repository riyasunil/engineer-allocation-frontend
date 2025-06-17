import { Note, CreateNoteDto, UpdateNoteDto } from "@/utils/types";
import baseApi from "../api"; // <== make sure this is your `baseApi` from api-service/api.ts

export const notesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all notes for a specific project
    getNotesByProjectId: builder.query<Note[], string>({
      query: (projectId) => ({
        url: `/projects/${projectId}/notes`,
        method: "GET",
      }),
      providesTags: (result, error, projectId) =>
        result
          ? [
              ...result.map((note) => ({ type: "Notes" as const, id: note.id })),
              { type: "Notes", id: `LIST-${projectId}` },
            ]
          : [{ type: "Notes", id: `LIST-${projectId}` }],
    }),

    // POST: Add new note
    createNote: builder.mutation<Note, { projectId: string; data: CreateNoteDto }>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/notes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_, __, { projectId }) => [{ type: "Notes", id: `LIST-${projectId}` }],
    }),

    // PUT: Update note
    updateNote: builder.mutation<Note, { projectId: string; noteId: number; data: UpdateNoteDto }>({
      query: ({ projectId, noteId, data }) => ({
        url: `/projects/${projectId}/notes/${noteId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, { projectId, noteId }) => [
        { type: "Notes", id: noteId },
        { type: "Notes", id: `LIST-${projectId}` },
      ],
    }),

    // DELETE: Delete note
    deleteNote: builder.mutation<{ message: string }, { projectId: string; noteId: number }>({
      query: ({ projectId, noteId }) => ({
        url: `/projects/${projectId}/notes/${noteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { projectId, noteId }) => [
        { type: "Notes", id: noteId },
        { type: "Notes", id: `LIST-${projectId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotesByProjectIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
