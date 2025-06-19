import { Project, ProjectEngineerRequirement, ProjectUser } from "@/utils/types";
import baseApi from "../api";

interface AuditLogType {
  id: number;
  action_type: string;
  timestamp: Date;
  change_summary: string;
  actor_user_id: string;
}

export const logApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLogs: builder.query<{data : AuditLogType[]}, void>({
      query: () => ({
        url: "/audit-logs",
        method: "GET",
      }),
      keepUnusedDataFor: 300,
      // providesTags: ["LOG"],
    }),

  }),
});

export const {
 useGetAllLogsQuery,
 useLazyGetAllLogsQuery
} = logApi;
