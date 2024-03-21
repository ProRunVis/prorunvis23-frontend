import React, {useEffect, useRef, useState, useMemo} from "react";
import '../Css/Decorate.css';
import EditorInitializer from "./EditorInitializer";
import "../Css/RightComponent.css"
import PropTypes from "prop-types";
import JsonManager from "./JsonManager";
import {json} from "react-router-dom";
import {editor} from "monaco-editor";

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
function EditorManager({displayedFile, setActiveAndDisplayed, isActiveDisplayed, jsonManager}) {
    // Constants --------------------------------------------------------------------------------------------------------

    // State for the index of the active function in the editor.
    const [activeFunctionIndex, setActiveFunctionIndex] = useState(0);

    //State for the indices of the loop iterations currently active.
    const [activeIterationIndices, setActiveIterationIndices] = useState([]);

    // State for the indices of the Nodes(other functions and throws)
    // of the active function that can be used to jump to another node.
    const [jumpNodesIndices, setJumpNodesIndices] = useState([]);

    // State to determine
    // whether the file was changed through a jump, so a jump to the line of the current Node has to be performed
    // or the file was changed using the file tree.
    const [doPositionJump, setDoPositionJump] = useState(false);

    // State to safe the line and column to jump to in the new or current file if a jump to a new Node is performed.
    const [jumpPosition, setJumpPosition] = useState(new monaco.Position(0, 0));

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
    function highlightActive(range) {
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
     * Adds a symbol on the current line next to the line number. Which one is dictated by {@link drawLine}.
     * @param startLineNumber number in which the symbol is drawn.
     * @param symbol symbol that is drawn.
     */
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
    function highlightLink(range) {
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
     * Function to render a range in the current editor with a darkblue background.
     * Used to show which part of the code is a loop and can be clicked to change the iteration.
     * @param range monaco.Range to be decorated.
     */
    function highlightLoop(range) {
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
     * Function to render a range in the current editor with a red background.
     * Used to show the last executed statement of the program.
     * @param range monaco.Range to be decorated.
     */
    function highlightEnd(range) {
        editor.createDecorationsCollection([
            {
                options: {className: "inactive"},
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
     * Changes an iteration in activeIterationIndices to a new iteration number and adds potential new iterationIndices,
     * that are included in the new iteration but were not executed before, to the activeIterationIndices list.
     * @param newIterationIndex the new index of the new iteration {@link TraceNode}.
     */
    function changeIteration(newIterationIndex) { //index in nodes
        let insertPosition;
        let oldIterationIndex;
        for (let i = 0; i < activeIterationIndices.length; i++) {
            if (jsonManager.nodes[activeIterationIndices[i]].traceId === jsonManager.nodes[newIterationIndex].traceId) {
                insertPosition = i;
                oldIterationIndex = activeIterationIndices[i];
                break;
            }
        }

        let removeCounter = 0;
        for (let i = 0; i < activeIterationIndices.length; i++) {
            let currentNode = jsonManager.nodes[activeIterationIndices[i]];
            while (currentNode.traceId !== jsonManager.nodes[activeFunctionIndex].traceId) {
                if (currentNode.traceId === jsonManager.nodes[oldIterationIndex].traceId) {
                    removeCounter++;
                }
                currentNode = jsonManager.nodes[currentNode.parentIndex];
            }
        }
        let iterationsInLoop = [newIterationIndex, ...jsonManager.initIterations(newIterationIndex, [])];

        const newIterations = [
            ...activeIterationIndices.slice(0, insertPosition),
            ...iterationsInLoop,
            ...activeIterationIndices.slice(insertPosition + removeCounter)];
        setActiveIterationIndices(newIterations);
    }

    /**
     * Draws a line next to executed code and determines where that line should start and stop.
     * @param ranges executed ranges to be marked.
     */
    function drawLine(ranges) {
        let currentRow = new monaco.Range(
            ranges[0].startLineNumber, 0, ranges[0].startLineNumber + 1, 0);
        let symbol = "end";
        let stillInCurrentRange = false;
        for (let i = 0; i < ranges.length;) {
            if (ranges[i].startLineNumber > currentRow.startLineNumber) {
                stillInCurrentRange = false;
                currentRow = new monaco.Range(
                    currentRow.startLineNumber + 1, 0,
                    currentRow.endLineNumber + 1, 0);
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
            } else if (editor.getModel().getValueInRange(currentRow).trim().length === 0
                && (symbol === "start" || symbol === "line")) {
                placeDecoration(currentRow.startLineNumber, "line");
                symbol = "line";
            }
        }
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
                if (jumpIndex === 1)
                    return;
                let jump = jsonManager.nodes[jumpIndex];
                if (jump.nodeType !== "Function" || jumpIndex === activeFunctionIndex) {

                    if (jump.nodeType === "Function" && jump.outLinks.length === 2) {
                        if (jump.outLinks[1].range.containsPosition(position)) {
                            setJumpPosition(jump.outLinkPosition);
                            setDoPositionJump(true);
                            setActiveIterationIndices(jump.outLoopIterations);
                            setActiveFunctionIndex(jump.outFunctionIndex);
                        }


                        jsonManager.updateActiveRangesFunction(activeFunctionIndex, activeIterationIndices).forEach((range) => {
                            if (range.containsRange(jsonManager.nodes[jumpIndex].outLinks[0].range)) {
                                if (jump.outLinks[0].range.containsPosition(position)) {
                                    setJumpPosition(jump.outLinkPosition);
                                    setDoPositionJump(true);
                                    setActiveIterationIndices(jump.outLoopIterations);
                                    setActiveFunctionIndex(jump.outFunctionIndex);
                                }
                            }
                        });
                    } else {
                        jump.outLinks.forEach((outLink) => {
                            if (outLink.range.containsPosition(position)) {
                                setJumpPosition(jump.outLinkPosition);
                                setDoPositionJump(true);
                                setActiveIterationIndices(jump.outLoopIterations);
                                setActiveFunctionIndex(jump.outFunctionIndex);
                            }
                        });
                    }
                }
                // We do not want to check for the link of the current function since it might be in another file
                // and is not part of the currently active function
                if (jumpIndex === activeFunctionIndex) {
                    return;
                }
                if (jump.nodeType === "Function") {
                    if (jump.link.range.containsPosition(position)) {
                        setJumpPosition(jump.linkPosition);
                        setDoPositionJump(true);
                        setActiveIterationIndices(jsonManager.initIterations(jumpIndex, []));
                        setActiveFunctionIndex(jumpIndex);
                    }

                }
            });
        });
    }

    /**
     * Sets up an event listener that listens mouse clicks in the editor.
     * If the mouse is clicked it checks whether the mouse position is on a loop keyword,
     * if so it opens a prompt that asks fot a new iteration to be displayed.
     */
    function handleIterationButton() {
        editor.onMouseDown(e => {
            const position = e.target.position;
            activeIterationIndices.forEach((iterationIndex) => {
                let iteration = jsonManager.nodes[iterationIndex];
                if (iteration.link.range.containsPosition(position)) {
                    let id = iteration.traceId;
                    let nextIteration = prompt("Please enter the iteration", iteration.iteration);
                    nextIteration = parseInt(nextIteration);
                    if (nextIteration === null || nextIteration < 0
                        || nextIteration > jsonManager.getLastIterationNumber(iterationIndex)) {
                        nextIteration = iteration.iteration;
                    }
                    for (let i = 0; i < jsonManager.nodes.length; i++) {
                        if (jsonManager.nodes[i].traceId === id && nextIteration === jsonManager.nodes[i].iteration
                            && jsonManager.nodes[i].parentIndex === iteration.parentIndex) {
                            changeIteration(i);
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

    /**
     * This effect is executed when json manager/project changes. It then gets the main function of that project
     * and sets it as the active function and performs a file jump to the file that contains the new active function.
     * It also initializes the loop displayed iterations.
     */
    useEffect(() => {
        if (jsonManager) {
            setActiveFunctionIndex(jsonManager.getMain());
            setActiveAndDisplayed(jsonManager.nodes[1].link.file);
            setActiveIterationIndices(jsonManager.initIterations(1, []));
        }
    }, [jsonManager]);

    /**
     * This effect is executed when the displayed file changes. It then loads that file into the editor.
     */
    useEffect(() => {
        if (displayedFile) {
            loadJavaFile();
        }
    }, [displayedFile]);

    /**
     * This effect is executed when the content of the java file, the currently displayed
     * function or the currently displayed iterations change.
     * So when anything displayed in the editor needs to be updated, it updates the editor accordingly.
     */
    useEffect(() => {
        let newEditor;
        if (javaFileContent && editorContainerRef.current) {
            let hints = [];
            if (isActiveDisplayed()) {
                activeIterationIndices.forEach((iterationIndex) => {
                    let position = jsonManager.nodes[iterationIndex].link.range.getStartPosition();
                    let content = `(` + jsonManager.nodes[iterationIndex].iteration + `/`
                        + jsonManager.getLastIterationNumber(iterationIndex) + `)`;
                    hints.push({position, content});
                });
            }
            if (editor) {
                editor.dispose();
            }
            newEditor = EditorInitializer.initializeEditor(
                editorContainerRef,
                javaFileContent,
                hints
            );
            if (newEditor) {
                setEditor(newEditor.editor);
            }
        }
        return () => {
            if (javaFileContent && editorContainerRef.current)
                newEditor.dispose();
        }
    }, [javaFileContent, activeIterationIndices, activeFunctionIndex]);

    /**
     * This effect is executed when the active function changes. It then performs a jump to the new active file.
     */
    useEffect(() => {
        if (jsonManager) {
            setActiveAndDisplayed(jsonManager.nodes[activeFunctionIndex].link.file);
        }
    }, [activeFunctionIndex]);

    useEffect(() => {
        if (jsonManager) {
            setJumpNodesIndices(jsonManager.updateJumpsFunction(activeFunctionIndex, activeIterationIndices));
        }
    }, [activeIterationIndices]);

    /**
     * This effect is executed when the editor changes. It then gets the ranges that should be highlighted from the
     * jsonManager and displays them in the editor if the current file is the one where the active Node is located.
     * It then starts two event listeners for mouse clicks(loops and jumps)
     * and sets the position of the editor to the active Node if it is part of the displayed file.
     */
    useEffect(() => {
        if (jsonManager && editor) {

            let rangesToHighlight = [];
            rangesToHighlight = jsonManager.updateActiveRangesFunction(activeFunctionIndex, activeIterationIndices);

            if (isActiveDisplayed()) {
                setDoPositionJump(true);
                rangesToHighlight.forEach((rangeToHighlight) => {


                    const rangeToHighlightSplit = [];
                    for (let lineNumber = rangeToHighlight.startLineNumber; lineNumber <= rangeToHighlight.endLineNumber; lineNumber++) {
                        const startColumn = lineNumber === rangeToHighlight.startLineNumber ? rangeToHighlight.startColumn : 1;
                        const endColumn = lineNumber === rangeToHighlight.endLineNumber ? rangeToHighlight.endColumn : editor.getLineMaxColumn(lineNumber);

                        rangeToHighlightSplit.push(new monaco.Range(lineNumber, startColumn, lineNumber, endColumn));
                    }

                    rangeToHighlightSplit.forEach((rangeToHighlight) => {
                        highlightActive(rangeToHighlight);
                    });
                });
                /*console.log("last range ", jsonManager.lastRange);
                if (jsonManager.lastRange !== undefined && activeFunctionIndex === jsonManager.getParentFunction(jsonManager.lastRange.nodeIndex)) {
                    if (jsonManager.nodes[jsonManager.lastRange.nodeIndex].nodeType === "Loop") {
                        activeIterationIndices.forEach((activeIterationIndex) => {
                            if(activeIterationIndex === jsonManager.lastRange.nodeIndex)
                                highlightEnd(jsonManager.lastRange.range);
                        });
                    } else {
                        highlightEnd(jsonManager.lastRange.range);
                    }
                }*/

                //drawLine(rangesToHighlight);
                jumpNodesIndices.forEach((jumpIndex) => {
                    if (jsonManager.nodes[jumpIndex].nodeType !== "Function" || jumpIndex === activeFunctionIndex) {
                        console.log("bugfix active");
                        if (jsonManager.nodes[jumpIndex].nodeType === "Function" && jsonManager.nodes[jumpIndex].outLinks.length === 2) {
                            highlightLink(jsonManager.nodes[jumpIndex].outLinks[1].range);
                            jsonManager.updateActiveRangesFunction(activeFunctionIndex, activeIterationIndices).forEach((range) => {
                                if (range.containsRange(jsonManager.nodes[jumpIndex].outLinks[0].range)) {
                                    highlightLink(jsonManager.nodes[jumpIndex].outLinks[0].range);
                                }
                            });
                        } else {
                            jsonManager.nodes[jumpIndex].outLinks.forEach((outLink) => {
                                highlightLink(outLink.range);
                            });
                        }
                    }
                    // We do not want to mark for the link of the current function since it might be in another file
                    // and is not part of the currently active function
                    if (jumpIndex === activeFunctionIndex) {
                        return;
                    }
                    if (jsonManager.nodes[jumpIndex].nodeType === "Function")
                        highlightLink(jsonManager.nodes[jumpIndex].link.range);
                });

                handleJumps();
                handleIterationButton();

                activeIterationIndices.forEach((index) => {
                    highlightLoop(jsonManager.nodes[index].link.range);
                });
            }
            if (!doPositionJump && isActiveDisplayed()) {
                if (activeFunctionIndex !== 1)
                    jumpToPosition(jsonManager.nodes[activeFunctionIndex].outLinks
                        [jsonManager.nodes[activeFunctionIndex].outLinks.length - 1].range.getStartPosition());
                else
                    jumpToPosition(jsonManager.nodes[activeFunctionIndex].link.range.getStartPosition());
                setDoPositionJump(false);
            }
            if (doPositionJump) {
                setDoPositionJump(false);
                jumpToPosition(jumpPosition);
            }
        }

    }, [editor]);

    // Render editor
    return (
        <main className="right-container">
            <div ref={editorContainerRef} className="editor-container"></div>
        </main>
    );
}

EditorManager.propTypes = {
    displayedFile: PropTypes.instanceOf(File),
    setActiveAndDisplayed: PropTypes.instanceOf(Function),
    isActiveDisplayed: PropTypes.instanceOf(Function),
    jsonManager: PropTypes.instanceOf(JsonManager)
};
export default EditorManager;
