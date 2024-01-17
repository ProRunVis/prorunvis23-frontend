import React from 'react';

// Main component for data upload
export default function LeftComponent() {
  return (
    <main className="left-container">
      {/* Upload dialogue */}
      <div className="button-container">
        <form className="text-box-button" encType="multipart/form-data">
          <input type="file" name="file" multiple="" webkitdirectory="" />
        </form>
      </div>
      {/* Field below upload dialogue for further space optimization */}
      <div className="subUpload">
        <h1>
          Hier könnte Ihre Werbung stehen 
          
        </h1>
      </div>
    </main>
  );
}
