import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export class EditorInitializer {

    static initializeEditor(containerRef, javaFileContent, hints) {
        if (typeof javaFileContent !== 'string') {
            console.error('javaFileContent must be a string');
            return;
        }
        if (!containerRef.current) {
            return;
        }

        monaco.editor.defineTheme('java-theme-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                {token: 'keyword', foreground: '569CD6', fontStyle: 'bold'},
                {token: 'number', foreground: 'B5CEA8'},
                {token: 'type', foreground: '4EC9B0'},
                {token: 'string', foreground: 'CE9178'},
                {token: 'comment', foreground: '6A9955'},
                {token: 'annotation', foreground: 'B8860B'},
                {token: 'operator', foreground: 'D4D4D4'},
                {token: 'delimiter', foreground: 'D4D4D4'},
                {token: 'namespace', foreground: '4EC9B0'},
                {token: 'custom-system-out', foreground: 'FFA500'},
                {token: 'custom-wrapper-class', foreground: 'FF4500'},
                {token: 'custom-exception-class', foreground: 'FF0000'},
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

        monaco.editor.defineTheme('java-theme-light', {
            base: 'vs',
            inherit: true,
            rules: [
                {token: 'keyword', foreground: '4A0082', fontStyle: 'bold'},
                {token: 'number', foreground: '065E40'},
                {token: 'type', foreground: '1A5C6E'},
                {token: 'string', foreground: '8B1010'},
                {token: 'comment', foreground: '3E7030'},
                {token: 'annotation', foreground: '8B6508'},
                {token: 'operator', foreground: '333333'},
                {token: 'delimiter', foreground: '333333'},
                {token: 'namespace', foreground: '1A5C6E'},
                {token: 'custom-system-out', foreground: 'B86E00'},
                {token: 'custom-wrapper-class', foreground: 'C03000'},
                {token: 'custom-exception-class', foreground: 'B00000'},
            ],
            colors: {
                'editor.foreground': '#1E1E1E',
                'editor.background': '#FFFFFF',
                'editorCursor.foreground': '#333333',
                'editor.lineHighlightBackground': '#F0F0F0',
                'editorLineNumber.foreground': '#999999',
                'editor.selectionBackground': '#ADD6FF',
                'editor.inactiveSelectionBackground': '#E5EBF1',
            }
        });

        const editor = monaco.editor.create(containerRef.current, {
            value: javaFileContent,
            language: 'java',
            theme: 'java-theme-dark',
            glyphMargin: true,
            scrollBeyondLastLine: false,
            minimap: {enabled: false},
            wordWrap: 'off',
            readOnly: true,
            automaticLayout: true,
            scrollbar: {
                alwaysConsumeMouseWheel: true
            },
        });

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
                    [/\/\*/, {token: 'comment', next: '@comment'}],
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

        const {dispose} = monaco.languages.registerInlayHintsProvider("java", {
            provideInlayHints(model, range, token) {
                let newHints = [];
                hints.forEach((hint) => {
                    newHints.push({
                        kind: monaco.languages.InlayHintKind.Parameter,
                        position: {column: hint.position.column, lineNumber: hint.position.lineNumber},
                        label: hint.content,
                    });
                });
                return {
                    hints: newHints,
                    dispose: () => {
                    },
                };
            },
        });

        window.MonacoEnvironment = {
            getWorkerUrl: function (moduleId, label) {
                return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
                baseUrl: ''
            };

            self.onmessage = function (e) {
            };
        `)}`;
            }
        };

        monaco.languages.register({id: 'java'});

        editor.getModel().setValue(javaFileContent);

        const currentTheme = document.documentElement.getAttribute('data-theme');
        monaco.editor.setTheme(currentTheme === 'light' ? 'java-theme-light' : 'java-theme-dark');

        return {editor, dispose};
    }
}

export default EditorInitializer;
