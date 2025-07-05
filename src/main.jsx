import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./routers/router.jsx";
import aos from "aos";
import "aos/dist/aos.css";
import AuthProvider from "./contexts/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";

aos.init();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist max-w-7xl mx-auto">
      <AuthProvider>
        <ToastContainer />
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  </StrictMode>
);
