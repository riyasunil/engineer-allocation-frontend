import { Project, User, UserData } from "@/utils/types";
import baseApi from "../api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addEngineer: builder.mutation<void, UserData>({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        body: payload,
      }),
    }),

    getEngineers: builder.query<User[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),

    getUserById: builder.query<User, String>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),

    updateEngineer: builder.mutation<void, UserData>({
      query: (payload) => ({
        url: `/users/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),

  }),
});

export const { useAddEngineerMutation, useGetUserByIdQuery, useGetEngineersQuery, useUpdateEngineerMutation } = userApi;
