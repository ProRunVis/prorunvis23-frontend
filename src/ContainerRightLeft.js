import React, { useEffect, useRef, useState, useMemo } from "react";
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
function ContainerRightLeft(){
    const [displayedFile, setDisplayedFile] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [jsonManager, setJsonManager] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    /**
     * Changes both the current active and current displayed file to the file located at the given filepath.
     * @param path string of file path relative to the project root.
     */
    function setActiveAndDisplayed(path){
        uploadedFiles.forEach((uploadedFile) => {
            console.log(uploadedFile.webkitRelativePath.slice(uploadedFile.webkitRelativePath.indexOf('/') + 1, uploadedFile.webkitRelativePath.length));
            console.log(path);
            if(path === uploadedFile.webkitRelativePath.slice(uploadedFile.webkitRelativePath.indexOf('/') + 1, uploadedFile.webkitRelativePath.length)){
                setDisplayedFile(uploadedFile);
                setActiveFile(uploadedFile);
            }
        });
    }

    /**
     * Resets the displayed file to the currently active file.
     */
    function setDisplayedToActive(){
        setDisplayedFile(activeFile);
    }

    /**
     * Determines whether the currently displayed file is also the active file.
     * @returns {boolean} result of the above.
     */
    function isActiveDisplayed(){
        if(activeFile == null || displayedFile == null)
            return false;
        return activeFile === displayedFile;
    }

    /**
     * Takes in files and creates a new trace. Then create a JsonManager with json trace data provided by the backend.
     * TODO Create link and fetch to the backend here currently using hardcoded example json
     * @param files project files to be traced.
     */
    function passOnUploadedFiles(files){
            setUploadedFiles(files);
            setJsonManager(new JsonManager('[{"ranges":[],"childrenIndices":[1],"outLinks":[],"outIndex":0,"traceId":"root"},{"ranges":[{"begin":{"line":5,"column":9},"end":{"line":5,"column":14}},{"begin":{"line":6,"column":9},"end":{"line":6,"column":18}},{"begin":{"line":7,"column":9},"end":{"line":7,"column":18}},{"begin":{"line":8,"column":13},"end":{"line":8,"column":18}}],"childrenIndices":[2,11],"parentIndex":0,"link":{"filepath":"ReturnTest.java","begin":{"line":0,"column":0},"end":{"line":0,"column":0}},"outLinks":[{"filepath":"ReturnTest.java","begin":{"line":8,"column":21},"end":{"line":8,"column":27}}],"outIndex":0,"traceId":"0"},{"ranges":[{"begin":{"line":14,"column":9},"end":{"line":14,"column":18}},{"begin":{"line":16,"column":14},"end":{"line":16,"column":22}},{"begin":{"line":16,"column":25},"end":{"line":16,"column":29}}],"childrenIndices":[3,5,7,9],"parentIndex":1,"link":{"filepath":"ReturnTest.java","begin":{"line":5,"column":9},"end":{"line":5,"column":11}},"outLinks":[{"filepath":"ReturnTest.java","begin":{"line":23,"column":17},"end":{"line":23,"column":23}},{"filepath":"ReturnTest.java","begin":{"line":12,"column":24},"end":{"line":12,"column":26}}],"outIndex":1,"traceId":"2"},{"ranges":[{"begin":{"line":18,"column":17},"end":{"line":18,"column":21}},{"begin":{"line":27,"column":13},"end":{"line":27,"column":22}},{"begin":{"line":16,"column":32},"end":{"line":16,"column":34}}],"childrenIndices":[4],"parentIndex":2,"link":{"begin":{"line":16,"column":9},"end":{"line":16,"column":11}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"3"},{"ranges":[{"begin":{"line":25,"column":17},"end":{"line":25,"column":26}}],"childrenIndices":[],"parentIndex":3,"outLinks":[],"outIndex":0,"traceId":"6"},{"ranges":[{"begin":{"line":18,"column":17},"end":{"line":18,"column":21}},{"begin":{"line":27,"column":13},"end":{"line":27,"column":22}},{"begin":{"line":16,"column":32},"end":{"line":16,"column":34}}],"childrenIndices":[6],"parentIndex":2,"link":{"begin":{"line":16,"column":9},"end":{"line":16,"column":11}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"3"},{"ranges":[{"begin":{"line":25,"column":17},"end":{"line":25,"column":26}}],"childrenIndices":[],"parentIndex":5,"outLinks":[],"outIndex":0,"traceId":"6"},{"ranges":[{"begin":{"line":18,"column":17},"end":{"line":18,"column":21}},{"begin":{"line":27,"column":13},"end":{"line":27,"column":22}},{"begin":{"line":16,"column":32},"end":{"line":16,"column":34}}],"childrenIndices":[8],"parentIndex":2,"link":{"begin":{"line":16,"column":9},"end":{"line":16,"column":11}},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"3"},{"ranges":[{"begin":{"line":25,"column":17},"end":{"line":25,"column":26}}],"childrenIndices":[],"parentIndex":7,"outLinks":[],"outIndex":0,"traceId":"6"},{"ranges":[{"begin":{"line":18,"column":17},"end":{"line":18,"column":21}}],"childrenIndices":[10],"parentIndex":2,"link":{"begin":{"line":16,"column":9},"end":{"line":16,"column":11}},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"3"},{"ranges":[{"begin":{"line":22,"column":17},"end":{"line":22,"column":20}},{"begin":{"line":23,"column":17},"end":{"line":23,"column":23}}],"childrenIndices":[],"parentIndex":9,"outLinks":[],"outIndex":0,"traceId":"5"},{"ranges":[{"begin":{"line":8,"column":21},"end":{"line":8,"column":27}}],"childrenIndices":[],"parentIndex":1,"outLinks":[],"outIndex":0,"traceId":"1"}]'))}

    return <>
    <LeftComponent setDisplayedFile={setDisplayedFile} setDisplayedToActive={setDisplayedToActive} passOnUploadedFiles={passOnUploadedFiles}/>
    <RightComponent displayedFile={displayedFile} setActiveAndDisplayed={setActiveAndDisplayed} isActiveDisplayed={isActiveDisplayed} jsonManager={jsonManager}/>
    </>
}
export default ContainerRightLeft;
