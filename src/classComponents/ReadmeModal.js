import React from "react";

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