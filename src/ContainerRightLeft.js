import React, {useEffect, useRef, useState, useMemo} from "react";
import LeftComponent from "./Left-NavbarUpload/LeftComponent";
import RightComponent from "./Right-Editor/RightComponent";
import JsonManager from "./Right-Editor/JsonManager";

/**
 * Contains both the right and left component. It handles communication between the two, mainly regarding changes in
 * the uploaded project files, currently displayed and active files. Active meaning in which file the currently
 * selected function is located.
 * @returns {Element} Right and Left Component
 * @constructor
 */
function ContainerRightLeft() {
    const [displayedFile, setDisplayedFile] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [jsonManager, setJsonManager] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    /**
     * Changes both the current active and current displayed file to the file located at the given filepath.
     * @param path string of file path relative to the project root.
     */
    function setActiveAndDisplayed(path) {
        uploadedFiles.forEach((uploadedFile) => {
            if (path === uploadedFile.webkitRelativePath) {
                setDisplayedFile(uploadedFile);
                setActiveFile(uploadedFile);
            }
        });
    }

    /**
     * Resets the displayed file to the currently active file.
     */
    function setDisplayedToActive() {
        setDisplayedFile(activeFile);
    }

    /**
     * Determines whether the currently displayed file is also the active file.
     * @returns {boolean} result of the above.
     */
    function isActiveDisplayed() {
        if (activeFile == null || displayedFile == null)
            return false;
        return activeFile === displayedFile;
    }

    /**
     * Takes in files and creates a new trace. Then create a JsonManager with json trace data provided by the backend.
     * TODO Create link and fetch to the backend here currently using hardcoded example json
     * @param files project files to be traced.
     */
    function passOnUploadedFiles(files) {
        setUploadedFiles(files);
    }

    return <>
        <LeftComponent setDisplayedFile={setDisplayedFile} setDisplayedToActive={setDisplayedToActive}
                       passOnUploadedFiles={passOnUploadedFiles}/>
        <RightComponent displayedFile={displayedFile} setActiveAndDisplayed={setActiveAndDisplayed}
                        isActiveDisplayed={isActiveDisplayed} jsonManager={jsonManager}/>
    </>
}

export default ContainerRightLeft;
