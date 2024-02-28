import React, { useEffect, useRef, useState, useMemo } from "react";
import LeftComponent from "./Left-NavbarUpload/LeftComponent";
import RightComponent from "./Right-Editor/RightComponent";
import JsonManager from "./Right-Editor/JsonManager";

function ContainerRightLeft(){
    const [currentFile, setCurrentFile] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [dummy, setDummy] = useState(new JsonManager());
    const [uploadedFiles, setUploadedFiles] = useState([]);

    function jump(path){
        for(let i=0;i<uploadedFiles.length ;i++){
            if(path == uploadedFiles[i].webkitRelativePath){
                setCurrentFile(uploadedFiles[i]);
                setActiveFile(uploadedFiles[i]);
            }
        }
    }

    function setCurrentToActive(){
        setCurrentFile(activeFile);
    }

    function activeSelected(){
        if(activeFile == null || currentFile == null)
            return false;
        return activeFile === currentFile;
    }

    function passOnUploadedFiles(files){
        setUploadedFiles(files);
    }

    return <>
    <LeftComponent onFileClick={setCurrentFile} reset={setCurrentToActive} passOnUploadedFiles={passOnUploadedFiles}/>
    <RightComponent fileInEditor={currentFile} setFile={jump} activeSelected={activeSelected}/>
    </>
}
export default ContainerRightLeft;
