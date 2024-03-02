import React, { useEffect, useRef, useState, useMemo } from "react";
import LeftComponent from "./Left-NavbarUpload/LeftComponent";
import RightComponent from "./Right-Editor/RightComponent";
import JsonManager from "./Right-Editor/JsonManager";

function ContainerRightLeft(){
    const [displayedFile, setDisplayedFile] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [jsonManager, setJsonManager] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    function jump(path){
        for(let i=0;i<uploadedFiles.length ;i++){
            console.log(uploadedFiles[i].webkitRelativePath);
            if(path === uploadedFiles[i].webkitRelativePath){
                setDisplayedFile(uploadedFiles[i]);
                setActiveFile(uploadedFiles[i]);
            }
        }
    }

    function setDisplayedToActive(){
        setDisplayedFile(activeFile);
    }

    function isActiveDisplayed(){
        if(activeFile == null || displayedFile == null)
            return false;
        return activeFile === displayedFile;
    }

    function passOnUploadedFiles(files){
        //if(files !== undefined) {
            setUploadedFiles(files);
            setJsonManager(new JsonManager(
                '[{"ranges":[],"childrenIndices":[1],"outLinks":[],"outIndex":0,"traceId":"root"},{"ranges":[{"begin":{"line":4,"column":9},"end":{"line":4,"column":18}},{"begin":{"line":5,"column":13},"end":{"line":5,"column":17}}],"childrenIndices":[2],"parentIndex":0,"link":{"begin":{"line":0,"column":0},"end":{"line":0,"column":0},"file":"AMain/AMain.java"},"outLinks":[],"outIndex":0,"traceId":"4"},{"ranges":[{"begin":{"line":8,"column":13},"end":{"line":8,"column":22}}],"childrenIndices":[3],"parentIndex":1,"outLinks":[],"outIndex":0,"traceId":"6"},{"ranges":[{"begin":{"line":4,"column":9},"end":{"line":4,"column":18}},{"begin":{"line":5,"column":13},"end":{"line":5,"column":17}}],"childrenIndices":[],"parentIndex":2,"link":{"begin":{"line":8,"column":17},"end":{"line":8,"column":19},"file":"AMain/Bar.java"},"outLinks":[{"begin":{"line":3,"column":24},"end":{"line":3,"column":26}}],"outIndex":2,"traceId":"0"}]'));
        //}
        }

    return <>
    <LeftComponent onFileClick={setDisplayedFile} reset={setDisplayedToActive} passOnUploadedFiles={passOnUploadedFiles}/>
    <RightComponent fileInEditor={displayedFile} setFile={jump} isActiveDisplayed={isActiveDisplayed} jsonManager={jsonManager}/>
    </>
}
export default ContainerRightLeft;
