import PopupTrigger from './PopupTrigger';
import '../Css/Decorate.css';


/**
 * CURRENTLY NOT IN USE
 *
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
  }

  /**
   * Sets up an event listener for mouse down events on the editor. When a mouse down
   * event is detected, it determines the position of the event. If the position is valid,
   * it logs the x and y coordinates of the event for debugging purposes and triggers
   * a popup based on the word located at the event's position.
   */
  handleMouseDown() {
    let p;
    this.editor.onMouseDown(e => {
      p = e.target.position;
    });
    return p;
    //Handle Mouse Down currently disabled
  }

  jumpTo(position) {
    this.editor.setPosition(position);
    this.editor.revealLineNearTop(position.lineNumber);
  }
}

export default EditorClickHandler;
