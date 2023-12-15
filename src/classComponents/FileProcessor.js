export class JavaFileOpener {
    static async openJavaFiles() {
      const javaFiles = [];
      try {
        const dirHandle = await window.showDirectoryPicker(); // Hier wird das Verzeichnis ausgewählt
        const entries = await JavaFileOpener.listAllFilesAndDirs(dirHandle);
        for (const entry of entries) {
          if (entry.kind === 'file' && entry.name.endsWith('.java')) {
            const file = await entry.handle.getFile();
            const content = await file.text();
            javaFiles.push({ name: entry.name, content });
          }
        }
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
  