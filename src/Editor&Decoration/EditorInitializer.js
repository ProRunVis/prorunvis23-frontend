import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';



/**
 * Initializes the Monaco Editor with specific settings for editing Java files.
 * This class provides static methods to configure the editor, including setting
 * up the theme, syntax highlighting, and adjusting the editor's height based on its content.
 * It also demonstrates how to use Monaco Editor's API to create a more interactive
 * and user-friendly code editor environment.
 */
export class EditorInitializer {

  /**
   * Initializes the Monaco Editor in the provided container with the given Java file content.
   * This method sets up the editor with predefined options such as language, theme, and various
   * editor behaviors like word wrapping and automatic layout adjustments. It also defines a custom
   * theme and syntax highlighting rules specifically tailored for Java code.
   *
   * @param containerRef A reference to the container DOM element where the editor will be instantiated.
   * @param javaFileContent The initial Java code content to be loaded into the editor.
   * @return The initialized Monaco Editor instance, or undefined if initialization fails.
   */
  static initializeEditor(containerRef, javaFileContent) {
    if (typeof javaFileContent !== 'string') {
      console.error('javaFileContent must be a string');
      return;
    }
    if (!containerRef.current) {
      return;
    }
    const editor = monaco.editor.create(containerRef.current, {  //erstellt einen neuen Editor
      value: javaFileContent,
      language: 'java',
      theme: 'java-theme',
      glyphMargin: true,
      scrollBeyondLastLine: true,
      minimap: { enabled: false },
      wordWrap: 'off',
      automaticLayout: true,
      scrollbar: {
        alwaysConsumeMouseWheel: true
      },
    });

    // ----------------------------------Syntax Highlighting ------------------------------------


    monaco.editor.defineTheme('java-theme', {  // Stil Eigenschaften des Editors
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'comment', foreground: '6A9955' },
        { token: 'annotation', foreground: 'B8860B' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'delimiter', foreground: 'D4D4D4' },
        { token: 'namespace', foreground: '4EC9B0' },
        { token: 'custom-system-out', foreground: 'FFA500' },
        { token: 'custom-wrapper-class', foreground: 'FF4500' },
        { token: 'custom-exception-class', foreground: 'FF0000' },
      ],
      colors: {
        'editor.foreground': '#D4D4D4',
        'editor.background': '#1E1E1E',
        'editorCursor.foreground': '#A7A7A7',
        'editor.lineHighlightBackground': '#2D2D30',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
      }
    });

    monaco.languages.setMonarchTokensProvider('java', {   // Syntax Highlighting
      tokenizer: {
        root: [
          [/\b(Integer|Double|Float|Long|Short|Byte|Boolean|Character|String)\b/, 'custom-wrapper-class'],
          [/\b(Exception|RuntimeException|Error|Throwable|IOException|NullPointerException|ArrayIndexOutOfBoundsException|ClassCastException|NumberFormatException)\b/, 'custom-exception-class'],
          [/\bSystem\.out\.[a-zA-Z]+\b/, 'custom-system-out'],
          [/public|private|protected/, 'keyword'],
          [/\b(class|interface|enum|extends|implements|volatile|synchronized|abstract|final|static|void|boolean|byte|char|short|int|float|long|double)\b/, 'keyword'],
          [/\b(package|import)\b/, 'keyword'],
          [/\b(return|if|else|while|for|break|continue|do|switch|case|default)\b/, 'keyword'],
          [/\b(try|catch|finally|throw|throws)\b/, 'keyword'],
          [/\b(new|this|super)\b/, 'keyword'],
          [/\b(instanceof)\b/, 'keyword'],
          [/\b(true|false|null)\b/, 'literal'],
          [/\b(System\.out\.println)\b/, 'custom-function'],
          [/\b([A-Za-z_]\w*)\b/, 'identifier'],
          [/"([^"\\]|\\.)*"/, 'string'],
          [/'([^'\\]|\\.)*'/, 'string'],
          [/\b\d+\.?\d*\b/, 'number'],
          [/\/\/.*$/, 'comment'],
          [/\/\*/, { token: 'comment', next: '@comment' }],
          [/[[\](){}<>]/, 'delimiter'],
          [/[;,.]/, 'delimiter'],
          [/[+\-*/=<>!&|~^%]/, 'operator']
        ],
        comment: [
          [/[^/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[/*]/, 'comment']
        ],
      }
    });

    monaco.languages.register({ id: 'java' });   // meldet das Syntax Hightling an

    // -------------------------------------  Aufruf aller weiteren Methoden für den Editor ----------------------------

    // Aktualisiere den Inhalt des Editors
    editor.getModel().setValue(javaFileContent);

    // Striche und Punkte vor der Zeilennummer schreiben
    // Diese Methode soll aber nur ausgelöst werden, wenn eine bestimmte Sache geklickt wird
    //this.addDecorationsBasedOnJsonData(editor, jsonDaten);
      
    //Anpassung Editorhöhe
    //this.adjustEditorHeight(editor);

    // Event-Listener, wenn sich Editor ändert für die Höhe
   // editor.onDidChangeModelContent(() => {
    //  this.adjustEditorHeight(editor);
    //});

    // setzt Dark Theme  für den Editor
    monaco.editor.setTheme('vs-dark');

    // markiert ifStmt im Editor mit grünem Hintergrund. funktioniert noch nicht
    //this.markUnvisitedStatements(editor, jsonDaten);

    return editor
  }




   /**
   * Adjusts the height of the Monaco Editor's container based on the content's line count.
   * This method calculates the total height required to display all lines without scrolling
   * and updates the editor's container height accordingly. It ensures that the editor
   * fully displays its content up to a maximum height, beyond which scrolling is enabled.
   *
   * @param editor The Monaco Editor instance whose height needs to be adjusted.
   */
  /*static adjustEditorHeight(editor) {
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const lineCount = editor.getModel().getLineCount();
    const height = lineHeight * (lineCount + 2);
    const editorDomNode = editor.getDomNode();
    if (editorDomNode) {
      editorDomNode.style.height = `${height}px`;
      editor.layout();
    }
  }*/





























  // --------------------------------------    has to be fixed or new evaluated --------------------------


  // currently not in use
  /*static addCommentsToCode(editor, javaFileContent, jsonData) {
    let lines = javaFileContent.split('\n');
    jsonData.sort((a, b) => a.begin - b.begin);
  
    jsonData.forEach(item => {
      if (item.Type === 'if' || item.Type === 'else') {
        let lineIndex = item.begin - 1;
        let lineDecoration = this.getLineDecoration(editor, lineIndex);
        let lineContent = lines[lineIndex].replace(/[\r\n]+$/, '');
        let comment;
  
        if (item.was_taken && lineDecoration === 'green') {
          comment = " // result: true and path was taken";
        } else if (!item.was_taken && lineDecoration === 'red') {
          comment = " // result: false and path was not taken";
        } else if (item.was_taken && lineDecoration === 'red') {
          comment = " // result: true, but path was not taken";
        }
  
        if (comment) {
          lines[lineIndex] = lineContent + '  ' + comment;
        }
      }
    });
  
    return lines.join('\n');
  }
  */

  // currently not in use
  /*
  static range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
  }
  */

  // currently not in use
  /*
  static markUnvisitedStatements(editor, jsonData) {
    let decorations = [];
    jsonData.forEach(item => {
      if (item.codeType === 'IfStmt' && item.was_visited) {
        for (let line = item.start; line <= item.end; line++) {
          decorations.push({
            range: new monaco.Range(line, 1, line, 1),
            options: {
              isWholeLine: true,
              className: 'green-background-decoration'
            }
          });
        }
      }
    });
  
    // Aktualisiere alle Dekorationen auf einmal
    editor.deltaDecorations([], decorations);
  }
  */
}
export default EditorInitializer;