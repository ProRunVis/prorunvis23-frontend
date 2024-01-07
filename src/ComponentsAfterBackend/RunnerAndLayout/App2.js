import './App2.css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import PopupManager from '../PopUpComponents/PopupManager';
import EditorClickHandler from '../PopUpComponents/EditorClickHandler';
import EditorInitializer from '../EditorAndHighlighting/EditorInitializer';
import Navbar2 from "./Navbar2";
import Footer2 from './Footer2';

function App2() {
  // Referenz für den Editor-Container
  const editorContainerRef = useRef(null);

  // Zustände für den Editor, die hervorgehobenen Linien, den Inhalt der Java-Datei und die Popup-Nachricht
  const [editor, setEditor] = useState(null);
  const [highlightedLines] = useState(new Set());
  const [javaFileContent, setJavaFileContent] = useState('');
  const [popupMessage, setPopupMessage] = useState('');

  // Konstante für die Nachricht, die angezeigt wird, wenn das Wort "Schwarzwälderkirschtorte" gefunden wird
  const FOR_WORD_MESSAGE = 'Schwarzwälderkirschtorte';

  // Referenz für das Dialogfenster
  const dialogRef = useRef(null);

  // Memoisierung des PopupManagers
  const popupManager = useMemo(() => new PopupManager(dialogRef, setPopupMessage), [dialogRef, setPopupMessage]);

  // Funktion zum Laden der Java-Datei
  const loadJavaFile = async () => {
    try {
      const response = await fetch('/JavaTestFile.java');
      const text = await response.text();
      setJavaFileContent(text);
    } catch (error) {
      console.error('Fehler beim Laden der Java-Datei:', error);
    }
  };

  const closePopup = () => {
    setPopupMessage('');
  };

  // Effekt, der ausgeführt wird, wenn der Inhalt der Java-Datei oder die hervorgehobenen Linien geändert werden
  useEffect(() => {
    if (javaFileContent && editorContainerRef.current) {
      const newEditor = EditorInitializer.initializeEditor(editorContainerRef, javaFileContent, highlightedLines, setEditor);
      if (newEditor) {
        setEditor(newEditor);
      }
    }
  }, [javaFileContent, highlightedLines]);

  // Effekt, der ausgeführt wird, wenn der Editor, der PopupManager oder die FOR_WORD_MESSAGE geändert werden
  useEffect(() => {
    if (editor) {
      const clickHandler = new EditorClickHandler(editor, popupManager, FOR_WORD_MESSAGE);
      clickHandler.handleMouseDown();
    }
  }, [editor, popupManager, FOR_WORD_MESSAGE]);

  // Effekt, der ausgeführt wird, wenn der Editor geändert wird
  useEffect(() => {
    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, [editor]);

  // Effekt, der die Java-Datei lädt, wenn die Komponente zum ersten Mal gerendert wird
  useEffect(() => {
    loadJavaFile();
  }, []);

  // Render-Funktion
  return (
    <div className="App2">
      <Navbar2 />
      <div ref={editorContainerRef} className="editor-container">
        {/* Editor-relevantes Markup */}
      </div>
      {/* Anzeige der Popup-Nachricht */}
      {popupMessage && (
        <div ref={dialogRef} className="popup">
          {popupMessage}
          <br />
          <button onClick={closePopup} className="popup-close-button">Schließen</button>
        </div>
      )}
      <Footer2 /> 
    </div>
  );
}

export default App2;
