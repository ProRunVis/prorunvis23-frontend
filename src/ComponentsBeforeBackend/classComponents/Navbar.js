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
      <h1 className="nav--title">Visualize your flow</h1>
      <HelpButton />
    </nav>
  );
}
