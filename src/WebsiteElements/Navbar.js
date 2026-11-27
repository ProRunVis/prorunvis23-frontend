import React, {useState, useEffect} from "react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import HelpButton from "./HelpButton";
import logoImage from "../Images/CDProRunVis.png";
import "../Css/Navbar.css";

export default function Navbar() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        const monacoTheme = isDark ? 'java-theme-dark' : 'java-theme-light';
        try {
            monaco.editor.setTheme(monacoTheme);
        } catch (e) {
        }
    }, [isDark]);

    function toggleTheme() {
        setIsDark(prev => !prev);
    }

    return (
        <nav className="nav">
            <img
                src={logoImage}
                className="nav--icon"
                alt="A debugger logo"
            />
            <h3 className="nav--logo_text">Visualize your flow</h3>
            <h4 className="nav--title"></h4>
            <div className="nav--theme-toggle" onClick={toggleTheme}>
                <span className={`nav--theme-label ${isDark ? 'active' : ''}`}>Dark</span>
                <div className="nav--theme-track">
                    <div className={`nav--theme-thumb ${isDark ? '' : 'light'}`} />
                </div>
                <span className={`nav--theme-label ${!isDark ? 'active' : ''}`}>Light</span>
            </div>
            <HelpButton/>
        </nav>
    );
}
