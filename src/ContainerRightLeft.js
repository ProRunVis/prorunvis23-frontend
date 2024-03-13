import React, { useEffect, useRef, useState, useMemo } from "react";
import LeftComponent from "./Left-NavbarUpload/LeftComponent";
import RightComponent from "./Right-Editor/RightComponent";
import JsonManager from "./Right-Editor/JsonManager";
//import SimpleDialogDemo from "./Right-Editor/Dialog";

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
                setActiveFile(uploadedFile);
                setDisplayedFile(uploadedFile);
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
        return activeFile.webkitRelativePath.slice(activeFile.webkitRelativePath.indexOf('/') + 1, activeFile.webkitRelativePath.length) === displayedFile.webkitRelativePath.slice(displayedFile.webkitRelativePath.indexOf('/') + 1, displayedFile.webkitRelativePath.length);
    }

    /**
     * Takes in files and creates a new trace. Then create a JsonManager with json trace data provided by the backend.
     * TODO Create link and fetch to the backend here currently using hardcoded example json
     * @param files project files to be traced.
     */
    function passOnUploadedFiles(files){
            setUploadedFiles(files);
    //setJsonManager(new JsonManager('[{"ranges":[],"childrenIndices":[1],"outLinks":[],"outIndex":0,"traceId":"root"},{"ranges":[{"begin":{"line":4,"column":9},"end":{"line":4,"column":18}},{"begin":{"line":5,"column":13},"end":{"line":5,"column":17}}],"childrenIndices":[2],"parentIndex":0,"link":{"begin":{"line":3,"column":1},"end":{"line":3,"column":2},"file":"AMain.java"},"outLinks":[],"outIndex":0,"traceId":"4"},{"ranges":[{"begin":{"line":8,"column":13},"end":{"line":8,"column":22}}],"childrenIndices":[3],"parentIndex":1,"outLinks":[],"outIndex":0,"traceId":"6"},{"ranges":[{"begin":{"line":4,"column":9},"end":{"line":4,"column":18}},{"begin":{"line":5,"column":13},"end":{"line":5,"column":17}}],"childrenIndices":[],"parentIndex":2,"link":{"begin":{"line":8,"column":17},"end":{"line":8,"column":19},"file":"Bar.java"},"outLinks":[{"begin":{"line":3,"column":24},"end":{"line":3,"column":26}}],"outIndex":2,"traceId":"0"}]'));
           // setJsonManager(new JsonManager('[{"ranges":[],"childrenIndices":[1],"outLinks":[],"outIndex":0,"traceId":"root"},{"ranges":[{"begin":{"line":5,"column":9},"end":{"line":5,"column":18}},{"begin":{"line":7,"column":15},"end":{"line":7,"column":20}},{"begin":{"line":20,"column":17},"end":{"line":20,"column":17}}],"childrenIndices":[2,4,5,6,8],"parentIndex":0,"link":{"begin":{"line":3,"column":17},"end":{"line":3,"column":26},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"traceId":"0"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":26}}],"childrenIndices":[3],"parentIndex":1,"link":{"begin":{"line":7,"column":9},"end":{"line":7,"column":13},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"1"},{"ranges":[{"begin":{"line":9,"column":17},"end":{"line":9,"column":20}},{"begin":{"line":10,"column":17},"end":{"line":10,"column":25}}],"childrenIndices":[],"parentIndex":2,"outLinks":[],"outIndex":0,"traceId":"2"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":26}},{"begin":{"line":12,"column":13},"end":{"line":12,"column":16}},{"begin":{"line":13,"column":17},"end":{"line":13,"column":26}},{"begin":{"line":17,"column":13},"end":{"line":17,"column":16}}],"childrenIndices":[],"parentIndex":1,"link":{"begin":{"line":7,"column":9},"end":{"line":7,"column":13},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"1"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":26}},{"begin":{"line":12,"column":13},"end":{"line":12,"column":16}},{"begin":{"line":13,"column":17},"end":{"line":13,"column":26}},{"begin":{"line":17,"column":13},"end":{"line":17,"column":16}}],"childrenIndices":[],"parentIndex":1,"link":{"begin":{"line":7,"column":9},"end":{"line":7,"column":13},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"1"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":26}},{"begin":{"line":12,"column":13},"end":{"line":12,"column":16}},{"begin":{"line":13,"column":17},"end":{"line":13,"column":26}}],"childrenIndices":[7],"parentIndex":1,"link":{"begin":{"line":7,"column":9},"end":{"line":7,"column":13},"filepath":"BreakContinueTest.java"},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"1"},{"ranges":[{"begin":{"line":14,"column":17},"end":{"line":14,"column":23}},{"begin":{"line":15,"column":17},"end":{"line":15,"column":22}}],"childrenIndices":[],"parentIndex":6,"outLinks":[],"outIndex":0,"traceId":"3"},{"ranges":[{"begin":{"line":31,"column":17},"end":{"line":31,"column":22}}],"childrenIndices":[],"parentIndex":1,"outLinks":[],"outIndex":0,"traceId":"7"}]'));
        setJsonManager(new JsonManager('[{"ranges":[],"childrenIndices":[1],"outLinks":[],"outIndex":0,"traceId":"root"},{"ranges":[{"begin":{"line":6,"column":5},"end":{"line":6,"column":12}},{"begin":{"line":6,"column":15},"end":{"line":6,"column":17}},{"begin":{"line":15,"column":9},"end":{"line":15,"column":26}}],"childrenIndices":[2,4,7,11,16,22,29,37,46,56,67,71,75],"parentIndex":0,"link":{"filepath":"ThrowTest.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[],"outIndex":0,"traceId":"8"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[3],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[],"parentIndex":2,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":2,"traceId":"6"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[5],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[6],"parentIndex":4,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":4,"traceId":"6"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":5,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"7"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[8],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[9,10],"parentIndex":7,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":7,"traceId":"6"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":8,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":8,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"7"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[12],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[13,14,15],"parentIndex":11,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":11,"traceId":"6"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":12,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":12,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":12,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"7"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[17],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":5,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[18,19,20,21],"parentIndex":16,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":16,"traceId":"6"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":17,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":17,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":17,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":17,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"7"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[23],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":6,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[24,25,26,27,28],"parentIndex":22,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":22,"traceId":"6"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":23,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":23,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":23,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":23,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":23,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":5,"traceId":"7"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[30],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":7,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[31,32,33,34,35,36],"parentIndex":29,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":29,"traceId":"6"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":30,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":30,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":30,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":30,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":30,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":5,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":30,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":6,"traceId":"7"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[38],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":8,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[39,40,41,42,43,44,45],"parentIndex":37,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":37,"traceId":"6"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":38,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":38,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":38,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":38,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":38,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":5,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":38,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":6,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":38,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":7,"traceId":"7"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[47],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":9,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[48,49,50,51,52,53,54,55],"parentIndex":46,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":46,"traceId":"6"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":47,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":47,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":47,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":47,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":47,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":5,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":47,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":6,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":47,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":7,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":47,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":8,"traceId":"7"},{"ranges":[{"begin":{"line":7,"column":1},"end":{"line":7,"column":18}},{"begin":{"line":6,"column":20},"end":{"line":6,"column":22}}],"childrenIndices":[57],"parentIndex":1,"link":{"begin":{"line":6,"column":1},"end":{"line":6,"column":3}},"outLinks":[],"outIndex":0,"iteration":10,"traceId":"9"},{"ranges":[{"begin":{"line":22,"column":7},"end":{"line":22,"column":16}},{"begin":{"line":23,"column":12},"end":{"line":23,"column":15}}],"childrenIndices":[58,59,60,61,62,63,64,65,66],"parentIndex":56,"link":{"filepath":"ThrowTest2.java","begin":{"line":7,"column":12},"end":{"line":7,"column":14}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":21,"column":24},"end":{"line":21,"column":26}}],"outIndex":56,"traceId":"6"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":57,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":1,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":57,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":2,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":57,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":3,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":57,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":4,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":57,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":5,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":57,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":6,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":57,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":7,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":57,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":8,"traceId":"7"},{"ranges":[{"begin":{"line":24,"column":9},"end":{"line":24,"column":12}},{"begin":{"line":23,"column":18},"end":{"line":23,"column":20}}],"childrenIndices":[],"parentIndex":57,"link":{"begin":{"line":23,"column":7},"end":{"line":23,"column":9}},"outLinks":[],"outIndex":0,"iteration":9,"traceId":"7"},{"ranges":[{"begin":{"line":5,"column":9},"end":{"line":5,"column":22}},{"begin":{"line":17,"column":9},"end":{"line":17,"column":15}},{"begin":{"line":18,"column":9},"end":{"line":18,"column":15}}],"childrenIndices":[68,70],"parentIndex":1,"link":{"filepath":"ThrowTest2.java","begin":{"line":15,"column":20},"end":{"line":15,"column":22}},"outLinks":[{"filepath":"ThrowTest2.java","begin":{"line":18,"column":9},"end":{"line":18,"column":15}},{"filepath":"ThrowTest.java","begin":{"line":3,"column":24},"end":{"line":3,"column":26}}],"outIndex":1,"traceId":"0"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":22}}],"childrenIndices":[69],"parentIndex":67,"outLinks":[],"outIndex":0,"traceId":"1"},{"ranges":[{"begin":{"line":9,"column":17},"end":{"line":9,"column":54}}],"childrenIndices":[],"parentIndex":68,"outLinks":[{"filepath":"ThrowTest2.java","begin":{"line":9,"column":17},"end":{"line":9,"column":22}}],"outIndex":70,"traceId":"3"},{"ranges":[],"childrenIndices":[],"parentIndex":67,"outLinks":[],"outIndex":0,"traceId":"2"},{"ranges":[{"begin":{"line":17,"column":12},"end":{"line":17,"column":29}}],"childrenIndices":[72],"parentIndex":1,"outLinks":[],"outIndex":0,"traceId":"10"},{"ranges":[{"begin":{"line":5,"column":9},"end":{"line":5,"column":22}}],"childrenIndices":[73],"parentIndex":71,"link":{"filepath":"ThrowTest2.java","begin":{"line":17,"column":23},"end":{"line":17,"column":25}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":3,"column":24},"end":{"line":3,"column":26}}],"outIndex":71,"traceId":"0"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":22}}],"childrenIndices":[74],"parentIndex":72,"outLinks":[],"outIndex":0,"traceId":"1"},{"ranges":[{"begin":{"line":11,"column":17},"end":{"line":11,"column":53}}],"childrenIndices":[],"parentIndex":73,"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":11,"column":17},"end":{"line":11,"column":22}}],"outIndex":75,"traceId":"4"},{"ranges":[{"begin":{"line":19,"column":13},"end":{"line":19,"column":30}}],"childrenIndices":[76],"parentIndex":1,"outLinks":[],"outIndex":0,"traceId":"11"},{"ranges":[{"begin":{"line":5,"column":9},"end":{"line":5,"column":22}}],"childrenIndices":[77],"parentIndex":75,"link":{"filepath":"ThrowTest2.java","begin":{"line":19,"column":24},"end":{"line":19,"column":26}},"outLinks":[{"filepath":"ThrowTest.java","begin":{"line":3,"column":24},"end":{"line":3,"column":26}}],"outIndex":75,"traceId":"0"},{"ranges":[{"begin":{"line":8,"column":17},"end":{"line":8,"column":22}}],"childrenIndices":[78],"parentIndex":76,"outLinks":[],"outIndex":0,"traceId":"1"},{"ranges":[{"begin":{"line":13,"column":17},"end":{"line":13,"column":50}}],"childrenIndices":[],"parentIndex":77,"outLinks":[],"outIndex":0,"traceId":"5"}]'));

        }


    return <>
    <LeftComponent setDisplayedFile={setDisplayedFile} setDisplayedToActive={setDisplayedToActive} passOnUploadedFiles={passOnUploadedFiles}/>
    <RightComponent displayedFile={displayedFile} setActiveAndDisplayed={setActiveAndDisplayed} isActiveDisplayed={isActiveDisplayed} jsonManager={jsonManager}/>
    </>
}
export default ContainerRightLeft;
