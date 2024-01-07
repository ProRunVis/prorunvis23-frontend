class PopupTrigger {
  constructor(editor, popupManager, message) {
    this.editor = editor;
    this.popupManager = popupManager;
    this.message = message;
  }

  handleWordAtPosition(position, event) {
   
      this.showPopup(position, event);
    
  }

  showPopup(position, event) {

    console.log("3 -Mouse Position - X:", event.posx, "Y:", event.posy); // Zum Debuggen
   // Die Koordinaten bis hier sind korrekt
    const model = this.editor.getModel();
    console.log("FLLLL"+model)
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
