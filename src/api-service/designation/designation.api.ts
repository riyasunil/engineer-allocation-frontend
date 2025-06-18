import { Designation } from "@/utils/types";
import baseApi from "../api";

export const designationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    

    getDesignation: builder.query<Designation[], void>({
      query: () => ({
        url: "/designations",
        method: "GET",
      }),
    }),

  }),
});

export const {
    useGetDesignationQuery,
} = designationApi;
