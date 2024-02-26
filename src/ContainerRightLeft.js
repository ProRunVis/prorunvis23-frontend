import LeftComponent from "./NavbarUpload-Left/LeftComponent";
import RightComponent from "./Editor-Right/RightComponent";
import {useState} from "react";

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
