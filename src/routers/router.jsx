import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    // loader: loadRootData,
    children:[
        {index:true,element:<Home/>}
    ]
  },
]);