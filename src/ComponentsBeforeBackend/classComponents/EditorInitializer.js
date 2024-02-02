import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import jsonDaten from './test2.json';



class EditorInitializer {

  static initializeEditor(containerRef, javaFileContent, highlightedLines, setEditor) {
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
      lineNumbers: lineNumber => highlightedLines.has(lineNumber) ? `<span style="color: red">${lineNumber}</span>` : `${lineNumber}`,
      glyphMargin: true,
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      wordWrap: 'off',
      automaticLayout: true,
      scrollbar: {
        alwaysConsumeMouseWheel: false
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
this.addDecorationsBasedOnJsonData(editor, jsonDaten);

//Anpassung Editorhöhe
this.adjustEditorHeight(editor);

// Event-Listener, wenn sich Editor ändert für die Höhe
editor.onDidChangeModelContent(() => {
this.adjustEditorHeight(editor);
});

// setzt Dark Theme  für den Editor
monaco.editor.setTheme('vs-dark');

// markiert ifStmt im Editor mit grünem Hintergrund. funktioniert noch nicht
//this.markUnvisitedStatements(editor, jsonDaten);

return editor
}

static adjustEditorHeight(editor) {
const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
const lineCount = editor.getModel().getLineCount();
const height = lineHeight * (lineCount + 2);
const editorDomNode = editor.getDomNode();
if (editorDomNode) {
editorDomNode.style.height = `${height}px`;
editor.layout();
}
}


static addDecorationsBasedOnJsonData(editor, jsonData) {
 // this.markUnvisitedStatements(editor, jsonData);
  // Ermittle die abgedeckten Zeilen
  const coveredLines = this.getCoveredLines(jsonData);

  // Erzeuge Dekorationen für die abgedeckten und nicht abgedeckten Zeilen
  let decorations = [];
  const lineCount = editor.getModel().getLineCount();

  for (let line = 1; line <= lineCount; line++) {
    let colorClass = coveredLines.has(line) ? 'solid-green-line-decoration' : 'solid-red-line-decoration';
    
    decorations.push({
      range: new monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        linesDecorationsClassName: colorClass
      }
    });
  }

  // Aktualisiere alle Dekorationen auf einmal
  editor.deltaDecorations([], decorations);
}



static getLineDecoration(editor, lineIndex) {
  let prevDecoration = null;
  const decorations = editor.getModel().getLineDecorations(lineIndex + 1);
  for (let i = 0; i < decorations.length; i++) {
    const dec = decorations[i];
    // Prüfe ob eine vernestung vorliegt
    if (prevDecoration &&
        dec.range.startLineNumber > prevDecoration.range.startLineNumber &&
        dec.range.endLineNumber < prevDecoration.range.endLineNumber) {
      // Prüfe,ob davor rot war
      if (prevDecoration.options.linesDecorationsClassName.includes('solid-red-line-decoration')) {
        // wenn beides zutrifft -> rot
        return 'red';
      }
    }
    // Hier speichern wir das aktuelle und verwenden es als previous
    prevDecoration = dec;
  }
  
  for (const dec of decorations) {
    if (dec.range.startLineNumber === lineIndex + 1) {
      if (dec.options.linesDecorationsClassName.includes('solid-green-line-decoration')) {
        return 'green';
      } else if (dec.options.linesDecorationsClassName.includes('solid-red-line-decoration')) {
        return 'red';
      }
    }
  }
  return null;
  }

  // Definieren Sie die getCoveredLines Methode ebenfalls als statische Methode
static getCoveredLines(jsonData) {
  let coveredLines = new Set();
  
  jsonData.forEach(item => {
    // Gehe durch jede Zeile von 'start' bis 'end' in jedem JSON-Element
    for (let line = item.start; line <= item.end; line++) {
      coveredLines.add(line);
    }
  });
  
  return coveredLines;
  }
 
 

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