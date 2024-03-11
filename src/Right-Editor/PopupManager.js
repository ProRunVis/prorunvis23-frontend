

/**
 * Manages the opening, positioning, and closing of popups within an application.
 * This class is the third in the sequence of operations for popup management. It is
 * responsible for displaying a popup message at a specific position on the screen,
 * updating the message content, and hiding the popup when necessary.
 *
 * The class utilizes a reference to a dialog element (dialogRef), a function to
 * set the popup message (setPopupMessage), and a specified distance from the mouse
 * click position to where the popup should appear (popupDistance).
 */
class PopupManager {

    /**
     * Constructs a PopupManager instance with necessary dependencies.
     *
     * @param dialogRef A reference to the dialog element used for the popup.
     * @param setPopupMessage A function to update the popup's message content.
     * @param popupDistance The distance from the mouse click position to the popup's position.
     */
    constructor(dialogRef, setPopupMessage, popupDistance) {
        console.log("Ich bin ein DialogRef : "+dialogRef)
        this.dialogRef = dialogRef;
        this.setPopupMessage = setPopupMessage;
        this.popupDistance = popupDistance;
        this.closePopup = this.closePopup.bind(this);
    }
    /**
     * Updates the popup's message content.
     *
     * @param message The new message to display in the popup.
     */
    updateMessage(message) {
        this.setPopupMessage(message);
    }

    /**
     * Handles mouse down events to determine where to position and show the popup.
     *
     * @param e The mouse event containing the position data.
     */
    handleMouseDown(e) {
        // Get the mouse position
        const x = e.pageX;
        const y = e.pageY;

        // Open the popup at the mouse position
        this.openPopupAtMousePosition(x, y); // Ändern Sie dies
    }
    /**
     * Opens the popup at the specified mouse position with an offset.
     *
     * @param x The x-coordinate of the mouse position.
     * @param y The y-coordinate of the mouse position.
     */
    openPopupAtMousePosition(x, y) {
        console.log("1- Mouse Position - X:", x, "Y:", y);

        const dialogElement = this.dialogRef.current;
        //console.log("dialogRef  "+ this.dialogElement)
        console.log("1.5- Mouse Position - X:", x, "Y:", y);
        if (dialogElement) {
            dialogElement.style.position = 'absolute';
            dialogElement.style.left = `${x + this.popupDistance}px`;
            dialogElement.style.top = `${y + this.popupDistance}px`;
            dialogElement.style.display = 'block';
        }
    }
    /**
     * Closes the popup and clears its message content.
     */
    closePopup() {
        const dialogElement = this.dialogRef.current;
        if (dialogElement) {
            dialogElement.style.display = 'none';
            this.setPopupMessage(null);
        }
    }
}
export default PopupManager;
