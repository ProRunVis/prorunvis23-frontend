import React, { useState } from 'react';

// Konstante für die Java-Dateierweiterung
export const JAVA_FILE_EXTENSION = '.java';

// Funktion für das Rendern von Dateilisten
function renderFileList(header, files) {
  return (
    <div>
      <h2>{header}</h2>
      <ul>
        {files.map((fileName, index) => (
          <li key={index}>{fileName}</li>
        ))}
      </ul>
    </div>
  );
}

// Die Hauptkomponente für die Dateiverarbeitung
export default function LeftComponent() {
  // State-Hooks für die verschiedenen Teile der Komponente
  const [uploadedFileNames] = useState([]);  // Liste der hochgeladenen Dateien
  const [openedJavaFileNames, setOpenedJavaFileNames] = useState([]);  // Liste der geöffneten Java-Dateien
  const [noFilesFound, setNoFilesFound] = useState(false);  // Flag, um anzuzeigen, ob keine Dateien gefunden wurden
  const [outputVisible, setOutputVisible] = useState(false);  // Flag, um die Ausgabebox anzuzeigen oder zu verbergen
  const [selectedPath, setSelectedPath] = useState('');  // Pfad des ausgewählten Ordners

  // Funktion zum Verarbeiten von Java-Dateien
  const processJavaFiles = async (files) => {
    // Filtern und Extrahieren der Java-Dateinamen aus der Liste der Dateien
    const javaFileNames = files
      .filter(file => file.kind === 'file' && file.name.endsWith(JAVA_FILE_EXTENSION))
      .map(file => file.name);

    // Aktualisieren des State für die geöffneten Java-Dateinamen und Ausgabe anzeigen
    setOpenedJavaFileNames(javaFileNames);
    setNoFilesFound(javaFileNames.length === 0);
    setOutputVisible(true);
  };

  // Handler für das Öffnen und Verarbeiten von Java-Dateien
  const openAndProcessJavaFiles = async () => {
    try {
      // Dialog für die Auswahl eines Verzeichnisses anzeigen
      const directoryHandle = await window.showDirectoryPicker();
      // Alle Dateien und Verzeichnisse im ausgewählten Verzeichnis auflisten
      const files = await listAllFilesAndDirs(directoryHandle);

      // Wenn keine Dateien gefunden wurden, entsprechende Flags setzen und die Ausgabe anzeigen
      if (files.length === 0) {
        setNoFilesFound(true);
        setOutputVisible(true);
        return;
      }

      // Java-Dateien verarbeiten
      processJavaFiles(files);

      // Setzen des ausgewählten Pfads ab dem Laufwerk
      setSelectedPath(directoryHandle.name);
    } catch (error) {
      // Bei Fehlern entsprechende Fehlerausgabe und Flags setzen
      console.error('Fehler:', error);
      setNoFilesFound(true);
      setOutputVisible(true);
    }
  };

  // Funktion zum rekursiven Auflisten aller Dateien und Verzeichnisse
  const listAllFilesAndDirs = async (dirHandle) => {
    const files = [];
    for await (const [name, handle] of dirHandle.entries()) {
      const { kind } = handle;
      files.push({ name, handle, kind });
      if (kind === 'directory') {
        // Rekursiver Aufruf für Unterverzeichnisse
        const subdirFiles = await listAllFilesAndDirs(handle);
        files.push(...subdirFiles);
      }
    }
    return files;
  };

  return (
    <main className="left-container white-text">

      {/* Benutzerdefinierte Schaltflächen für das Öffnen und Verarbeiten von Java-Dateien */}
      <div className="button-container">
        <form onInput={openAndProcessJavaFiles} className="text-box button" encType="multipart/form-data">
          <input type="file" name="file" multiple="" webkitdirectory="" />
        </form>
      </div>

      {/* Ausgabekasten nur anzeigen, wenn outputVisible true ist */}
      {outputVisible && (
        <div className="output-box text-box">
          {selectedPath && (
            <div>
              {/* Anzeigen des ausgewählten Pfads */}
              <h2>Ausgewählter oberster Ordner:</h2>
              <p>{selectedPath}</p>
            </div>
          )}

          {/* Anzeigen der hochgeladenen Dateien, wenn vorhanden */}
          {!noFilesFound && uploadedFileNames.length > 0 && renderFileList('Hochgeladene Dateien:', uploadedFileNames)}

          {/* Anzeigen der hochgeladenen Java-Dateien, wenn vorhanden */}
          {!noFilesFound && openedJavaFileNames.length > 0 && renderFileList('Hochgeladene Java-Dateien:', openedJavaFileNames)}

          {/* Anzeigen, wenn keine Dateien gefunden wurden */}
          {noFilesFound && <div>Keine Dateien gefunden.</div>}
        </div>
      )}
    </main>
  );
}
