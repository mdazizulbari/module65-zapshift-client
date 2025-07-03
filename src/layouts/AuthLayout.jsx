import React from "react";
import { Outlet } from "react-router";
import authImage from "../assets/authImage.png";

const AuthLayout = () => {
  return (
    <div className="bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={authImage} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
