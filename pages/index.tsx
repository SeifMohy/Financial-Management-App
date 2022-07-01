import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import FeaturesSection from "../Components/FeaturesSection";
import HeroSection from "../Components/HeroSection";
import InfoNavigation from "../Components/InfoNavigation";

const Home: NextPage = () => {
  return (
    <div>
      <InfoNavigation />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
