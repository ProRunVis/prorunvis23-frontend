import React, { useState } from "react";
import Modal from "react-modal";
import ReadmeModal from "./ReadmeModal";
import "../Css/HelpButton.css"

// Sets the app element for accessibility reasons, which helps screen readers.
Modal.setAppElement("#root");

/**
 * Defines a HelpButton component using ReactModal for displaying help information.
 * This component manages the state of the modal (open/close) and renders a button
 * that, when clicked, opens a modal containing the ReadmeModal component. This modal
 * provides help or documentation to the user. The component demonstrates the use of
 * React's useState hook for state management and the integration of third-party modal
 * functionality for enhanced UI interactions.
 */
export default function HelpButton() {
  // State to track if the modal is open or closed.
  const [modalIsOpen, setModalIsOpen] = useState(false);

  /**
   * Opens the modal by setting the modalIsOpen state to true.
   */
  const openModal = () => {
    setModalIsOpen(true);
  };

  /**
   * Closes the modal by setting the modalIsOpen state to false.
   */
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <button className="nav--help-button" onClick={openModal}>
        Help
      </button>
      <Modal
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        contentLabel="Readme Modal" 
      >
        <ReadmeModal closeModal={closeModal} /> // Renders the content of the modal.
      </Modal>
    </>
  );
}
