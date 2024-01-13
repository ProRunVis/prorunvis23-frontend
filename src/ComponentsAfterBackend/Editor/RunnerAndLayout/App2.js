import "./App2.css";
import React, { useEffect, useRef, useState, useMemo } from "react";
import PopupManager from "../PopUpWindow/PopupManager";
import EditorClickHandler from "../PopUpWindow/EditorClickHandler";
import EditorInitializer from "../EditorAndHighlighting/EditorInitializer";
import Navbar2 from "../../Navbar/Navbar2";
import Footer2 from "../../Footer/Footer2";

function App2() {

  // Konstanten ------------------------------------------------------------------------------------------------------------------
 
  const editorContainerRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [highlightedLines] = useState(new Set());
  const [javaFileContent, setJavaFileContent] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const dialogRef = useRef(null);
  const [popupDistance] = useState(0);
   // State für den Textinhalt der geladenen Datei der rechten Seite
   const [text, setText] = useState('');


  const popupManager = useMemo(
    () => new PopupManager(dialogRef, setPopupMessage, popupDistance),
    [dialogRef, setPopupMessage, popupDistance]
  );
  const loadJavaFile = async () => {
    try {
      const response = await fetch("/JavaTestFile.java");
      const text = await response.text();
      setJavaFileContent(text);
    } catch (error) {
      console.error("Fehler beim Laden der Java-Datei:", error);
    }
  };

  
  const closePopup = () => {
    setPopupMessage("");
  };




// -------------------------------------------------------------------------------------------------------------------------
//UseEffekte

useEffect(() => {
  if (dialogRef.current) {
    // Erstelle hier eine neue Instanz von PopupManager, wenn dialogRef verfügbar ist
    const popupManagerInstance = new PopupManager(dialogRef, setPopupMessage, popupDistance);
    // Führen Sie hier alle weiteren Aktionen mit popupManagerInstance aus
  }
}, [dialogRef, setPopupMessage, popupDistance]);

// Effekt, der ausgeführt wird, wenn der Inhalt der Java-Datei oder die hervorgehobenen Linien geändert werden
useEffect(() => {
  if (javaFileContent && editorContainerRef.current) {
    const newEditor = EditorInitializer.initializeEditor(
      editorContainerRef,
      javaFileContent,
      highlightedLines,
      setEditor
    );
    if (newEditor) {
      setEditor(newEditor);
      // Initialisiere den EditorClickHandler hier, nachdem der Editor erstellt wurde
      const clickHandler = new EditorClickHandler(newEditor, popupManager);
      clickHandler.handleMouseDown();
    }
  }
}, [javaFileContent, highlightedLines, popupManager]);

useEffect(() => {
  loadJavaFile();
}, []);

// Effekt, der ausgeführt wird, wenn der Editor geändert wird
useEffect(() => {
  return () => {
    if (editor) {
      editor.dispose();
    }
  };
}, [editor]);

  
  //-------------------------------------------------------------------------------------------------------------------

  
  // Render-Funktion
  return (
    <div className="App2">
      <Navbar2 />

      <div className="LeftAndRightWebsiteComponents">
      <div ref={editorContainerRef} className="editor-container"></div>
      <div className="comment-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Text hier eingeben..."
          />
        </div>
      </div>


      {popupMessage && (  //bedingte Rendering Anweisung für die gesamte Klammer, wird nur gerändert, wenn popupMessage != null
        <div ref={dialogRef} className="popup">
          {popupMessage}
          <br />
          <button onClick={closePopup} className="popup-close-button">
            Schließen
          </button>
        </div>
      )}
      <Footer2 />
    </div>
  );
}

export default App2;
