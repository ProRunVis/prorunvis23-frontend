// Imports the React module.
import React from 'react';

// Imports the ReactDom module from 'react-dom/client'(refers to newest react version).
import { createRoot } from 'react-dom/client';

// Imports CSS-File for styling.
import './Css/index.css';

// Imports the App-component from App.js.
import App from './App.js';

// Imports the function reportWebVitals for measuring the performance of the web application.
import reportWebVitals from './Left-NavbarUpload/ReportWebVitals.js';

// Determines the DOM-Element with the ID 'root' that is used as an anchor point for the React application.
const rootElement = document.getElementById('root');

// Checks if the 'rootElement' is present to prevent errors.
if (rootElement) {
    // Creates the Root-Element through 'createRoot' from 'react-dom/client'.
    const root = createRoot(rootElement);
    
    // Verwendet 'root.render()', um die App-Komponente innerhalb des <React.StrictMode>-Wrappers zu rendern.
    // <React.StrictMode> wird verwendet, um zusätzliche Prüfungen und Warnungen für die App zu aktivieren.
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
}

// reportWebVitals wird aufgerufen, um Leistungsdaten zu erfassen und zu berichten.
// Dies kann für die Analyse und Optimierung der Anwendungsleistung genutzt werden.
// Mehr Informationen dazu finden Sie unter: https://bit.ly/CRA-vitals
reportWebVitals(console.log);  // Hier wird 'console.log' als Beispiel-Callback-Funktion übergeben.
