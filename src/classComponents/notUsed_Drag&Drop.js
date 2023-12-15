
/*import React, { useState, useEffect, useRef } from 'react';
import hljs from 'highlight.js';

function DragAndDrop({ onFileUploaded, children }) {
    const [drag, setDrag] = useState(false);
    const [fileContent, setFileContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    
    const dragCounter = useRef(0);
    const dropRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDrag(true);
        }
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDrag(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDrag(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.java')) {
                setSelectedFile(file);
                setError('');
                readFileContent(file);
            } else {
                setError('Wrong file type');
                setSelectedFile(null);
                setFileContent('');
            }
            e.dataTransfer.clearData();
            dragCounter.current = 0;
            onFileUploaded();
        }
    };

    const readFileContent = (file) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => {
            setFileContent(reader.result);
        };
    };

    useEffect(() => {
        const div = dropRef.current;
        div.addEventListener('dragenter', handleDragIn);
        div.addEventListener('dragleave', handleDragOut);
        div.addEventListener('dragover', handleDrag);
        div.addEventListener('drop', handleDrop);

        return () => {
            div.removeEventListener('dragenter', handleDragIn);
            div.removeEventListener('dragleave', handleDragOut);
            div.removeEventListener('dragover', handleDrag);
            div.removeEventListener('drop', handleDrop);
        };
    }, []);

    return (
        <div ref={dropRef} className='drop-pointer'>
            {!selectedFile && (
                <div>
                    {drag && (
                        <div className='dragAndDropCoverUp'>
                            <div style={{ position: 'absolute', top: '50%', right: 0, left: 0, textAlign: 'center', color: 'white', fontSize: 36 }}>
                                <div>drop here :</div>
                            </div>
                        </div>
                    )}
                    {children}
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {selectedFile && <p>Deine Datei wurde erfolgreich gedropped: {selectedFile.name}</p>}

            {fileContent && (
                <textarea readOnly value={fileContent} className='textFieldAfterCompletion' />
            )}
        </div>
    );
}

export default DragAndDrop;

*/
