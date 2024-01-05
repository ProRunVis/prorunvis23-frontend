
import React, { useState } from "react";
import Modal from "react-modal";
import ReadmeModal2 from "./ReadmeModal2.js";

Modal.setAppElement("#root");
/* HelpButton mit reactModal */
export default function HelpButton2() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

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
        <ReadmeModal2 closeModal={closeModal} />
      </Modal>
    </>
  );
}
