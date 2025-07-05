import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Coverage from "../pages/coverage/Coverage";
import PrivateRoute from "../routes/PrivateRoute";
import SendParcel from "../pages/sendParcel/SendParcel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    // loader: loadRootData,
    children: [
      { index: true, element: <Home /> },
      { path: "coverage", element: <Coverage /> },
      {
        path: "sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
        loader: async () => {
          const res = await fetch(`src/assets/warehouses.json`);
          return res.json()
        },
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);
