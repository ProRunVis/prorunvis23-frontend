

/**
 * Kontrolliert das Öffnen, Positionieren und Schließen von Popups.
 * In der Reihenfolge die 3. Klasse die aufgerufen wird
 */
class PopupManager {
  constructor(dialogRef, setPopupMessage, popupDistance) {
    this.dialogRef = dialogRef;
    this.setPopupMessage = setPopupMessage;
    this.popupDistance = popupDistance;
    this.closePopup = this.closePopup.bind(this);
   }

  updateMessage(message) {
    this.setPopupMessage(message);
  }
  handleMouseDown(e) {
    // Get the mouse position
    const x = e.pageX;
    const y = e.pageY;
   
    // Open the popup at the mouse position
    this.openPopupAtMousePosition(x, y); // Ändern Sie dies
  }
   
  openPopupAtMousePosition(x, y) {
    console.log("1- Mouse Position - X:", x, "Y:", y);
    
    const dialogElement = this.dialogRef.current;
    console.log("dialogRef  "+this.dialogElement)
    console.log("1.5- Mouse Position - X:", x, "Y:", y);
    if (dialogElement) {
      dialogElement.style.position = 'absolute';
      dialogElement.style.left = `${x + this.popupDistance}px`;
      dialogElement.style.top = `${y + this.popupDistance}px`;
      dialogElement.style.display = 'block';
    }
  }

  closePopup() {
    const dialogElement = this.dialogRef.current;
    if (dialogElement) {
      dialogElement.style.display = 'none';
      this.setPopupMessage(null);
    }
  }
}
export default PopupManager;
