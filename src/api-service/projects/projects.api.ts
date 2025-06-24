import { Project, ProjectEngineerRequirement, ProjectUser } from "@/utils/types";
import baseApi from "../api";

// Types for API requests and responses
interface CreateProjectDto {
  project_id: string;
  name: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pmId: number;
  leadId: number;
}

interface UpdateProjectDto {
  name?: string;
  startdate?: Date;
  enddate?: Date;
  status?: string;
  pmId?: number;
  leadId?: number;
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
      keepUnusedDataFor: 300,
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
    getProjectsByUserId: builder.query<
      Project[],
      { userId: number; filter?: string }
    >({
      query: ({ userId, filter }) => ({
        url: `/project/user/${userId}?filter=${filter || ""}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [
        { type: "PROJECT", id: `user-${arg.userId}` },
      ],
    }),

    // Update project
    updateProject: builder.mutation<
      ApiResponse<Project>,
      { id: number; data: UpdateProjectDto }
    >({
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
      { id: string | number; engineers: AssignEngineerRequest["engineers"] }
    >({
      query: ({ id, engineers }) => ({
        url: `/project/${id}/engineer`,
        method: "POST",
        body: { engineers },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PROJECT", id },
        "PROJECT_USER",
      ],
    }),

    // Toggle is_shadow for a specific engineer in a project
    toggleShadowStatus: builder.mutation<
      { message: string },
      { projectId: string | number; projectUserId: number; is_shadow: boolean }
    >({
      query: ({ projectId, projectUserId, is_shadow }) => ({
        url: `/project/engineer/shadow/${projectUserId}`,
        method: "PUT",
        body: { is_shadow },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "PROJECT", id: projectId },
      ],
    }),


    // Get additional requests
    getAdditionalRequests: builder.query<
      ApiResponse<ProjectEngineerRequirement[]>,
      void
    >({
      query: () => ({
        url: "/project/requests",
        method: "GET",
      }),
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
  useToggleShadowStatusMutation,
  useGetAdditionalRequestsQuery,
} = projectApi;
