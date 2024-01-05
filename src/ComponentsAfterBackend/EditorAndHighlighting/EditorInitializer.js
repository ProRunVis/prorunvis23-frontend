import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import jsonDaten from './test.json';

class EditorInitializer {

  static getLineDecoration(editor, lineIndex) {
    const decorations = editor.getModel().getLineDecorations(lineIndex + 1);
    for (const dec of decorations) {
      if (dec.range.startLineNumber === lineIndex + 1) {
        if (dec.options.className.includes('solid-line-decoration')) {
          return 'green';
        } else if (dec.options.className.includes('dotted-line-decoration')) {
          return 'red';
        }
      }
    }
    return null;
  }

  static addCommentsToCode(editor, javaFileContent, jsonData) {
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
  static initializeEditor(containerRef, javaFileContent, highlightedLines, setEditor) {
    
    if (typeof javaFileContent !== 'string') {
      console.error('javaFileContent must be a string');
      return;
    }
    
    if (!containerRef.current) {
      return;
    }
    const editor = monaco.editor.create(containerRef.current, {
      value: [javaFileContent].join('\n'),
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

    monaco.editor.defineTheme('java-theme', {
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

    monaco.languages.register({ id: 'java' });

    monaco.languages.setMonarchTokensProvider('java', {
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
    javaFileContent = this.addCommentsToCode(editor, javaFileContent, jsonDaten);
  editor.getModel().setValue(javaFileContent); // Aktualisiere den Inhalt des Editors

    this.addDecorationsBasedOnJsonData(editor, jsonDaten);

    this.adjustEditorHeight(editor);

    editor.onDidChangeModelContent(() => {
      this.adjustEditorHeight(editor);
    });


    
    monaco.editor.setTheme('vs-dark');
    setEditor(editor);
    return editor;
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
    if (!Array.isArray(jsonData)) {
      console.error('jsonData is not an array:', jsonData);
      return;
    }
  
    // Entferne alle vorherigen Dekorationen
    let oldDecorations = editor.getModel().getAllDecorations().map(dec => dec.id);
    editor.deltaDecorations(oldDecorations, []);
  
    // Sortiere die Daten nach dem Start des Bereichs und bei Gleichheit nach dem Ende des Bereichs absteigend
    const sortedData = jsonData.sort((a, b) => a.begin - b.begin || b.end - a.end);
  
    // Erstelle eine Map zur Überwachung der Überlappungen
    let overlapMap = new Map();
  
    // Gehe jedes Element in jsonData durch
    sortedData.forEach(item => {
      for (let i = item.begin; i <= item.end; i++) {
        if (overlapMap.has(i)) {
          // Wenn bereits eine Dekoration für die Zeile existiert, setze auf 'red'
          overlapMap.set(i, 'red');
        } else {
          // Andernfalls setze die Dekoration basierend auf was_taken
          overlapMap.set(i, item.was_taken ? 'green' : 'red');
        }
      }
    });
  
    // Erzeuge die tatsächlichen Dekorationen basierend auf der Map
    let decorations = Array.from(overlapMap.entries()).map(([line, color]) => {
      return {
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: color === 'red' ? 'false-background-decoration' : 'true-background-decoration',
          linesDecorationsClassName: color === 'red' ? 'dotted-line-decoration' : 'solid-line-decoration'
        }
      };
    });
  
    // Aktualisiere alle Dekorationen auf einmal
    editor.deltaDecorations([], decorations);
  }
  
  static range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
  }
  }
  
  export default EditorInitializer;