// Importiert das React-Modul.
import React from 'react';

// Importiert das ReactDOM-Modul aus 'react-dom/client', was auf die neueste Version von React hinweist.
import { createRoot } from 'react-dom/client';

// Importiert die CSS-Datei für globale Stilrichtlinien.
import './index.css';

// Importiert die App-Komponente aus der Datei App.js.
import App from './App.js';

// Importiert die Funktion reportWebVitals, die für die Leistungsmessung der Webanwendung verwendet wird.
import reportWebVitals from './reportWebVitals';

// Ermittelt das DOM-Element mit der ID 'root', das als Einhängepunkt für die React-Anwendung dient.
const rootElement = document.getElementById('root');

// Überprüft, ob das 'rootElement' existiert, um Fehler beim Erstellen des Root-Elements zu vermeiden.
if (rootElement) {
    // Erstellt das Root-Element mithilfe von 'createRoot' aus 'react-dom/client'.
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
