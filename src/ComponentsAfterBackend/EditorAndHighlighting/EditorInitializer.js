import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import jsonDaten from './test.json';

class EditorInitializer {
  static initializeEditor(containerRef, javaFileContent, highlightedLines, setEditor) {
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
    if (Array.isArray(jsonData)) {
      const addDecorations = (editorInstance, data, className) => {
        const decorations = data.map(item => {
          return {
            range: new monaco.Range(item.begin, 1, item.end, 1),
            options: {
              isWholeLine: false,
              linesDecorationsClassName: className
            }
          };
        });
        editorInstance.deltaDecorations([], decorations);
      };
      addDecorations(editor, jsonData.filter(loop => loop.Type === 'for'), 'for-loop-decoration');
      addDecorations(editor, jsonData.filter(loop => loop.Type === 'if'), 'if-statement-decoration');
      addDecorations(editor, jsonData.filter(loop => loop.Type === 'while'), 'while-loop-decoration');
      addDecorations(editor, jsonData.filter(loop => loop.Type === 'else'), 'else-statement-decoration');
    } else {
      console.error('jsonDaten is not an array:', jsonData);
    }
  }
}

export default EditorInitializer;