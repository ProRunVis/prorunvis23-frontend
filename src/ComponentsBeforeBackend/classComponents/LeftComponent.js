import React, { useState } from 'react';
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
import '../App.css';

function LeftComponent() {
  const [files, setFiles] = useState([]);
  const [folderTreeData, setFolderTreeData] = useState(null);
  // Zustand für das Kollabieren des left-container
  const [isLeftContainerCollapsed, setIsLeftContainerCollapsed] = useState(false);

  const handleFileSelect = (event) => {
    const filteredFiles = Array.from(event.target.files).filter(file =>
      file.webkitRelativePath.endsWith('.java')
    );
    setFiles(filteredFiles);
    if (filteredFiles.length > 0) {
      const directoryName = filteredFiles[0].webkitRelativePath.split('/')[0];
      const treeData = buildFolderTree(filteredFiles, directoryName);
      setFolderTreeData(treeData);
    }
  };

  const buildFolderTree = (fileList, directoryName) => {
    const root = { name: directoryName, isOpen: true, children: [] };

    fileList.forEach(file => {
      const splitPath = file.webkitRelativePath.split('/');
      let currentLevel = root;

      splitPath.forEach((part, index) => {
        if (index > 0) {
          const nodeName = part.replace('.java', ''); // Entferne .java
          let existingNode = currentLevel.children.find(child => child.name === nodeName);
          
          const isDirectory = index < splitPath.length - 1; // Definiere, ob es sich um ein Verzeichnis handelt
          if (!existingNode) {
            existingNode = {
              name: nodeName,
              children: isDirectory ? [] : undefined // Füge Kinder nur für Verzeichnisse hinzu
            };
            currentLevel.children.push(existingNode);
          }
          currentLevel = existingNode; // Absteigen in das Verzeichnis
        }
      });
    });

    return root;
  };

  // Toggle-Funktion für den linken Container
  const toggleLeftContainer = () => {
    setIsLeftContainerCollapsed(!isLeftContainerCollapsed);
  };

  return (
    <main className={`left-container ${isLeftContainerCollapsed ? 'collapsed' : ''}`} style={{width: isLeftContainerCollapsed ? '50px' : '280px'}}>
      <button onClick={toggleLeftContainer}>{isLeftContainerCollapsed ? 'Open' : 'Close'}</button>
      {isLeftContainerCollapsed ? null : (
        <div>
          <div className="button-container">
            <form className="text-box" encType="multipart/form-data">
              <input
                type="file"
                name="file"
                multiple
                webkitdirectory=""
                onChange={handleFileSelect}
                className="picker"
              />
            </form>
          </div>
          {folderTreeData && (
            <FolderTree
              data={folderTreeData}
              showCheckbox={false}
              readOnly={true}
            />
          )}
        </div>
      )}
    </main>
  );
}

export default LeftComponent;
