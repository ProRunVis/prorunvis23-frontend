import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export default class JSONReader {
  constructor(editor) {
    this.editor = editor;
  }

  addDecorations(jsonData) {
    const decorations = jsonData.map(loop => {
      return {
        range: new monaco.Range(loop.begin, 1, loop.end, 1),
        options: {
          isWholeLine: true,
          className: 'loop-decoration',
          glyphMarginClassName: 'glyph-margin-style'
        }
      };
    });
    this.currentDecorations = this.editor.deltaDecorations(this.currentDecorations || [], decorations);
  }
}

