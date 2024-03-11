import React, { useEffect, useRef, useState, useMemo } from "react";
import '../Css/Decorate.css';
import EditorInitializer from "./EditorInitializer";
import "../Css/RightComponent.css"
import PropTypes from "prop-types";
import JsonManager from "./JsonManager";
import {json} from "react-router-dom";
import async from "async";

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

  const [activeIterationIndices, setActiveIterationIndices] = useState([]);

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
      try {
        const text = await displayedFile.text();
        setJavaFileContent(text);
      } catch (error) {
        console.error("Error loading the Java file:", error);
      }
  };

  /**
   * Function to render a range in the current editor with a green background.
   * Used to show which part of the code got executed.
   * @param range monaco.Range to be decorated.
   */
  function highlightActive(range)
  {
      editor.createDecorationsCollection([
        {
          options: {className: "active"},
          range: {
            startLineNumber: range.startLineNumber,
            startColumn: range.startColumn,
            endLineNumber: range.endLineNumber,
            endColumn: range.endColumn
          }
        }
      ]);
  }

  /**
   * Function to render a range in the current editor with a blue background.
   * Used to show which part of the code got is a link and can be clicked to jump to another Node.
   * @param range monaco.Range to be decorated.
   */
  function highlightLink(range)
  {
    editor.createDecorationsCollection([
      {
        options: {className: "link"},
        range: {
          startLineNumber: range.startLineNumber,
          startColumn: range.startColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn
        }
      }
    ]);
  }

  /**
   *
   * @param range monaco.Range to be decorated.
   */
  function highlightLoop(range)
  {
    editor.createDecorationsCollection([
      {
        options: {className: "loop"},
        range: {
          startLineNumber: range.startLineNumber,
          startColumn: range.startColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn
        }
      }
    ]);
  }

  /**
   * TODO
   */
  function iterationChanged(newIterationIndex){ //index in nodes
    console.log("iterationChanged" + newIterationIndex);

    //bis hier klappts
    //
    let insertPosition;
    for(let i = 0; i<activeIterationIndices.length; i++) {
      console.log(jsonManager.nodes[activeIterationIndices[i]].traceId + " " + jsonManager.nodes[newIterationIndex].traceId + " here");
        if (jsonManager.nodes[activeIterationIndices[i]].traceId === jsonManager.nodes[newIterationIndex].traceId) {
          insertPosition = i;
          break;
        }
    }
    console.log("insert pos " + insertPosition);

    let newActiveIterations = jsonManager.initIterations(activeFunctionIndex, [], [jsonManager.nodes[newIterationIndex].traceId]);
    //TODO same issue with trace ids that occured with the other thing aswell

    console.log("newActiveIter" + newActiveIterations);


    //calc new active iterations
    let neu = [newIterationIndex];
    neu.concat(jsonManager.initIterations(newIterationIndex, [], [jsonManager.nodes[newIterationIndex].traceId]));
    newActiveIterations.splice(insertPosition,0, ...neu); //TODO insert whatever I get when I only start downwards from the new iteration index

    console.log("error found1");
    setActiveIterationIndices(newActiveIterations);
  }

  /**
   * Sets up an event listener that listens mouse clicks in the editor.
   * If the mouse is clicked it checks whether the mouse position is on a link,
   * if so it initiates the jump to the new Node.
   */
  function handleJumps() {
      editor.onMouseDown(e => {
        const position = e.target.position;
        jumpNodesIndices.forEach((jumpIndex) => {
          let jump = jsonManager.nodes[jumpIndex];
          jump.outLinks.forEach((outLink) => {
            if (outLink.range.containsPosition(position)) {
              setJumpPosition(jump.outLinkPosition);
              setDoPositionJump(true);
              setActiveFunctionIndex(jump.outFunctionIndex);
              console.log("error found2");
              setActiveIterationIndices(jsonManager.initIterations(activeFunctionIndex, jump.outLoopIterations, []));
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
            console.log("error found3");
            setActiveIterationIndices(jsonManager.initIterations(activeFunctionIndex, [], []));
          }
        });
      });
  }

  function handleIterationDisplay(){
  
  }

  function handleIterationButton(){
    editor.onMouseDown(e => {
      const position = e.target.position;
      //console.log("beepboop" + activeIterationIndices);
      activeIterationIndices.forEach((iterationIndex) => {
        let iteration = jsonManager.nodes[iterationIndex];
        if (iteration.link.range.containsPosition(position)) {
          console.log("change iteration");
          let id = iteration.traceId;
          let nexiteration = iteration.iteration + 1;

          for(let i = 0; i < jsonManager.nodes.length ; i++) {
            if (jsonManager.nodes[i].traceId === id && nexiteration === jsonManager.nodes[i].iteration){
              iterationChanged(i);
              break;
            }
          }
        }
      });
    });
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


  useEffect(() => {
    if(jsonManager) {
      setActiveFunctionIndex(jsonManager.getMain());
      setActiveAndDisplayed(jsonManager.nodes[1].link.file);
    }
  },[jsonManager]);

  useEffect(() => {
    if(displayedFile) {
      loadJavaFile();
    }
  },[displayedFile]);

  useEffect(() => {
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
      }
    }
  },[javaFileContent, activeIterationIndices, activeFunctionIndex]);

  useEffect(() => {
    if(jsonManager) {
      setActiveIterationIndices(jsonManager.initIterations(activeFunctionIndex, [], []));
    }
  },[activeFunctionIndex]);

  useEffect(() => {
    if(jsonManager) {
      setJumpNodesIndices(jsonManager.updateJumpsFunction(activeFunctionIndex, activeIterationIndices));
    }
  },[activeIterationIndices]);

  useEffect(() => {
    if(jsonManager && editor) {
     console.log("File content changed.");


     let rangesToHighlight = [];
     rangesToHighlight = jsonManager.updateActiveRangesFunction(activeFunctionIndex, activeIterationIndices);


      if (isActiveDisplayed()) {
        setDoPositionJump(true);
        rangesToHighlight.forEach((rangeToHighlight) => {
          highlightActive(rangeToHighlight);
        });
        jumpNodesIndices.forEach((jump) => {
          if (jsonManager.nodes[jump].nodeType !== "Function" || jump === activeFunctionIndex) {
            jsonManager.nodes[jump].outLinks.forEach((outLink) => {
              highlightLink(outLink.range);
            });
          }
          // We do not want to mark for the link of the current function since it might be in another file
          // and is not part of the currently active function
          if (jump === activeFunctionIndex) {
            return;
          }
          highlightLink(jsonManager.nodes[jump].link.range);
        });
        handleJumps();

        handleIterationButton();

        activeIterationIndices.forEach((index) => {
          highlightLink(jsonManager.nodes[index].link.range);
        });
      }
     if (!doPositionJump && isActiveDisplayed()) {
        if (activeFunctionIndex !== 1)
          jumpToPosition(jsonManager.nodes[activeFunctionIndex].outLinks[jsonManager.nodes[activeFunctionIndex].outLinks.length - 1].range.getStartPosition());
        else
          jumpToPosition(jsonManager.nodes[activeFunctionIndex].link.range.getStartPosition());
        setDoPositionJump(false);
      }
      if (doPositionJump) {
        setDoPositionJump(false);
        jumpToPosition(jumpPosition);
      }

      //handleIterationDisplay();
      console.log("dekorationen neu geladen");
    }

  },[editor]);


  useEffect(() => {
    console.log(activeIterationIndices);
  }, [activeIterationIndices]);


  /**
   * This effect is executed when the editor changes. It then gets the ranges that should be highlighted from the
   * jsonManager and displays them in the editor if the current file is the one where the active Node is located.
   * It then starts the event listener for mouse clicks and sets the position of the editor to the active Node if it is
   * part of the displayed file.
   */


  /**
   * This effect is executed when the active function changes. It then sets editor to file that contains said function
   * and updates the JumpNodeIndices.
   */

  /**
   * This effect is executed when json manager/project changes. It then gets the main function of that project
   * and sets it as the active function and performs a file jump to the file that contains the new active function.
   */





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
