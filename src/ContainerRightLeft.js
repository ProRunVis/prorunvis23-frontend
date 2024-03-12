import React, { useEffect, useRef, useState, useMemo } from "react";
import LeftComponent from "./Left-NavbarUpload/LeftComponent";
import RightComponent from "./Right-Editor/RightComponent";
import JsonManager from "./Right-Editor/JsonManager";
import SimpleDialogDemo from "./Right-Editor/Dialog";

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
    async function setActiveAndDisplayed(path){
        for (const uploadedFile of uploadedFiles) {
            if(path === uploadedFile.webkitRelativePath.slice(uploadedFile.webkitRelativePath.indexOf('/') + 1, uploadedFile.webkitRelativePath.length)){
                setDisplayedFile(uploadedFile);
                setActiveFile(uploadedFile);
            }
        }
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
    //setJsonManager(new JsonManager('[{"ranges":[],"childrenIndices":[1],"outLinks":[],"outIndex":0,"traceId":"root"},{"ranges":[{"begin":{"line":4,"column":9},"end":{"line":4,"column":18}},{"begin":{"line":5,"column":13},"end":{"line":5,"column":17}}],"childrenIndices":[2],"parentIndex":0,"link":{"begin":{"line":3,"column":1},"end":{"line":3,"column":2},"file":"AMain.java"},"outLinks":[],"outIndex":0,"traceId":"4"},{"ranges":[{"begin":{"line":8,"column":13},"end":{"line":8,"column":22}}],"childrenIndices":[3],"parentIndex":1,"outLinks":[],"outIndex":0,"traceId":"6"},{"ranges":[{"begin":{"line":4,"column":9},"end":{"line":4,"column":18}},{"begin":{"line":5,"column":13},"end":{"line":5,"column":17}}],"childrenIndices":[],"parentIndex":2,"link":{"begin":{"line":8,"column":17},"end":{"line":8,"column":19},"file":"Bar.java"},"outLinks":[{"begin":{"line":3,"column":24},"end":{"line":3,"column":26}}],"outIndex":2,"traceId":"0"}]'));
            setJsonManager(new JsonManager('[{"ranges":[],"childrenIndices":[1],"outLinks":[],"outIndex":0,"traceId":"root"},{"ranges":[{"begin":{"line":5,"column":9},"end":{"line":5,"column":18}},{"begin":{"line":7,"column":15},"end":{"line":7,"column":20}},{"begin":{"line":20,"column":17},"end":{"line":20,"column":17}}],"childrenIndices":[2,4,5,6,8],"parentIndex":0,"link":{"begin":{"line":3,"column":17},"end":{"line":3,"column":26},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"traceId":"0"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":26}}],"childrenIndices":[3],"parentIndex":1,"link":{"begin":{"line":7,"column":9},"end":{"line":7,"column":13},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"1"},{"ranges":[{"begin":{"line":9,"column":17},"end":{"line":9,"column":20}},{"begin":{"line":10,"column":17},"end":{"line":10,"column":25}}],"childrenIndices":[],"parentIndex":2,"outLinks":[],"outIndex":0,"traceId":"2"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":26}},{"begin":{"line":12,"column":13},"end":{"line":12,"column":16}},{"begin":{"line":13,"column":17},"end":{"line":13,"column":26}},{"begin":{"line":17,"column":13},"end":{"line":17,"column":16}}],"childrenIndices":[],"parentIndex":1,"link":{"begin":{"line":7,"column":9},"end":{"line":7,"column":13},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"1"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":26}},{"begin":{"line":12,"column":13},"end":{"line":12,"column":16}},{"begin":{"line":13,"column":17},"end":{"line":13,"column":26}},{"begin":{"line":17,"column":13},"end":{"line":17,"column":16}}],"childrenIndices":[],"parentIndex":1,"link":{"begin":{"line":7,"column":9},"end":{"line":7,"column":13},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"1"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":26}},{"begin":{"line":12,"column":13},"end":{"line":12,"column":16}},{"begin":{"line":13,"column":17},"end":{"line":13,"column":26}}],"childrenIndices":[7],"parentIndex":1,"link":{"begin":{"line":7,"column":9},"end":{"line":7,"column":13},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"1"},{"ranges":[{"begin":{"line":14,"column":17},"end":{"line":14,"column":23}},{"begin":{"line":15,"column":17},"end":{"line":15,"column":22}}],"childrenIndices":[],"parentIndex":6,"outLinks":[],"outIndex":0,"traceId":"3"},{"ranges":[{"begin":{"line":31,"column":17},"end":{"line":31,"column":22}}],"childrenIndices":[],"parentIndex":1,"outLinks":[],"outIndex":0,"traceId":"7"}]'));
    }


    return <>
    <LeftComponent setDisplayedFile={setDisplayedFile} setDisplayedToActive={setDisplayedToActive} passOnUploadedFiles={passOnUploadedFiles}/>
    <RightComponent displayedFile={displayedFile} setActiveAndDisplayed={setActiveAndDisplayed} isActiveDisplayed={isActiveDisplayed} jsonManager={jsonManager}/>
    </>
}
export default ContainerRightLeft;
