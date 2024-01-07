// classComponents/Navbar.js für ProjectTwo
import React from "react";
import logoImage from './tmp_logo2.png';
import HelpButton2 from "./HelpButton2"; 

export default function Navbar2() {
  return (
    <nav className="nav2">
      <img src={logoImage} className="nav2--icon" alt="ProRunVis logo" />
      <h3 className="nav2--logo_text">ProRunVis</h3>
      <h4 className="nav2--title">Visualize your flow</h4>
  
     <HelpButton2 /> 
    </nav>
  );
}
