export default class JSONReader {
  constructor(editor) {
    this.editor = editor;
  }

  addDecorations(jsonData) {
    const decorations = jsonData.map((loop) => {
      // Verwenden Sie 'loop' anstelle von 'item', um die richtige Variable zu referenzieren
      const className = loop.was_taken
        ? "solid-line-decoration"
        : "dotted-line-decoration";
      return {
        range: new monaco.Range(loop.begin, 1, loop.end, 1),
        options: {
          isWholeLine: true,
          className: className, // Verwenden Sie die Variable 'className' anstelle eines Strings
          glyphMarginClassName: "glyph-margin-style",
        },
      };
    });
    this.currentDecorations = this.editor.deltaDecorations(
      this.currentDecorations || [],
      decorations
    );
  }

  getDecorationClassName(range) {
    const decorations = this.editor
      .getModel()
      .getLineDecorations(range.startLineNumber);
    for (const dec of decorations) {
      if (
        dec.range.startLineNumber === range.startLineNumber &&
        dec.range.endLineNumber === range.endLineNumber
      ) {
        // Return the class name of the first decoration that matches the range
        return dec.options.className;
      }
    }
    return null; // Return 'null' if no decoration is found
  }
}
