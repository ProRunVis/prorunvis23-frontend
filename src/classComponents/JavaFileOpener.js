export class JavaFileOpener {
  static async openJavaFiles() {
    const javaFiles = [];
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.style.display = 'none';
      fileInput.setAttribute('webkitdirectory', 'webkitdirectory'); // Wichtig: Verzeichnis auswählen erzwingen
      document.body.appendChild(fileInput);
      fileInput.click();

      fileInput.addEventListener('change', async (event) => {
        const directoryFiles = event.target.files;
        if (!directoryFiles || directoryFiles.length === 0) {
          console.error('Kein Verzeichnis ausgewählt.');
          return;
        }

        const directoryFile = directoryFiles[0];

        const entries = await JavaFileOpener.listAllFilesAndDirs(directoryFile);
        for (const entry of entries) {
          if (entry.kind === 'file' && entry.name.endsWith('.java')) {
            const file = entry.handle;
            const content = await file.text();
            javaFiles.push({ name: entry.name, content });
          }
        }

        document.body.removeChild(fileInput);
      });
    } catch (error) {
      console.error('Fehler beim Öffnen des Verzeichnisses:', error);
    }
    return javaFiles;
  }

  static async listAllFilesAndDirs(dirHandle) {
    const files = [];
    for await (const [name, handle] of dirHandle.entries()) {
      const { kind } = handle;
      files.push({ name, handle, kind });
      if (kind === 'directory') {
        const subdirFiles = await JavaFileOpener.listAllFilesAndDirs(handle);
        files.push(...subdirFiles);
      }
    }
    return files;
  }
}
