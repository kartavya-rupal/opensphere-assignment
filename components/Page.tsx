import type React from "react"
import { PAGE_HEIGHT_PX, PAGE_MARGIN_PX, PAGE_WIDTH_PX } from "@/lib/constants"

export default function Page({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="bg-white rounded-lg shadow-md border border-gray-200 mx-auto mb-6 box-border overflow-hidden"
            style={{
                height: PAGE_HEIGHT_PX,
                padding: PAGE_MARGIN_PX,
                width: PAGE_WIDTH_PX,
            }}
        >
            {children}
        </div>
    )
}


