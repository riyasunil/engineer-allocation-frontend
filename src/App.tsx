import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/notFound/NotFound";
import Login from "./pages/auth/login/Login";
import DashboardLayout from "./components/dashboardLayout/DashboardLayout";
import CreateProject from "./pages/hr/createProject/CreateProject"; // update with your actual paths
import Dashboard from "./pages/hr/dashboard/Dashboard";
import Analytics from "./pages/hr/analytics/Analytics";
import Projects from "./pages/hr/projects/Projects";
import Engineers from "./pages/hr/engineers/Engineers";
import Alerts from "./pages/hr/alerts/Alerts";
import History from "./pages/hr/history/History";
import Profile from "./pages/hr/profile/Profile";

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
      { path: "dashboard", element: <Dashboard /> },
      { path: "analytics", element: <Analytics /> },
      { path: "projects", element: <Projects /> },
      { path: "engineers", element: <Engineers /> },
      { path: "alerts", element: <Alerts /> },
      { path: "history", element: <History /> },
      { path: "profile", element: <Profile /> },
      { path: "projects/create", element: <CreateProject /> },
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
