import React from "react";
import PropTypes from "prop-types";

/**
 * Defines a modal component that displays readme or help information to the user.
 * This functional component renders a modal dialog containing a title and a message
 * indicating that help will not be provided from external sources. A close button is
 * also provided, allowing the user to dismiss the modal. This component demonstrates
 * the use of props in React for passing the closeModal function, enabling the modal
 * to be closed from within.
 * @param {Function} props.closeModal - Function to close the modal.
 */
export default function ReadmeModal({closeModal}) {
  return (
    <div className="modal-container">
      <button className="modal-close-button" onClick={closeModal}>
        Close
      </button>
        <div className="modal-content">
            <h2>Tutorial</h2>
            <p> Use the upload button to upload the root folder of a java project of your choosing. </p>
            <p> The chosen project has to be in a separate folder with only the project in it. </p>
            <p> It furthermore should not use any external libraries the program is currently not able to deal with those. </p>
            <p> Your code then gets shown on the right side. </p>
            <p> Green background indicates that a statement has been executed. </p>
            <p> Blue background indicates a jump at that position to another part of the code, click it to go there. </p>
            <p> Orange background indicates a loop that has been executed, click it to select the iteration that you want displayed. </p>
            <p> The line on the left side of your code is shown to indicate what path the program took, so where it started and where it ended. </p>
        </div>
    </div>
  );
}
ReadmeModal.propTypes = {
    closeModal: PropTypes.instanceOf(Function)
};