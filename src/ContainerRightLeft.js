import React, { useEffect, useRef, useState, useMemo } from "react";
import LeftComponent from "./Left-NavbarUpload/LeftComponent";
import RightComponent from "./Right-Editor/RightComponent";

/**
 * Overarching container for the Left and Right component
 * @returns {Element} Left and Right component
 * @constructor
 */
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
