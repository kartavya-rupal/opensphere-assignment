"use client"

import type { Editor } from "@tiptap/react"
import { Bold, Italic, Heading1, List } from "lucide-react"

export default function Toolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null

    const getButtonClass = (active: boolean) => {
        const baseClass = "flex items-center gap-2 px-3 py-2 rounded-md border transition-colors text-sm font-medium"
        const activeClass = "bg-slate-900 text-white border-slate-900"
        const inactiveClass = "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
        return `${baseClass} ${active ? activeClass : inactiveClass}`
    }

    return (
        <div className="flex gap-2 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex-wrap">
            {/* Bold Button */}
            <button
                className={getButtonClass(editor.isActive("bold"))}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold (Ctrl+B)"
            >
                <Bold size={16} />
                <span>Bold</span>
            </button>

            {/* Italic Button */}
            <button
                className={getButtonClass(editor.isActive("italic"))}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic (Ctrl+I)"
            >
                <Italic size={16} />
                <span>Italic</span>
            </button>

            {/* Heading 1 Button */}
            <button
                className={getButtonClass(editor.isActive("heading", { level: 1 }))}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Heading 1"
            >
                <Heading1 size={16} />
                <span>H1</span>
            </button>

            {/* Bullet List Button */}
            <button
                className={getButtonClass(editor.isActive("bulletList"))}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet List"
            >
                <List size={16} />
                <span>List</span>
            </button>
        </div>
    )
}
