/**
 * Retrieves the instance of the editor if it has been initialized.
 * This function checks if the editor parameter is not null or undefined,
 * indicating that the editor has been successfully initialized. If the editor
 * is not initialized, it logs an error message to the console and returns null.
 * This function is useful for validating the existence of an editor instance
 * before attempting to perform operations on it.
 *
 * @param editor The editor instance to be retrieved.
 * @return The editor instance if it is initialized, or null if it is not.
 */

function getEditorInstance(editor) {
  if (!editor) {
    console.error('Editor is not initialized');
    return null;
  }
  return editor;
}
