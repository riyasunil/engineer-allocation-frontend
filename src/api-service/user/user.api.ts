import { Project, User } from "@/utils/types";
import baseApi from "../api";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addEngineer: builder.mutation<void, User>({
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

  }),
});

export const { useAddEngineerMutation, useGetUserByIdQuery, useGetEngineersQuery, useLazyGetUserByIdQuery } = userApi;
