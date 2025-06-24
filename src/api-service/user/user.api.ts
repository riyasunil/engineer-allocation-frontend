import { Project, User, UserData, UserSkill } from "@/utils/types";
import baseApi from "../api";

interface AssignableUserPayload {
  designation: string;
  skills: number[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addEngineer: builder.mutation<void, UserData>({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        body: payload,
      }),
       invalidatesTags: ["USERS"],
    }),

    getEngineers: builder.query<User[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
       providesTags: ["USERS"],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "USERS", id }],
    }),

    updateEngineer: builder.mutation<void, UserData>({
      query: (payload) => ({
        url: `/users/${payload.user_id}`,
        method: "PUT",
        body: payload,
      }),
         invalidatesTags: (result, error, payload) => [{ type: "USERS", id: payload.user_id }],
    }),

    getAssignableUsers: builder.query<User[], AssignableUserPayload>({
      query: (payload) => ({
        url: "/users/assignable",
        method: "POST", // Using POST since it requires a payload
        body: payload,
      }),
      providesTags: ["USERS"],
    }),

    getAllEngineers: builder.query<User[], void>({
      query: () => ({
        url: "/users/engineer",
        method: "GET",
      }),
             providesTags: ["USERS"],
    }),

    getAllAvailableUsers: builder.query<User[], void>({
      query: () => ({
        url: "/users/available",
        method: "GET",
      }),
        providesTags: ["USERS"],
    }),

    updateExperience: builder.mutation<User, { id: string; experience: number }>({
      query: (payload) => ({
        url: `/users/${payload.id}/experience`,
        method: "PATCH",
        body: payload,
      }),
        invalidatesTags: (result, error, payload) => [{ type: "USERS", id: payload.id }],
    }),

    userSkill: builder.query< UserSkill[] ,{ id: number }>({   //change response type
      query: (payload) => ({
        url: `skills/${payload.id}`,
        method: "GET",
        body: payload,
      }),
    }),

  }),
});

export const {
  useAddEngineerMutation,
  useGetUserByIdQuery,
  useGetEngineersQuery,
  useLazyGetUserByIdQuery,
  useUpdateEngineerMutation,
  useGetAssignableUsersQuery,
  useLazyGetAssignableUsersQuery,
  useGetAllEngineersQuery,
  useGetAllAvailableUsersQuery,
  useUpdateExperienceMutation,
  useUserSkillQuery
} = userApi;
