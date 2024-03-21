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
                <p> Welcome to ProRunVis: </p>
                <p> ProRunVis is a code analysis tool that is supposed to help you understand the control flow of your code through visualization. </p>
                <p> Use the upload button to upload the root folder of a Java project of your choosing. </p>
                <p> The chosen project has to be in a separate folder with only the project-packages in it. </p>
                <p> It furthermore should not use any external libraries the program is currently not able to deal with
                    those. </p>
                <p> The code of your project then gets shown on the right side. </p>
                <p class=".active"> Green background indicates that a statement has been executed. </p>
                <p class=".link"> Blue background indicates a jump at that position to another part of the code, click it to go
                    there. </p>
                <p class=".loop"> Purple background indicates a loop that has been executed, click it to select the iteration that you
                    want displayed. </p>
                <p class=".inactive"> Red background indicates that this is the last code segment that got executed. </p>
                <p> The line on the left side of your code is shown to indicate what path the program took, so where it
                    started and where it ended. </p>
            </div>
        </div>
    );
}
    ReadmeModal.propTypes = {
        closeModal: PropTypes.instanceOf(Function)
    };