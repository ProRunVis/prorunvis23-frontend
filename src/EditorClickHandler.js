
import PopupTrigger from './PopupTrigger'; 

/**
 * Verarbeitet die Mausklicks innerhalb des Editors
 * In der Reihenfolge die 1. Klasse die aufgerufen wird
 */
class EditorClickHandler {
  constructor(editor, popupManager) {
    this.editor = editor;
    this.popupManager = popupManager;    
    this.popupTrigger = new PopupTrigger(editor, popupManager);
  }

  handleMouseDown() {
    this.editor.onMouseDown(e => {
      const position = e.target.position;
      if (position) {
        console.log("posx:", e.event.posx, "posy:", e.event.posy); // Debugging
        this.popupTrigger.handleWordAtPosition(position, e.event);
      }
    });
  }
}

export default EditorClickHandler;


