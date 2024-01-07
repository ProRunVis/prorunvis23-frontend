
import PopupTrigger from './PopupTrigger'; 

class EditorClickHandler {
  constructor(editor, popupManager) {
    this.editor = editor;
    this.popupManager = popupManager;
    
    this.popupTrigger = new PopupTrigger(editor, popupManager);
  }

  handleMouseDown() {
    this.editor.onMouseDown(e => {
      const position = e.target.position;
      console.log("Das ist position", position);
      

      if (position) {
        
        this.popupTrigger.handleWordAtPosition(position, e.event);
      }
    });
  }
}

export default EditorClickHandler;
