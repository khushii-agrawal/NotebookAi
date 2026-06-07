import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (content: string) => void;
};

const NotesEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[250px] text-gray-300",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external value (important)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border border-white/5 rounded-xl p-4 bg-[#0a0a1a]/60">
      {/* Toolbar */}
      <div className="flex gap-2 mb-4 flex-wrap border-b border-white/5 pb-3">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
            editor.isActive("bold")
              ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
              : "border-white/8 bg-white/5 text-gray-400 hover:bg-white/8 hover:text-gray-200"
          }`}
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
            editor.isActive("italic")
              ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
              : "border-white/8 bg-white/5 text-gray-400 hover:bg-white/8 hover:text-gray-200"
          }`}
        >
          Italic
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
            editor.isActive("bulletList")
              ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
              : "border-white/8 bg-white/5 text-gray-400 hover:bg-white/8 hover:text-gray-200"
          }`}
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
            editor.isActive("highlight")
              ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-300"
              : "border-white/8 bg-white/5 text-gray-400 hover:bg-white/8 hover:text-gray-200"
          }`}
        >
          Highlight
        </button>
      </div>

      <div className="px-1 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default NotesEditor;
