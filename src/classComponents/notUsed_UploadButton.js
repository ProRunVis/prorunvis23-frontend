import React, { useState } from 'react';
import hljs from 'highlight.js';

export default function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState('');
  const onFileUploaded = () => {
    // Ihre Logik nach dem Hochladen der Datei
  };
  // Handler for file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.name.endsWith('.java')) {
        setSelectedFile(file);
        readFileContent(file);
        setError('');
        onFileUploaded();
      } else {
        setError('.java only');
        setSelectedFile(null);
        setFileContent('');
      }
    }
  };

  // Function to read the file content
  const readFileContent = (file) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      setFileContent(reader.result);
    };
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {!selectedFile && ( // Bedingung, um das Feld anzuzeigen, wenn keine Datei ausgewählt wurde
        <>
        <input type="file" onChange={handleFileChange} style={{ display: 'none'}} id="fileInput" />
        <button onClick={() => document.getElementById('fileInput').click()} className='uploadButton'>
            Upload File
        </button>
    </>
    
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {fileContent && <textarea value={fileContent} readOnly className='textFieldAfterCompletion' />}
    </div>
  );
}
