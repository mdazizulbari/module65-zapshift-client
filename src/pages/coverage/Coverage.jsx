import React from "react";
import CoverageMap from "./CoverageMap";

const Coverage = () => {
  return (
    <div>
      <h1 className="py-10 font-bold text-4xl text-center">
        We are in 64 districts
      </h1>
      <CoverageMap />
    </div>
  );
};

export default Coverage;
