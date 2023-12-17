import React, { useState, useRef } from 'react';
import { JavaFileOpener } from './JavaFileOpener';

export default function LeftComponent() {
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [openedJavaFileNames, setOpenedJavaFileNames] = useState([]);
  const [noFilesFound, setNoFilesFound] = useState(false);
  const [outputVisible, setOutputVisible] = useState(false); // Zustand für die Sichtbarkeit des Ausgabekastens
  const [selectedPath, setSelectedPath] = useState(''); // Zustand für den ausgewählten Pfad ab dem Laufwerk
  const fileInputRef = useRef(null);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const fileNames = files.map(file => file.name);
      setUploadedFileNames(fileNames);
      setNoFilesFound(false);
      setOutputVisible(true); // Anzeigen des Ausgabekastens, wenn Dateien hochgeladen wurden
    }
  };

  const openAndProcessJavaFiles = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const files = await JavaFileOpener.listAllFilesAndDirs(directoryHandle);

      if (files.length === 0) {
        setNoFilesFound(true);
        setOutputVisible(true); // Anzeigen des Ausgabekastens, wenn keine Dateien gefunden wurden
        return;
      }

      const javaFileNames = files
        .filter(file => file.kind === 'file' && file.name.endsWith('.java'))
        .map(file => file.name);

      setOpenedJavaFileNames(javaFileNames);
      setNoFilesFound(javaFileNames.length === 0);
      setOutputVisible(true); // Anzeigen des Ausgabekastens, wenn Java-Dateien gefunden wurden

      // Erfassen und setzen Sie den ausgewählten Pfad ab dem Laufwerk
      setSelectedPath(directoryHandle.name);
    } catch (error) {
      console.error('Fehler:', error);
      setNoFilesFound(true);
      setOutputVisible(true); // Anzeigen des Ausgabekastens im Fehlerfall
    }
  };

  return (
    <main className="left-container white-text">
      

      {/* Verstecktes Input-Element */}
      <input
        type="file"
        multiple
        onChange={handleFiles}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {/* Benutzerdefinierte Schaltflächen */}
      <div className="button-container">
        <button onClick={openAndProcessJavaFiles} className="text-box button">
          Select Directory Or File
        </button>
      </div>

      {outputVisible && ( // Nur anzeigen, wenn outputVisible true ist
        <div className="output-box text-box">
          {selectedPath && ( // Anzeigen des ausgewählten Pfads ab dem Laufwerk
            <div>
              <h2>Ausgewählter oberster Ordner:</h2>
              <p>{selectedPath}</p>
            </div>
          )}

          {!noFilesFound && uploadedFileNames.length > 0 && (
            <div>
              <h2>Hochgeladene Dateien:</h2>
              <ul>
                {uploadedFileNames.map((fileName, index) => (
                  <li key={index}>{fileName}</li>
                ))}
              </ul>
            </div>
          )}

          {!noFilesFound && openedJavaFileNames.length > 0 && (
            <div>
              <h2>Hochgeladene Java-Dateien:</h2>
              <ul>
                {openedJavaFileNames.map((fileName, index) => (
                  <li key={index}>{fileName}</li>
                ))}
              </ul>
            </div>
          )}

          {noFilesFound && <div>Keine Dateien gefunden.</div>}
        </div>
      )}
    </main>
  );
}
