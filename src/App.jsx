import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./layouts/authLayout";
import Login, { action as loginAction } from "./pages/Login";
import Register, { action as registerAction } from "./pages/Register";
import ForgotPassword, { action as forgotAction } from "./pages/ForgotPassword";
import NewPassword, { action as newPassAction } from "./pages/NewPassword";
import ConfirmAccount from "./pages/ConfirmAccount";
import { getAuthUser } from "./helpers/auth";
import ProjectLayout from "./layouts/projectLayout";
import Projects, { loader as getProjects } from "./pages/Projects";
import NewProject from "./pages/NewProject";
import { action as createProjectAction } from "./components/ProjectsForm";
import Project, { loader as projectLoader } from "./pages/Project";
import EditProject from "./pages/EditProject";
import { action as tasksAction } from "./components/TaskForm";
import NewCollaborator from "./pages/NewCollaborator";
import { action as collaboratorAction } from "./components/CollaboratorForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login />, action: loginAction },
      { path: "register", element: <Register />, action: registerAction },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
        action: forgotAction,
      },
      {
        path: "forgot-password/:token",
        element: <NewPassword />,
        action: newPassAction,
      },
      { path: "confirm/:id", element: <ConfirmAccount /> },
    ],
  },
  {
    path: "/projects",
    element: <ProjectLayout />,
    loader: getAuthUser,
    children: [
      { index: true, element: <Projects />, loader: getProjects },
      {
        path: "create-project",
        element: <NewProject />,
        action: createProjectAction,
      },
      {
        path: "edit/:id",
        element: <EditProject />,
        action: createProjectAction,
      },
      {
        path: ":id",
        action: collaboratorAction,
        children: [
          { index: true, element: <Project />,loader: projectLoader, action: tasksAction },
          {
            path: "add-collaborator",
            element: <NewCollaborator />,
            action: collaboratorAction
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
