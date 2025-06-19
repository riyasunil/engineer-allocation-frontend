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
import AddEngineer from "./pages/hr/engineers/AddEngineer";
import ProjectList from "./pages/engineer/projectList/ProjectList";
import EngineerProjectDetails from "./pages/engineer/engineerProjectDetails/EngineerProjectDetails";
import { Provider } from "react-redux";
import store from "./store/store";
import EngineerProfile from "./pages/engineer/profile/EngineerProfile";
import HrProjectDetails from "./pages/hr/hrProjectDetails/HrProjectDetails";
import { Toaster } from "@/components/ui/sonner";
import EngineerDetails from "./pages/hr/engineers/EngineerDetails";

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
      { index: true, element: <Dashboard /> },
      { path: "analytics", element: <Analytics /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:id", element: <HrProjectDetails /> },
      { path: "engineers", element: <Engineers /> },
      {path: "engineers/:id", element: <EngineerDetails /> },
      { path: "alerts", element: <Alerts /> },
      { path: "history", element: <History /> },
      { path: "profile", element: <Profile /> },
      { path: "projects/create", element: <CreateProject /> },
      { path: "addengineer", element: <AddEngineer /> },
    ],
  },
  {
    path: "/engineer",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ProjectList /> },
      { path: "projects", element: <ProjectList /> },
      { path: "projects/:id", element: <EngineerProjectDetails /> },
      { path: "profile", element: <EngineerProfile /> },
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
      <Provider store={store}>
        <Toaster position="top-right"/>
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </>
  );
}

export default App;
