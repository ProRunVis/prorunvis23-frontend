import React from 'react';

// Die Hauptkomponente für die Dateiverarbeitung
export default function LeftComponent() {
  return (
    <main className="left-container white-text">

      {/* Benutzerdefinierte Schaltflächen für das Öffnen und Verarbeiten von Java-Dateien */}
      <div className="button-container">
        <form className="text-box button" encType="multipart/form-data">
          <input type="file" name="file" multiple="" webkitdirectory="" />
        </form>
      </div>
    </main>
  );
}
