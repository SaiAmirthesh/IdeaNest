import { createBrowserRouter } from "react-router";

import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";

import Dashboard from "@/pages/dashboard/Dashboard";
import Ideas from "@/pages/dashboard/Ideas";
import IdeaDetails from "@/pages/dashboard/IdeaDetails";
import Notes from "@/pages/dashboard/Notes";
import GlobalGraph from "@/pages/dashboard/GlobalGraph";
import Settings from "@/pages/dashboard/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "app",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "ideas",
            element: <Ideas />,
          },
          {
            path: "ideas/:id",
            element: <IdeaDetails />,
          },
          {
            path: "notes",
            element: <Notes />,
          },
          {
            path: "graph",
            element: <GlobalGraph />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);
