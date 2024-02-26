/**
 * Defines a modal component that displays readme or help information to the user.
 * This functional component renders a modal dialog containing a title and a message
 * indicating that help will not be provided from external sources. A close button is
 * also provided, allowing the user to dismiss the modal. This component demonstrates
 * the use of props in React for passing the closeModal function, enabling the modal
 * to be closed from within.
 *
 * @param {Object} props - Component props.
 * @param {Function} props.closeModal - Function to close the modal.
 */
export default function ReadmeModal({ closeModal }) {
  return (
    <div className="modal-container">
      <button className="modal-close-button" onClick={closeModal}>
        Close
      </button>
      <div className="modal-content">
        <h2>Readme</h2>
        <p>there will be no help from elsewhere</p>
      </div>
    </div>
  );
}