// classComponents/Navbar.js
import React from "react";
import HelpButton from "./HelpButton";
import logoImage from "../images/CDProRunVis.png"
import "../styling/Navbar.css"

export default function Navbar() {
  return (
    <nav className="nav">
      <img
         src={logoImage}
        className="nav--icon"
        alt="A debugger logo"
      />
      <h3 className="nav--logo_text">Visualize your flow</h3>
      <h4 className="nav--title"></h4>
      <HelpButton />
    </nav>
  );
}
