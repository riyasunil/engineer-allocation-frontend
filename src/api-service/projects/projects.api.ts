import { Project, ProjectUser } from "@/utils/types";
import baseApi from "../api";

// Types for API requests and responses
interface CreateProjectDto {
  project_id: string;
  name: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pmId: number; // User ID
  leadId: number; // User ID
}

interface UpdateProjectDto {
  name?: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pmId?: number; // User ID
  leadId?: number; // User ID
}

interface AssignEngineerRequest {
  engineers: Array<{
    user_id: number;
    designation_id?: number;
    is_shadow?: boolean;
    assigned_on?: Date;
    end_date?: Date;
  }>;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new project
    createProject: builder.mutation<ApiResponse<Project>, CreateProjectDto>({
      query: (payload) => ({
        url: "/project",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PROJECT"],
    }),

    getAllProjects: builder.query<Project[], void>({
      query: () => ({
        url: "/project",
        method: "GET",
      }),
      providesTags: ["PROJECT"],
    }),

    // Get project by ID
    getProjectById: builder.query<Project, string | number>({
      query: (id) => ({
        url: `/project/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PROJECT", id }],
    }),

    // Get projects by user ID
    getProjectsByUserId: builder.query<Project[], string | number>({
      query: (userId) => ({
        url: `/project/user/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "PROJECT", id: `user-${userId}` },
      ],
    }),

    // Update project
    updateProject: builder.mutation<
      ApiResponse<Project>,
      { id: string | number; data: UpdateProjectDto }>
      ({
      query: ({ id, data }) => ({
        url: `/project/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PROJECT", id },
        "PROJECT",
      ],
    }),

    // Delete project
    deleteProject: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PROJECT", id },
        "PROJECT",
      ],
    }),

    // Assign engineer to project
    assignEngineerToProject: builder.mutation<
      { message: string },
      { id: string | number; engineers: AssignEngineerRequest["engineers"] }>
      ({
      query: ({ id, engineers }) => ({
        url: `/project/${id}/assign-engineer`,
        method: "POST",
        body: { engineers },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PROJECT", id },
        "PROJECT_USER",
      ],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectsByUserIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAssignEngineerToProjectMutation,
} = projectApi; 