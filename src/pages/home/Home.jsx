import React from "react";
import Banner from "./Banner";
import OurServices from "./serviceSection/OurServices";
import LogoMarquee from "./LogoMarquee";
import Benefits from "./Benefits";

const Home = () => {
  return (
    <div>
      <Banner />
      <OurServices />
      <LogoMarquee />
      <Benefits />
    </div>
  );
};

export default Home;
