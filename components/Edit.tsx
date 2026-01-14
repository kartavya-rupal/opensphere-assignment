"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import { extensions } from "@/lib/editorExtensions"
import Toolbar from "./Toolbar"

export default function Editor({
    onUpdate,
}: {
    onUpdate: (html: string) => void
}) {
    const editor = useEditor({
        extensions,
        content: "<p>Start typing your document here...</p>",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML())
        },
    })

    if (!editor) return null

    return (
        <div className="flex flex-col h-full">
            <Toolbar editor={editor} />
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 bg-white">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    )
}
