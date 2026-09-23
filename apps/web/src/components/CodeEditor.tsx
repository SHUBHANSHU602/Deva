import Editor, { type BeforeMount } from "@monaco-editor/react";

const configureTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("deva-night", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "63758d", fontStyle: "italic" },
      { token: "keyword", foreground: "72d4ff" },
      { token: "string", foreground: "b8e986" },
      { token: "number", foreground: "f7be68" },
    ],
    colors: {
      "editor.background": "#07111f",
      "editor.foreground": "#d7e3f4",
      "editorLineNumber.foreground": "#42536b",
      "editorLineNumber.activeForeground": "#8ba1bd",
      "editor.selectionBackground": "#163b5f",
      "editor.inactiveSelectionBackground": "#102a44",
      "editorCursor.foreground": "#5bd6ff",
      "editorIndentGuide.background1": "#15263a",
      "editorIndentGuide.activeBackground1": "#2a4664",
    },
  });
};

export function CodeEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Editor
      beforeMount={configureTheme}
      height="100%"
      language="cpp"
      theme="deva-night"
      value={value}
      onChange={(next) => onChange(next || "")}
      options={{
        fontSize: 14,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        tabSize: 4,
        insertSpaces: true,
        wordWrap: "off",
        renderLineHighlight: "gutter",
        bracketPairColorization: { enabled: true },
      }}
    />
  );
}
