import React, { useEffect, useRef, useState, useMemo } from "react";
import PopupManager from "./PopupManager";
import EditorClickHandler from "./EditorClickHandler";
import EditorInitializer from "./EditorInitializer";
import "../Css/RightComponent.css"
import PropTypes from "prop-types";

/**
 * Represents the right component of the application, primarily responsible for
 * displaying the code editor and managing code interactions such as displaying
 * popups based on editor events. This component initializes the editor with
 * Java file content, handles editor events, and manages popup messages.
 */
function RightComponent({fileInEditor, setFile, isActiveDisplayed, jsonManager}) {
  // Constants ------------------------------------------------------------------------------------------------------------------

  const [selectedFunction, setSelectedFunction] = useState(0);
  const [selectedIterations, setSelectedIterations] = useState([]);

  // Reference to the editor's container for performing DOM operations.
  const editorContainerRef = useRef(null);

  // State for the editor instance. 'setEditor' is used to update the editor state.
  const [editor, setEditor] = useState(null);

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
  // State for the content of the Java file to be displayed in the editor.
  const [javaFileContent, setJavaFileContent] = useState("");

  // Function to close the popup and clear the popup message.
  const closePopup = () => {
    popupManager.closePopup();
  };

  // Asynchronous function to load the content of the Java test file.
  const loadJavaFile = async () => {
    if(fileInEditor) {
      try {
        const text = await fileInEditor.text();
        setJavaFileContent(text);
      } catch (error) {
        console.error("Error loading the Java file:", error);
      }
    }
    else{
      try {
        const response = await fetch("./Default.java");
        const text = await response.text();
        setJavaFileContent(text);
      } catch (error) {
        console.error("Error loading the Java file:", error);
      }
    }
  };

  function highlightGreen(range)
  {
      editor.createDecorationsCollection([
        {
          options: {className: "green"},
          range: {
            startLineNumber: range.startLineNumber,
            startColumn: range.startColumn,
            endLineNumber: range.endLineNumber,
            endColumn: range.endColumn
          }
        }
      ]);
  }
  // -------------------------------------------------------------------------------------------------------------------------
  // UseEffects

  // This effect is executed when dialogRef, setPopupMessage, or popupDistance changes.
  // This is called first when a Java file is loaded.
  useEffect(() => {
    console.log("File in editor changed, content rendered.");
    loadJavaFile();
  }, [fileInEditor]);

  //If active function or file displayed in editor changes render highlights depending on if active file is also displayed in editor
  useEffect(() => {
    console.log("Editor changed, decorations rendered.");
    let rangesToHighlight;
    if(jsonManager)
      rangesToHighlight = jsonManager.updateActiveRangesFunction(selectedFunction, []);
    if(editor && isActiveDisplayed()) {
      if (rangesToHighlight.length !== 0) {
        for (let i = 0; i < rangesToHighlight.length; i++) {
          highlightGreen(rangesToHighlight[i]);
        }
      }
    }
    }, [editor]);

  //if active function changes jump set editor to file that contains said function
  useEffect(() => {
    if(jsonManager) {
      console.log("Active function changed, jump to it.");
      setFile(jsonManager.nodes[selectedFunction].link.file);
    }
  }, [selectedFunction]);

  //if json manager/project changes get main function and set as active function also change the file in the editor to display said function
  useEffect(() => {
    if(jsonManager) {
      console.log("JsonManager(loaded project) changed, set main as active function.");
      console.log(jsonManager.nodes[jsonManager.getMain()]);
      setSelectedFunction(jsonManager.getMain());
      setFile(jsonManager.nodes[jsonManager.getMain()].link.file);
    }
  }, [jsonManager]);


  // This is called second to pass the file to the editor's constructor.
  // Effect executed when the content of the Java file or the highlighted lines change.
  useEffect(() => {
    console.log("File content changed, editor rendered.");
    if (javaFileContent && editorContainerRef.current) {
      if (editor) {
        editor.dispose();
      }
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
RightComponent.propTypes = {
  fileInEditor: PropTypes.instanceOf(File),
  setFile: PropTypes.instanceOf(Function),
};
export default RightComponent;
