"use client"

import Editor from "@/components/Edit"
import Page from "@/components/Page"
import { PAGE_HEIGHT_PX, PAGE_MARGIN_PX, PAGE_WIDTH_PX } from "@/lib/constants"
import { paginateContent } from "@/lib/pagination"
import { useRef, useState } from "react"

const CONTENT_WIDTH_PX = PAGE_WIDTH_PX - PAGE_MARGIN_PX * 2

export default function Home() {
  const [pages, setPages] = useState<string[]>([])
  const hiddenRef = useRef<HTMLDivElement>(null)

  const handleUpdate = (html: string) => {
    if (!hiddenRef.current) return

    // Wrap in the same class you render in Page preview
    hiddenRef.current.innerHTML = `<div class="ProseMirror">${html}</div>`

    const pageHeight = PAGE_HEIGHT_PX - PAGE_MARGIN_PX * 2
    const root = hiddenRef.current.firstElementChild as HTMLElement

    const paginated = paginateContent(root, pageHeight)
    setPages(paginated.map((p) => p.innerHTML))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-slate-900">Document Pagination Editor</h1>
          <p className="text-sm text-slate-600 mt-1">
            Write your document and see how it will appear across pages (A4 with 1-inch margins)
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Editor Section */}
          <div className="flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Editor</h2>
              <p className="text-sm text-slate-600">Edit your document with rich formatting</p>
            </div>
            <div className="flex-1 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <Editor onUpdate={handleUpdate} />
            </div>
          </div>

          {/* Pages Preview Section */}
          <div className="flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Page Preview</h2>
              <p className="text-sm text-slate-600">
                {pages.length} {pages.length === 1 ? "page" : "pages"}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {pages.length === 0 ? (
                <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                  <p className="text-slate-500 text-center">Start typing to see page preview</p>
                </div>
              ) : (
                pages.map((content, i) => (
                  <div key={i}>
                    <div className="text-xs font-semibold text-slate-600 mb-2">Page {i + 1}</div>
                    <Page>
                      <div
                        className="ProseMirror"
                        dangerouslySetInnerHTML={{
                          __html: content,
                        }}
                      />
                    </Page>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Hidden measurement container - used for calculating pagination */}
      <div
        ref={hiddenRef}
        className="fixed invisible left-[-10000px] top-0"
        style={{ width: `${CONTENT_WIDTH_PX}px` }}
      />
    </div>
  )
}
