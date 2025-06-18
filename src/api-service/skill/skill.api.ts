
import { Skill } from "@/utils/types";
import baseApi from "../api";

export const skillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSkills: builder.query<Skill[], void>({
      query: () => ({
        url: "/skills",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSkillsQuery } = skillApi;
