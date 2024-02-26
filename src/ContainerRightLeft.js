import React, { useEffect, useRef, useState, useMemo } from "react";
import LeftComponent from "./Left-NavbarUpload/LeftComponent";
import RightComponent from "./Right-Editor/RightComponent";

function ContainerRightLeft(){
    const [currentFile, setCurrentFile] = useState();

    function getActiveFile(file){
        setCurrentFile(file);
    }

    return <>
    <LeftComponent getActiveFile={getActiveFile}/>
    <RightComponent fileInEditor={currentFile}/>
    </>
}
export default ContainerRightLeft;
