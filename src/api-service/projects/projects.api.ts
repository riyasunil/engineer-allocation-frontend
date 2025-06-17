import { Project } from "@/utils/types";
import baseApi from "../api";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation<Project, Project>({
      query: (payload) => ({
        url: "/project",
        method: "POST",
        body: payload,
      }),
    }),

    getProjectById: builder.query<Project, string>({
      query: (id) => ({
        url: `/project/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectByIdQuery,
} = employeeApi;
