/**
 * Determines whether a popup should be displayed based on the current cursor position in the editor.
 * This class is the second to be called in the sequence of operations for managing popups.
 * It is responsible for identifying the word under the cursor when an event occurs and
 * triggering a popup if the word matches predefined criteria.
 */

class PopupTrigger {

  /**
   * Constructs a PopupTrigger instance with necessary dependencies.
   *
   * @param editor The editor instance where text is being edited.
   * @param popupManager The PopupManager instance used to display and manage popups.
   * @param message The default message to display in the popup (not used in current implementation).
   */
  constructor(editor, popupManager, message) {
    this.editor = editor;
    this.popupManager = popupManager;
    this.message = message;
  }
/**
   * Handles the logic to display a popup based on the word at the given position.
   * This method is intended to be called when an event occurs that requires checking
   * the word under the cursor, such as a mouse click or hover event in the editor.
   *
   * @param position The position in the editor where the event occurred.
   * @param event The event object containing additional information such as mouse position.
   */
  handleWordAtPosition(position, event) {
   
      this.showPopup(position, event);
    
  }
/**
   * Displays a popup if the word at the given position matches predefined criteria.
   * This method extracts the word at the cursor's position, checks if it is one of
   * the predefined keywords, and if so, triggers the popup with a specific message
   * related to that keyword.
   *
   * @param position The position in the editor to check for a word.
   * @param event The event object containing the mouse position (posx and posy) for popup placement.
   */
  showPopup(position, event) {

    console.log("3 -Mouse Position - X:", event.posx, "Y:", event.posy); // Zum Debuggen
   // Die Koordinaten bis hier sind korrekt
    const model = this.editor.getModel();
    
    const word = model.getWordAtPosition(position);
    

    const wordMessages = {
      'for': 'Das ist ein for',
      'int': 'Das ist ein int',
      'if': 'Das ist ein if',
      'else': 'Das ist ein else',
      'while': 'Das ist ein while',
      'class': 'Das ist ein "class"'
    };

    if (word && word.word in wordMessages) {
    

      const mouseX = event.posx;
      const mouseY = event.posy;
      this.popupManager.updateMessage(wordMessages[word.word]);
      this.popupManager.openPopupAtMousePosition(mouseX, mouseY);
    }
  }
}

export default PopupTrigger;
