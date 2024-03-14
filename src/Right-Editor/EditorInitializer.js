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
     * @param hints list of InlayHints(monaco editor) to display in the editor.
     * @return The initialized Monaco Editor instance, or undefined if initialization fails.
     */
    static initializeEditor(containerRef, javaFileContent, hints) {
        if (typeof javaFileContent !== 'string') {
            console.error('javaFileContent must be a string');
            return;
        }
        if (!containerRef.current) {
            return;
        }
        const editor = monaco.editor.create(containerRef.current, {  // Creates a new editor
            value: javaFileContent,
            language: 'java',
            theme: 'java-theme',
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

        // ----------------------------------Syntax Highlighting ------------------------------------


        monaco.editor.defineTheme('java-theme', {  // Style Properties of the editor
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

        monaco.languages.setMonarchTokensProvider('java', {   // Syntax highlighting
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

        // ----------------------------------Loop Indices ------------------------------------
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

        monaco.languages.register({id: 'java'});   // Activates the syntax highlighting

        // -------------------------------------  All other function calls for the editor  ----------------------------

        // Update the content
        editor.getModel().setValue(javaFileContent);

        // Set dark theme
        monaco.editor.setTheme('vs-dark');
        return {editor, dispose};
    }
}

export default EditorInitializer;