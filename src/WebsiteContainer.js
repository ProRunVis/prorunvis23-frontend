import React, {useEffect, useRef, useState, useMemo} from "react";
import DirectoryBar from "./WebsiteElements/DirectoryBar";
import EditorManager from "./Editor/EditorManager";
import JsonManager from "./Editor/JsonManager";

function WebsiteContainer() {
    const [displayedFile, setDisplayedFile] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [jsonManager, setJsonManager] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showTraceDialog, setShowTraceDialog] = useState(false);
    const [traceFile, setTraceFile] = useState(null);

    function setActiveAndDisplayed(path) {
        uploadedFiles.forEach((uploadedFile) => {
            if (path === uploadedFile.webkitRelativePath
                || uploadedFile.webkitRelativePath.endsWith('/' + path)) {
                setDisplayedFile(uploadedFile);
                setActiveFile(uploadedFile);
            }
        });
    }

    function setDisplayedToActive() {
        setDisplayedFile(activeFile);
    }

    function isActiveDisplayed() {
        if (activeFile == null || displayedFile == null)
            return false;
        return activeFile === displayedFile;
    }

    async function passOnUploadedFiles(files){
        setUploadedFiles(files);

        const formData = new FormData();
        files.forEach(file => {
            if (file.webkitRelativePath.endsWith('.java')) {
                formData.append("file", file, file.webkitRelativePath);
            }
        });

        await fetch("/api/upload",{
            method: "POST",
            body: formData
        });

        setShowTraceDialog(true);
    }

    async function handleTraceUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        await fetch("/api/upload-trace", {
            method: "POST",
            body: formData
        });

        setTraceFile(file);
        setShowTraceDialog(false);
        await processAndVisualize();
    }

    async function handleSkipTrace() {
        setShowTraceDialog(false);
        await processAndVisualize();
    }

    async function processAndVisualize() {
        const response = await fetch("/api/process");
        if (!response.ok) {
            const errorText = await response.text();
            alert("Processing error: " + errorText);
            return;
        }
        const jsonData = await response.json();
        setJsonManager(new JsonManager(jsonData));
    }

    return <>
        <DirectoryBar setDisplayedFile={setDisplayedFile} setDisplayedToActive={setDisplayedToActive}
                      passOnUploadedFiles={passOnUploadedFiles} traceFile={traceFile}/>
        <EditorManager displayedFile={displayedFile} setActiveAndDisplayed={setActiveAndDisplayed}
                       isActiveDisplayed={isActiveDisplayed} jsonManager={jsonManager}/>

        {showTraceDialog && (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '24px',
                    maxWidth: '420px',
                    width: '90%',
                    textAlign: 'center'
                }}>
                    <h3 style={{margin: '0 0 12px 0'}}>SrcTracer Trace File</h3>
                    <p style={{margin: '0 0 20px 0', fontSize: '14px'}}>
                        Do you have a SrcTracer trace file for this program?
                        If yes, the SrcTracer retracing path will be used.
                        Otherwise, the program will be compiled and run directly.
                    </p>
                    <div style={{display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <label style={{
                            padding: '8px 20px',
                            backgroundColor: 'var(--accent-color, #61DAFB)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}>
                            Upload trace file
                            <input
                                type="file"
                                accept=".txt,.trace"
                                onChange={handleTraceUpload}
                                style={{display: 'none'}}
                            />
                        </label>
                        <button onClick={handleSkipTrace} style={{
                            padding: '8px 20px',
                            backgroundColor: 'transparent',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}>
                            Skip (compile &amp; run)
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
}

export default WebsiteContainer;
