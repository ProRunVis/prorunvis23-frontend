import React from "react";
import HelpButton from "./HelpButton";
import logoImage from "../images/CDProRunVis.png";
import "../Css/Navbar.css";

/**
 * Represents the navigation bar at the top of the application. It includes a logo,
 * application title "Visualize your flow", and a HelpButton component that opens
 * a modal with additional information or instructions for the user. The Navbar
 * is styled with CSS for visual appeal and user interaction.
 */
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