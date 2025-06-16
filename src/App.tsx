import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/notFound/NotFound";
import Login from "./pages/auth/login/Login";
import DashboardLayout from "./components/dashboardLayout/DashboardLayout";
import CreateProject from "./pages/hr/createProject/CreateProject";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/hr",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <CreateProject /> },
      // { path: "create", element: <CreateEmployee /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <>
      {/* <Suspense fallback={<LoadingScreen />}>
        <Provider store={store}> */}
      <RouterProvider router={router} />
      {/* </Provider>
      </Suspense> */}
    </>
  );
}

export default App;
