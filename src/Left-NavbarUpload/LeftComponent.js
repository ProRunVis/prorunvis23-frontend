/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import "../Css/LeftComponent.css"
import RightComponent from "../Right-Editor/RightComponent";
import PropTypes from "prop-types";

/**
 * Represents the left component of the application, which is primarily responsible for
 * displaying a folder tree of Java files. This component allows users to select a directory,
 * filters out Java files, and displays these files in a structured folder tree view.
 * Users can collapse or expand the left container to show or hide the folder tree.
 */
function LeftComponent({onFileClick}, {reset}) {
  // State for the list of files uploaded by the user.
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // State for the structured data used by FolderTree to display the directory and files.
  const [folderTreeData, setFolderTreeData] = useState(null);
  // State to manage the collapsed or expanded state of the left container.
  const [isLeftContainerCollapsed, setIsLeftContainerCollapsed] = useState(false);

  /**
   * Handles the upload of files, filters for Java files, and constructs the folder tree data.
   * @param {Event} event - The file input change event.
   */
  const handleFileUpload = (event) => {
    const filteredFiles = Array.from(event.target.files).filter(file =>
      file.webkitRelativePath.endsWith('.java')
    );
    setUploadedFiles(filteredFiles);
    if (filteredFiles.length > 0) {
      const directoryName = filteredFiles[0].webkitRelativePath.split('/')[0];
      const treeData = buildFolderTree(filteredFiles, directoryName);
      setFolderTreeData(treeData);
    }
  };

  /**
   * Builds the folder tree structure from the list of selected files.
   * @param {Array} fileList - The list of filtered files.
   * @param {string} directoryName - The name of the root directory.
   * @return {Object} The root object of the folder tree structure.
   */
  const buildFolderTree = (fileList, directoryName) => {
    const root = { name: directoryName, isOpen: true, children: [] };
    let i = 0;
    fileList.forEach(file => {
      const splitPath = file.webkitRelativePath.split('/');
      let currentLevel = root;

      splitPath.forEach((part, index) => {
        if (index > 0) {
          const nodeName = part.replace('.java', ''); // Remove .java extension
          let existingNode = currentLevel.children.find(child => child.name === nodeName);
          
          const isDirectory = index < splitPath.length - 1; // Determine if it's a directory
          if(!isDirectory && !existingNode){
            existingNode = {
              name: nodeName,
              realPath: file.webkitRelativePath,
              index: i,
              children: isDirectory ? [] : undefined // Add children only for directories
            };
            i++;
            currentLevel.children.push(existingNode);
          }
          else if (!existingNode) {
            existingNode = {
              name: nodeName,
              children: isDirectory ? [] : undefined // Add children only for directories
            };
            currentLevel.children.push(existingNode);
          }
          currentLevel = existingNode; // Descend into the directory
        }
      });
    });
    console.log(root);
    return root;
  };

  /**
   * Toggles the collapsed state of the left container.
   */
  const toggleLeftContainer = () => {
    setIsLeftContainerCollapsed(!isLeftContainerCollapsed);
  };

// custom event handler for node name click
  const onNameClick = ({ nodeData }) => {
    const {
      // internal data
      path, name, checked, isOpen, realPath, index
    }
        = nodeData;
    if (realPath != null){
      onFileClick(uploadedFiles[index]);
    }
  };

  return (
      <main className={`left-container ${isLeftContainerCollapsed ? 'collapsed' : ''}`} style={{width: isLeftContainerCollapsed ? '50px' : '280px'}}>
        <button onClick={toggleLeftContainer}>{isLeftContainerCollapsed ? 'Open' : 'Close directory'}</button>
        {isLeftContainerCollapsed ? null : (
            <div>
              <button onClick={reset}>{'Jump to active function'} </button>
              <div className="upload-button-container">
                <form className="text-box" encType="multipart/form-data">
                  <input
                      type="file"
                      name="file"
                      multiple
                      webkitdirectory=""
                      onChange={handleFileUpload}
                      className="picker"
                  />
                </form>
              </div>

              {folderTreeData && (
                  <div className="folder-tree-container">
                    <FolderTree
                        data={folderTreeData}
                        onNameClick={onNameClick}
                        showCheckbox={false}
                        readOnly={true}
                        indentPixels={10}
                    />
                  </div>
              )}
            </div>
        )}
      </main>
  );
}

LeftComponent.propTypes = {
  getActiveFile: PropTypes.instanceOf(Function),
  reset: PropTypes.instanceOf(Function)
};
export default LeftComponent;
