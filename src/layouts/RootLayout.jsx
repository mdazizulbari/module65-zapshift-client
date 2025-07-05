import React from "react";
import { Outlet } from "react-router";
import Navbar from "../pages/shared/Navbar";
import Footer from "../pages/shared/Footer";
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  return (
    <div>
      <Navbar />

      <Outlet />
      <Footer />
    </div>
  );
};

export default RootLayout;
