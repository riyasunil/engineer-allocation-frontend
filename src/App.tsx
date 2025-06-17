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
import EngineerProfile from "./pages/engineer/profile/EngineerProfile";
import AddEngineer from "./pages/hr/engineers/AddEngineer";
import ProjectList from "./pages/engineer/projectList/ProjectList";
import EngineerProjectDetails from "./pages/engineer/engineerProjectDetails/EngineerProjectDetails";
import { Provider } from "react-redux";
import store from "./store/store";

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
      { path: "addengineer", element: <AddEngineer /> },

    ],
  },
  {
    path: "/engineer",
    element: <DashboardLayout />,
    children: [
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
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </>
  );
}

export default App;
