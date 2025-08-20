import React from "react";
import CoverageMap from "./CoverageMap";
import { useLoaderData } from "react-router";

const Coverage = () => {
  const warehouseData = useLoaderData();

  return (
    <div>
      <h1 className="py-10 font-bold text-4xl text-center">
        We are in 64 districts
      </h1>
      <CoverageMap warehouseData={warehouseData} />
    </div>
  );
};

export default Coverage;
