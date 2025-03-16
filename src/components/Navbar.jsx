import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">BMI Calculator</Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;