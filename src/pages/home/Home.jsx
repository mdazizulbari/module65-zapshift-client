import React from "react";
import Banner from "./Banner";
import OurServices from "./serviceSection/OurServices";
import LogoMarquee from "./LogoMarquee";
import Benefits from "./Benefits";
import BeMerchant from "./BeMerchant";

const Home = () => {
  return (
    <div>
      <Banner />
      <OurServices />
      <LogoMarquee />
      <Benefits />
      <BeMerchant />
    </div>
  );
};

export default Home;
