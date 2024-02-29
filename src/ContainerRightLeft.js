import React, { useEffect, useRef, useState, useMemo } from "react";
import LeftComponent from "./Left-NavbarUpload/LeftComponent";
import RightComponent from "./Right-Editor/RightComponent";
import JsonManager from "./Right-Editor/JsonManager";
import TraceNode from "./Right-Editor/TraceNode";
import SourceRange from "./Right-Editor/SourceRange";
import * as moanco from "monaco-editor";

function ContainerRightLeft(){
    const [currentFile, setCurrentFile] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [dummy, setDummy] = useState();
    const [uploadedFiles, setUploadedFiles] = useState([]);

    function jump(path){
        for(let i=0;i<uploadedFiles.length ;i++){
            console.log(uploadedFiles[i].webkitRelativePath);
            if(path === uploadedFiles[i].webkitRelativePath){
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
        setDummy(new JsonManager(new TraceNode("main",[(new SourceRange(new moanco.Range(1,1,3,4), "AMain/AMain.java")), (new SourceRange(new moanco.Range(5,5,2,2)))], [], null, null, null, null, null)));
    }

    return <>
    <LeftComponent onFileClick={setCurrentFile} reset={setCurrentToActive} passOnUploadedFiles={passOnUploadedFiles}/>
    <RightComponent fileInEditor={currentFile} setFile={jump} activeSelected={activeSelected} jsonManager={dummy}/>
    </>
}
export default ContainerRightLeft;
