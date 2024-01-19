// classComponents/Navbar.js
import React from "react";
import HelpButton from "./HelpButton";
import logoImage from "./CDProRunVis.png"

export default function Navbar() {
  return (
    <nav className="nav">
      <img
         src={logoImage}
        className="nav--icon"
        alt="A debugger logo"
      />
      <h3 className="nav--logo_text">ProRunVis</h3>
      <h4 className="nav--title">Visualize your flow</h4>
      <HelpButton />
    </nav>
  );
}
