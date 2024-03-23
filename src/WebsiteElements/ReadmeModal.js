import React, {useState} from 'react';
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
    const content = [
        <div key={1}><b> Welcome to ProRunVis: </b>
            <p> ProRunVis is a code analysis tool that is supposed to help you understand the control flow of your
                code through visualization. </p></div>,
        <div key={2}><b> Upload: </b>
            <p> Use the <b>choose-files-button</b> to upload the root folder of a Java project of your choosing. </p>
            <p> The chosen project has to be in a separate folder with only the project-packages in it. It
                furthermore should not use any external libraries the program is currently not able to deal with
                those.</p>
            <p> The code of your project then gets shown on the <b>right side</b>. </p></div>,
        <div key={3}><b> Visualization: </b>
            <p> Only one function call is visualized at the same time. </p>
            <p style={{backgroundColor: "green"}}> <b>Green</b> background indicates that a statement has been
                executed. </p>
            <p style={{backgroundColor: "blue"}}> <b>Blue</b> background indicates a jump at that position to another part
                of the
                code. Click it to go there and change the function call currently visualized. </p>
            <p style={{backgroundColor: "purple"}}> <b>Purple</b> background indicates a loop that has been executed, click
                it to
                select the iteration that you
                want displayed. </p>
            <p style={{backgroundColor: "red"}}> <b>Red</b> background indicates that this is the last code segment that
                got
                executed. </p>
            <p> The <b>line</b> on the left side of your code is shown to indicate what path the program took.
                It is decorated with <b>elements</b> that help you to identify specific code structures such as loops or
                    function calls.</p></div>,
        <div key={4}><b> Navigation: </b>
            <p> You can use the <b>directory bar</b> on the left side to open all the Java files in your project. </p>
            <p> If you want to jump back to the file with the function currently visualized you can use the <b>Jump-to-active-function-button</b>, it will open the file for you and display the function.</p> </div>];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleBack = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, content.length - 1));
    };

    return (
        <div className="modal-container">
            <button className="modal-close-button" onClick={closeModal}>
                Close
            </button>
            <div className="modal-content">
                <h2><u>Tutorial</u></h2>
            </div>
            <div className="modal-buttons">
                <button onClick={handleBack} disabled={currentIndex === 0}>
                    Back
                </button>
                <button onClick={handleNext} disabled={currentIndex === content.length - 1}>
                    Next
                </button>
                <b> {currentIndex + 1} / {content.length} </b>
            </div>
            <div><p></p>{content[currentIndex]}</div>
        </div>
    );
}
    ReadmeModal.propTypes = {
        closeModal: PropTypes.instanceOf(Function)
    };