let firstClick = true;

class PopupManager {
  constructor(dialogRef, setPopupMessage) {
    this.dialogRef = dialogRef;
    this.setPopupMessage = setPopupMessage;
    this.closePopup = this.closePopup.bind(this);
  }

  updateMessage(message) {
    this.setPopupMessage(message);
  }
  
  openPopupAtMousePosition(x, y) {
    console.log("1- Mouse Position - X:", x, "Y:", y);
    
    const dialogElement = this.dialogRef.current;
    console.log("dialogRef "+dialogElement)
    console.log("1.5- Mouse Position - X:", x, "Y:", y);
    if (dialogElement) {
      dialogElement.style.position = 'absolute';
      dialogElement.style.left = `${x}px`;
      dialogElement.style.top = `${y}px`;
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
