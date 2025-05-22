import { Login } from "../pages/Login";
import { createBrowserRouter } from "react-router";
import { Signup } from "../pages/Signup";
import { Dashboard } from "../pages/Dashboard";
import { Session } from "../pages/Session";
import { Subject } from "../pages/Subject";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "session",
        element: <Session />,
      },
      {
        path: "subject",
        element: <Subject />,
      }
    ],
  },
]);
