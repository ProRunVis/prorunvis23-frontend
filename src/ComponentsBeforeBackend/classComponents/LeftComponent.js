import React, { useState } from 'react';
import './LeftContainer.css'; // Import der CSS-Datei speziell für LeftComponent
import FolderTree from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';

function LeftComponent() {
  const [files, setFiles] = useState([]);
  const [folderTreeData, setFolderTreeData] = useState(null);

  const handleFileSelect = (event) => {
    const filteredFiles = Array.from(event.target.files).filter(file =>
      file.webkitRelativePath.endsWith('.java')
    );
    setFiles(filteredFiles);
    const treeData = buildFolderTree(filteredFiles);
    setFolderTreeData(treeData);
  };

  const buildFolderTree = (fileList) => {
    const root = { name: 'root', isOpen: false, children: [] };

    fileList.forEach(file => {
      const splitPath = file.webkitRelativePath.split('/');
      let currentLevel = root; // Start at the root

      splitPath.forEach((part, index) => {
        if (index === splitPath.length - 1) {
          // It's a file
          currentLevel.children.push({ name: part });
        } else {
          // It's a directory
          let existingDir = currentLevel.children.find(child => child.name === part);
          if (!existingDir) {
            existingDir = { name: part, children: [] };
            currentLevel.children.push(existingDir);
          }
          currentLevel = existingDir; // Descend into the directory
        }
      });
    });

    return root;
  };

  return (
    <main className="left-container">
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
    </main>
  );
}

export default LeftComponent;
