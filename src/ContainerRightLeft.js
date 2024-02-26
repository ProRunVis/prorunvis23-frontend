import LeftComponent from "./NavbarUpload-Left/LeftComponent";
import RightComponent from "./Editor-Right/RightComponent";
import {useState} from "react";

function ContainerRightLeft(){
    const [currentFile, setCurrentFile] = useState();

    function getCurrentFile(file){
        setCurrentFile(file);
        //console.log(currentFile);
    }

    return <>
    <LeftComponent getFile={getCurrentFile}/>
    <RightComponent setFile={currentFile} getFile={getCurrentFile} />
    </>
}
export default ContainerRightLeft;
