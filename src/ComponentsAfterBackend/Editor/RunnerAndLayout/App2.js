import "./App2.css";
import React, { useEffect, useRef, useState, useMemo } from "react";
import PopupManager from "../PopUpComponents/PopupManager";
import EditorClickHandler from "../PopUpComponents/EditorClickHandler";
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
  const [popupDistance, setPopupDistance] = useState(0);


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
      }
    }
  }, [javaFileContent, highlightedLines]);

  // Effekt, der ausgeführt wird, wenn der Editor, der PopupManager  geändert werden
  useEffect(() => {
    if (editor) {
      const clickHandler = new EditorClickHandler(editor, popupManager);
      clickHandler.handleMouseDown();
    }
  }, [editor, popupManager]);

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


  //-------------------------------------------------------------------------------------------------------------------

  
  // Render-Funktion
  return (
    <div className="App2">
      <Navbar2 />
      <div ref={editorContainerRef} className="editor-container"></div>
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
