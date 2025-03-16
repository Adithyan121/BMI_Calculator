import React from "react";
import Navbar from "../components/Navbar";
import BMI from "./BMI";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <BMI />
      <Footer />
    </div>
  );
};

export default Home;