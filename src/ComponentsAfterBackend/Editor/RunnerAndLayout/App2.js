import "./App2.css";
import React, { useEffect, useRef, useState, useMemo } from "react";
import PopupManager from "../PopUpWindow/PopupManager";
import EditorClickHandler from "../PopUpWindow/EditorClickHandler";
import EditorInitializer from "../EditorAndHighlighting/EditorInitializer";
import Navbar2 from "../../Navbar/Navbar2";
import Footer2 from "../../Footer/Footer2";

function App2() {
 
const editorContainerRef = useRef(null);
const [editor, setEditor] = useState(null);
const [highlightedLines] = useState(new Set());
const [javaFileContent, setJavaFileContent] = useState("");
const [popupMessage, setPopupMessage] = useState("");
const dialogRef = useRef(null);
const [text, setText] = useState('');

const popupManager = useMemo(
  () => new PopupManager(dialogRef, setPopupMessage, 10),
  [dialogRef, setPopupMessage]
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
  popupManager.closePopup();
};

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
      const clickHandler = new EditorClickHandler(newEditor, popupManager);
      clickHandler.handleMouseDown();
    }
  }
}, [javaFileContent, highlightedLines, popupManager]);

useEffect(() => {
  loadJavaFile();
}, []);

useEffect(() => {
  return () => {
    if (editor) {
      editor.dispose();
    }
  };
}, [editor]);

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
      <div className="popup" ref={dialogRef} style={{ display: 'none' }}>
        {popupMessage}
        <br />
        <button onClick={closePopup} className="popup-close-button">
          Schließen
        </button>
      </div>
      <Footer2 />
    </div>
  );
}

export default App2;
