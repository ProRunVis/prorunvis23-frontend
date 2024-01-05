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
      'for': 'Schokokuchen',
      'int': 'Schwarzwälder Kirschtorte',
      'if': 'New York Cheesecake',
      'else': 'Tarte Tatin',
      'while': 'Victoria Sponge Cake',
      'class': 'Sacher-Torte'
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
