import baseApi from "../api";

// Response is a binary Blob (PDF)
export const aiReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    downloadAiReport: builder.mutation<Blob, void>({
      query: () => ({
        url: "/report/download",
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useDownloadAiReportMutation } = aiReportApi;
