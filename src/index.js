// Imports the React module.
import React from 'react';

// Imports the ReactDom module from 'react-dom/client'(refers to newest react version).
import {createRoot} from 'react-dom/client';

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

    // Uses 'root.render()', to render the app-component inside the <React.StrictMode>-wrapper.
    // <React.StrictMode> is used to activate additional tests and warnings for the app.
    root.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );
}

// reportWebVitals is called to capture performance data and report it.
// This can be used for analysing and optimizing the performance.
// More information about this process can be found here: https://bit.ly/CRA-vitals
reportWebVitals(console.log);  //'console.log' gets passed on as an example-callback-function.
