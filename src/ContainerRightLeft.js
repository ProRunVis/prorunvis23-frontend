import React, { useEffect, useRef, useState, useMemo } from "react";
import LeftComponent from "./Left-NavbarUpload/LeftComponent";
import RightComponent from "./Right-Editor/RightComponent";

function ContainerRightLeft(){
    const [currentFile, setCurrentFile] = useState();
    const [activeFile, setActiveFile] = useState();

    function jump(file){
        setCurrentFile(file);
        setActiveFile(file);
    }

    function setCurrentToActive(){
        setCurrentFile(activeFile);
    }

    return <>
    <LeftComponent onFileClick={setCurrentFile} reset={setCurrentToActive}/>
    <RightComponent fileInEditor={currentFile} setFile={jump}/>
    </>
}
export default ContainerRightLeft;
