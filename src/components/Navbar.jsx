import React, { useState } from "react";
import { MdLightMode, MdOutlineLightMode } from "react-icons/md";
import profilePic from "../assets/chanthu.jpg";

const Navbar = ({ theme, toggleTheme }) => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const handleProfileClick = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">BMI Calculator</div>
      <div className="navbar-links">
        <button onClick={toggleTheme} className="theme-toggle-button">
          {theme === "dark" ? (
            <MdOutlineLightMode size={24} />
          ) : (
            <MdLightMode size={24} />
          )}
        </button>
        {/* <img
          src={profilePic}
          alt="Profile"
          className="profile-pic"
          onClick={handleProfileClick}
        />
        {showProfilePopup && (
          <div className="profile-popup" onClick={handleProfileClick}>
            <img src={profilePic} alt="Profile" className="popup-profile-pic" />
          </div>
        )} */}
      </div>
    </nav>
  );
};

export default Navbar;
