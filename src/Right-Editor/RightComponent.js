import React, { useEffect, useRef, useState, useMemo } from "react";
import '../Css/Decorate.css';
import EditorInitializer from "./EditorInitializer";
import "../Css/RightComponent.css"
import PropTypes from "prop-types";
import JsonManager from "./JsonManager";

/**
 * Represents the right component of the application, primarily responsible for
 * displaying the code editor and managing code interactions
 * based on editor events. This component initializes the editor with
 * Java file content and handles editor events.
 * @param displayedFile File to displayed in editor.
 * @param setActiveAndDisplayed Function to update the displayed and active file in the parent component.
 * @param isActiveDisplayed Function that returns boolean whether the file currently displayed is the file containing
 * the currently active Node.
 * @param jsonManager Instance of the JsonManager class containing all the traced Nodes of the uploaded project.
 * @returns {Element} The right component of the website containing the editor.
 * @constructor
 */
function RightComponent({displayedFile, setActiveAndDisplayed, isActiveDisplayed, jsonManager}){
  // Constants --------------------------------------------------------------------------------------------------------

  // State for the index of the active function in the editor
  const [activeFunctionIndex, setActiveFunctionIndex] = useState(0);

  // State for the indices of the active iterations in active function that is displayed in the editor
  const [activeIterations, setActiveIterations] = useState([]);

  // State for the indices of the Nodes(other functions and throws)
  // of the active function that can be used to jump to another node
  const [jumpNodesIndices, setJumpNodesIndices] = useState([]);

  // State to determine
  // whether the file was changed through a jump, so a jump to the line of the current Node has to be performed
  // or the file was changed using the file tree
  const [doPositionJump, setDoPositionJump] = useState(false);

  // State to safe the line and column to jump to in the new or current file if a jump to a new Node is performed
  const [jumpPosition, setJumpPosition] = useState(new monaco.Position(0,0));

  // Reference to the editor's container for performing DOM operations.
  const editorContainerRef = useRef(null);

  // State for the editor instance. 'setEditor' is used to update the editor state.
  const [editor, setEditor] = useState(null);

  // State for the content of the Java file to be displayed in the editor.
  const [javaFileContent, setJavaFileContent] = useState("");

  /**
   *  Asynchronous function to load the content of the Java test file.
   */
  const loadJavaFile = async () => {
    if(displayedFile) {
      try {
        const text = await displayedFile.text();
        setJavaFileContent(text);
      } catch (error) {
        console.error("Error loading the Java file:", error);
      }
    }
  };

  /**
   * Function to render a range in the current editor with a green background.
   * Used to show which part of the code got executed.
   * @param range monaco.Range to be decorated.
   */
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

  function placeDecoration(startLineNumber, symbol) {
    editor.createDecorationsCollection([
      {
        range: new monaco.Range(startLineNumber, 1, startLineNumber, 1),
        options: {
          glyphMarginClassName: symbol,
          glyphMargin: {
            position: monaco.editor.GlyphMarginLane.Right,
          },
        },
      },
    ]);

  }

  /**
   * Function to render a range in the current editor with a blue background.
   * Used to show which part of the code got is a link and can be clicked to jump to another Node.
   * @param range monaco.Range to be decorated.
   */
  function underline(range)
  {
    editor.createDecorationsCollection([
      {
        options: {className: "underline"},
        range: {
          startLineNumber: range.startLineNumber,
          startColumn: range.startColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn
        }
      }
    ]);
  }

  function drawLine(ranges) {
    console.log("raw: " + ranges);
    let orderedRanges = ranges.sort((a, b) => ((a.startLineNumber < b.startLineNumber) ? -1 : (a.startLineNumber > b.startLineNumber) ? 1 : 0));
    console.log("ordered: " + ranges);
    let currentRow = new monaco.Range(ranges[0].startLineNumber, 0, ranges[0].startLineNumber + 1, 0);
    let symbol = "end";
    let stillInCurrentRange = false;
    let breakIndex = 0;
    for (let i = 0; i < ranges.length;) {
      if (breakIndex > 100) {
        console.log("breakIndex too high");
        console.log(currentRow);
        console.log(ranges[i]);
        console.log(symbol);
        break;
      }
      if (ranges[i].startLineNumber > currentRow.startLineNumber) {
        stillInCurrentRange = false;
        currentRow = new monaco.Range(currentRow.startLineNumber + 1, 0, currentRow.endLineNumber + 1, 0);
      }
      if (currentRow.containsRange(ranges[i])) {
        if (!stillInCurrentRange) {
          symbol = (symbol === "line" || symbol === "start") ? "line" : "start";
        }
        if (i === ranges.length - 1) {
          if (symbol === "start") {
            symbol = "one-line";
          } else {
            symbol = "end";
          }
        }
        placeDecoration(currentRow.startLineNumber, symbol);
        stillInCurrentRange = true;
        i++;
      } else if (!(editor.getModel().getValueInRange(currentRow).trim().length === 0)) {
        if (symbol === "start") {
          placeDecoration(currentRow.startLineNumber - 1, "one-line");
        } else if (symbol === "line") {
          placeDecoration(currentRow.startLineNumber - 1, "end");
        }
        symbol = "end";
      } else if (editor.getModel().getValueInRange(currentRow).trim().length === 0 && (symbol === "start" || symbol === "line")) {
        placeDecoration(currentRow.startLineNumber, "line");
        symbol = "line";
      }
      console.log(currentRow + "," + ranges[i] + "," + symbol);
      breakIndex++;
    }
  }

  /**
   * Sets up an event listener that listens mouse clicks in the editor.
   * If the mouse is clicked it checks whether the mouse position is on a link,
   * if so it initiates the jump to the new Node.
   */
  function handleJumps() {
    if(editor) {
      editor.onMouseDown(e => {
        const position = e.target.position;
        jumpNodesIndices.forEach((jumpIndex) => {
          let jump = jsonManager.nodes[jumpIndex];
          jump.outLinks.forEach((outLink) => {
            if (outLink.range.containsPosition(position)) {
              setJumpPosition(jump.outLinkPosition);
              setDoPositionJump(true);
              setActiveFunctionIndex(jump.outFunctionIndex);
            }
          });
          // We do not want to check for the link of the current function since it might be in another file
          // and is not part of the currently active function
          if(jump === activeFunctionIndex){
            return;
          }
          if (jump.link.range.containsPosition(position)) {
            setJumpPosition(jump.linkPosition);
            setDoPositionJump(true);
            setActiveFunctionIndex(jumpIndex);
          }
        });
      });
    }
  }

  /**
   * Handles the jump to a position in the editor.
   * @param position monaco.Position to jump to.
   */
  function jumpToPosition(position) {
    editor.revealLineNearTop(position.lineNumber);
    editor.setPosition(position);
  }

  // ------------------------------------------------------------------------------------------------------------------
  // UseEffects

  /**
   * This effect is executed when the file in the editor changes. It then loads in the content of said file
   * into the editor
   */
  useEffect(() => {
    if(displayedFile) {
      console.log("File changed.");
      loadJavaFile();
    }
  }, [displayedFile]);

  /**
   * This effect is executed when the editor changes. It then gets the ranges that should be highlighted from the
   * jsonManager and displays them in the editor if the current file is the one where the active Node is located.
   * It then starts the event listener for mouse clicks and sets the position of the editor to the active Node if it is
   * part of the displayed file.
   */
  useEffect(() => {
    if(editor) {
      console.log("Editor changed.");
      let rangesToHighlight = [];
      if (jsonManager)
        rangesToHighlight = jsonManager.updateActiveRangesFunction(activeFunctionIndex, activeIterations);
      if (isActiveDisplayed()) {
        setDoPositionJump(true);
        rangesToHighlight.forEach((rangeToHighlight) => {
          highlightGreen(rangeToHighlight);
        });
        drawLine(rangesToHighlight);
        jumpNodesIndices.forEach((jump) => {
          if (jsonManager.nodes[jump].nodeType !== "Function" || jump === activeFunctionIndex) {
            jsonManager.nodes[jump].outLinks.forEach((outLink) => {
              underline(outLink.range);
            });
          }
          // We do not want to mark for the link of the current function since it might be in another file
          // and is not part of the currently active function
          if (jump === activeFunctionIndex) {
            return;
          }
          underline(jsonManager.nodes[jump].link.range);
        });
      }
      handleJumps();
      if(!doPositionJump && isActiveDisplayed()){
        if(activeFunctionIndex !== 1)
          jumpToPosition(jsonManager.nodes[activeFunctionIndex].outLinks[jsonManager.nodes[activeFunctionIndex].outLinks.length-1].range.getStartPosition());
        else
          jumpToPosition(jsonManager.nodes[activeFunctionIndex].link.range.getStartPosition());
        setDoPositionJump(false);
      }
      if (doPositionJump) {
        setDoPositionJump(false);
        jumpToPosition(jumpPosition);
      }
    }
    }, [editor, activeFunctionIndex]);

  /**
   * This effect is executed when the active function changes. It then sets editor to file that contains said function
   * and updates the JumpNodeIndices.
   */
  useEffect(() => {
    if(jsonManager !== null) {
      console.log("Active function changed.");
      setActiveAndDisplayed(jsonManager.nodes[activeFunctionIndex].link.filepath);
      setJumpNodesIndices(jsonManager.updateJumpsFunction(activeFunctionIndex, activeIterations));
    }
  }, [activeFunctionIndex]);

  /**
   * This effect is executed when json manager/project changes. It then gets the main function of that project
   * and sets it as the active function and performs a file jump to the file that contains the new active function.
   */
  useEffect(() => {
    if(jsonManager) {
      console.log("Loaded project changed.");
      setActiveFunctionIndex(jsonManager.getMain());
      setActiveAndDisplayed(jsonManager.nodes[jsonManager.getMain()].link.filepath);
    }
  }, [jsonManager]);

  /**
   * This effect is executed when the content that should be displayed by the editor changes.
   * It then creates a new editor to display the new content.
   */
  useEffect(() => {
    if (javaFileContent && editorContainerRef.current) {
      console.log("File content changed.");
      if (editor) {
        editor.dispose();
      }
      const newEditor = EditorInitializer.initializeEditor(
          editorContainerRef,
          javaFileContent
      );
      if (newEditor) {
        setEditor(newEditor);
      }
    }
  }, [javaFileContent, activeFunctionIndex]);

  // Render editor
  return (
      <main className="right-container">
        <div ref={editorContainerRef} className="editor-container"></div>
      </main>
  );
}
RightComponent.propTypes = {
  displayedFile: PropTypes.instanceOf(File),
  setActiveAndDisplayed: PropTypes.instanceOf(Function),
  isActiveDisplayed: PropTypes.instanceOf(Function),
  jsonManager: PropTypes.instanceOf(JsonManager)
};
export default RightComponent;
