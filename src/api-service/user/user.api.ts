import { Project, User, UserData } from "@/utils/types";
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
        url: `/users/${payload.user_id}`,
        method: "PUT",
        body: payload,
      }),
    }),

    getAssignableUsers: builder.query<User[], AssignableUserPayload>({
      query: (payload) => ({
        url: "/users/assignable",
        method: "POST", // Using POST since it requires a payload
        body: payload,
      }),
    }),

    getAllEngineers: builder.query<User[], void>({
      query: () => ({
        url: "/users/engineer",
        method: "GET",
      }),
    }),

    getAllAvailableUsers: builder.query<User[], void>({
      query: () => ({
        url: "/users/available",
        method: "GET",
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
} = userApi;

// public async getAssignableUsers(req:Request, res:Response, next: NextFunction){
//   try {
//     const designation = req.body.designation;
//     const skills = req.body.skills;
//     const users = await this.userService.getAssignableUsers(designation, skills)
//     res.status(200).json(users)
//   } catch (error) {
//     next(error);
//   }
// }
// server.use("/users", userRouter);
//   router.get("/engineer", this.getAllEngineers.bind(this));
// router.get("/available", this.getAllAvailableUsers.bind(this));
//  router.get("/assignable", this.getAssignableUsers.bind(this));

//response : User[]
//payload: {designation: string, skills: number[]}

// public async getAllEngineers(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const users = await this.userService.getAllEngineers();
//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// }

//response : User[]
//payload: void

// public async getAllAvailableUsers(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const users = await this.userService.getAvailableUsers();
//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// }

//response: User[]
//payload: void
