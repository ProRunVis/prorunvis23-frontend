// Importiert das React-Modul.
import React from 'react';

// Importiert das ReactDOM-Modul. Hier wird die ältere Version 'react-dom' anstelle von 'react-dom/client' verwendet.
import ReactDOM from 'react-dom';

// Importiert die CSS-Datei für globale Stilrichtlinien.
import './index.css';

// Importiert die App-Komponente aus der Datei App.js.
import App2 from './App2.js';

// Importiert die Funktion reportWebVitals, die für die Leistungsmessung der Webanwendung verwendet wird.
import reportWebVitals from './reportWebVitals.js';

// Ermittelt das DOM-Element mit der ID 'root', das als Einhängepunkt für die React-Anwendung dient.
const rootElement = document.getElementById('root');

// Verwendet ReactDOM.render(), um die App-Komponente innerhalb des <React.StrictMode>-Wrappers zu rendern.
// <React.StrictMode> wird verwendet, um zusätzliche Prüfungen und Warnungen für die App zu aktivieren.
ReactDOM.render(
  <React.StrictMode>
    <App2 />
  </React.StrictMode>,
  rootElement
);

// reportWebVitals wird aufgerufen, um Leistungsdaten zu erfassen und zu berichten.
// Dies kann für die Analyse und Optimierung der Anwendungsleistung genutzt werden.
// Mehr Informationen dazu finden Sie unter: https://bit.ly/CRA-vitals
reportWebVitals();
