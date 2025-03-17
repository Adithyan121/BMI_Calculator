import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import BMI from "./pages/BMI";
// import './App.css'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BMI />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;