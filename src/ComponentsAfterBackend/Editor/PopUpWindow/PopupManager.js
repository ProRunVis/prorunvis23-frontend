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
    const x = e.pageX;
    const y = e.pageY;
    this.openPopupAtMousePosition(x, y);
  }

  openPopupAtMousePosition(x, y) {
    const dialogElement = this.dialogRef.current;
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
