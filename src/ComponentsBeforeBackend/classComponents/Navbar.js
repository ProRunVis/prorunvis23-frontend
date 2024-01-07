// classComponents/Navbar.js
import React from "react";
import HelpButton from "./HelpButton";

export default function Navbar() {
  return (
    <nav className="nav">
      <img
        src={require("../images/tmp_logo.png")}
        className="nav--icon"
        alt="A debugger logo"
      />
      <h3 className="nav--logo_text">ProRunVis</h3>
      <h4 className="nav--title">Visualize your flow</h4>
      <HelpButton />
    </nav>
  );
}
