import PopupTrigger from './PopupTrigger';
import {Position} from "monaco-editor";
import '../Css/Decorate.css';


/**
 * Handles mouse clicks within the editor. This class is the first to be invoked
 * in the sequence of handling an editor click event. It initializes the handling
 * mechanism by associating the editor with a popup manager and setting up a popup
 * trigger for further interaction.
 *
 * The main functionality is provided through the handleMouseDown method, which
 * sets up an event listener for mouse down events within the editor. Upon detecting
 * a mouse down event, it calculates the position of the event and, if valid, it logs
 * the position for debugging purposes and triggers a popup based on the word at the
 * clicked position.
 */
class EditorClickHandler {
  /**
   * Constructs an instance of EditorClickHandler.
   *
   * @param editor The editor instance on which mouse events are to be handled.
   * @param popupManager The popup manager responsible for managing popup actions.
   */
  constructor(editor, popupManager) {
    this.editor = editor;
    this.popupManager = popupManager;
    this.popupTrigger = new PopupTrigger(editor, popupManager);
    this.jumps = [];
    this.loops = [];
  }

  /**
   * Sets up an event listener for mouse down events on the editor. When a mouse down
   * event is detected, it determines the position of the event. If the position is valid,
   * it logs the x and y coordinates of the event for debugging purposes and triggers
   * a popup based on the word located at the event's position.
   */
  handleMouseDown() {
    this.editor.onMouseDown(e => {
      const position = e.target.position;

      if (position) {
        //console.log("posx:", e.event.posx, "posy:", e.event.posy); // Debugging
        //this.popupTrigger.handleWordAtPosition(position, e.event);
        this.jumpTo(new Position(152, 1));
        //RightComponent("./MethodCallTesting2");
      }
    });
  }

  jumpTo(position) {
    this.editor.setPosition(position);
    this.editor.revealLineNearTop(position.lineNumber);
  }

  highlightRed(range) {
    this.editor.createDecorationsCollection([
      {
        options: {className: "red"},
        range: {
          startLineNumber: range.startLineNumber,
          startColumn: range.startColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn
        }
      }
    ]);
  }

  resetJumps(){
    this.jumps = [];
  }

  resetLoops(){
    this.loops = [];
  }
addJump(range){
  this.jumps.push(range);
}
addLoop(range, iteration){
  this.loops.push([range, iteration]);
  }

  highlightGreen(range) {
    //console.log("Range in highlight green:");
    //console.log(range);
    /*this.editor.createDecorationsCollection([
      {
        options: {className: "green"},
        range: {
          startLineNumber: range.startLineNumber,
          startColumn: range.startColumn,
          endLineNumber: range.endLineNumber,
          endColumn: range.endColumn
        }
      }
    ]);*/
  }


}

export default EditorClickHandler;
