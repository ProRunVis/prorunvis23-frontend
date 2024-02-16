import React, { useEffect, useRef, useState, useMemo } from "react";
import PopupManager from "./PopupManager";
import EditorClickHandler from "./EditorClickHandler";
import EditorInitializer from "./EditorInitializer";
import "../styling/RightComponent.css"

/**
 * Represents the right component of the application, primarily responsible for
 * displaying the code editor and managing code interactions such as displaying
 * popups based on editor events. This component initializes the editor with
 * Java file content, handles editor events, and manages popup messages.
 */
function RightComponent() {
  // Constants ------------------------------------------------------------------------------------------------------------------

  // Reference to the editor's container for performing DOM operations.
  const editorContainerRef = useRef(null);

  // State for the editor instance. 'setEditor' is used to update the editor state.
  const [editor, setEditor] = useState(null);

  // State for the content of the Java file to be displayed in the editor.
  const [javaFileContent, setJavaFileContent] = useState("");

  // State for the message to be displayed in the popup. 'setPopupMessage' updates this message.
  const [popupMessage, setPopupMessage] = useState("");

  // Reference to the dialog element (popup) for performing DOM operations.
  const dialogRef = useRef(null);

  // Creates an instance of PopupManager and uses 'useMemo' for performance optimization.
  // The instance is recreated only if 'dialogRef', 'setPopupMessage', or 'popupDistance' changes.
  const popupManager = useMemo(
    () => new PopupManager(dialogRef, setPopupMessage, 10),
    [dialogRef, setPopupMessage]
  );

  // Asynchronous function to load the content of the Java test file.
  const loadJavaFile = async () => {
    try {
      const response = await fetch("./MethodCallTesting.java");
      const text = await response.text();
      setJavaFileContent(text);
    } catch (error) {
      console.error("Error loading the Java file:", error);
    }
  };

  // Function to close the popup and clear the popup message.
  const closePopup = () => {
    popupManager.closePopup();
  };

  // -------------------------------------------------------------------------------------------------------------------------
  // UseEffects

  // This effect is executed when dialogRef, setPopupMessage, or popupDistance changes.

  // This is called first when a Java file is loaded.
  useEffect(() => {
    loadJavaFile();
  }, []);

  // This is called second to pass the file to the editor's constructor.
  // Effect executed when the content of the Java file or the highlighted lines change.
  useEffect(() => {
    if (javaFileContent && editorContainerRef.current) {
      const newEditor = EditorInitializer.initializeEditor(
        editorContainerRef,
        javaFileContent
      );
      if (newEditor) {
        setEditor(newEditor);
        // Initialize the EditorClickHandler here, after the editor has been created.
        const clickHandler = new EditorClickHandler(newEditor, popupManager);
        clickHandler.handleMouseDown();
      }
    }
  }, [javaFileContent, popupManager]);

  // Effect executed when the editor changes.
  useEffect(() => {
    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, [editor]);

  // Render function
  return (
    <main className="right-container">
      <div ref={editorContainerRef} className="editor-container"></div>
      <div
        className="popup"
        ref={dialogRef}
        style={{ display: 'none' }} // Hidden by default
      >
        {popupMessage}
        <br />
        <button onClick={closePopup} className="popup-close-button">
          Close
        </button>
      </div>
    </main>
  );
}

export default RightComponent;