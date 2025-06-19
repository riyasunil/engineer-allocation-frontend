import baseApi from "../api";interface CreateRequirementDto {
  project_id: number;
  designation_id: number;
  required_count: number;
  skills: number[];
  engineers?: number[];
}interface UpdateRequirementDto {
  required_count?: number;
  skills?: number[];
}export const projectRequirementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRequirement: builder.mutation<any, CreateRequirementDto>({
      query: (body) => ({
        url: '/project/requirement',
        method: 'POST',
        body,
      }),
    }),
    updateRequirement: builder.mutation<any, { id: number; data: UpdateRequirementDto }>({
      query: ({ id, data }) => ({
        url: `/project/requirement/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteRequirement: builder.mutation<any, number>({
      query: (id) => ({
        url: `/project/requirement/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});export const {
  useCreateRequirementMutation,
  useUpdateRequirementMutation,
  useDeleteRequirementMutation,
} = projectRequirementApi;


