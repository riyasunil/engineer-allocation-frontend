// import baseApi from "../api";

// export const employeeApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     createEmployee: builder.mutation<Employee, Employee>({
//       query: (payload) => ({
//         url: "/employee",
//         method: "POST",
//         body: payload,
//       }),
//     }),

//     getEmployeeById: builder.query<Employee, number>({
//       query: (id) => ({
//         url: `/employee/${id}`,
//         method: "GET",
//       }),
//     }),
//   }),
// });

// export const {
//   useCreateEmployeeMutation,
//   useGetEmployeeByIdQuery,
// } = employeeApi;
