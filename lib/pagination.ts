function findDomPointAtTextOffset(root: HTMLElement, charOffset: number) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let remaining = charOffset

    let n: Node | null = walker.nextNode()
    while (n) {
        const text = n as Text
        const len = text.data.length
        if (remaining <= len) return { node: text, offset: remaining }
        remaining -= len
        n = walker.nextNode()
    }

    // Fallback to end
    return { node: root, offset: root.childNodes.length }
}

function cloneElementSliceByText(root: HTMLElement, start: number, end: number) {
    const total = root.textContent?.length ?? 0
    const safeStart = Math.max(0, Math.min(start, total))
    const safeEnd = Math.max(0, Math.min(end, total))

    const wrapper = root.cloneNode(false) as HTMLElement
    if (safeEnd <= safeStart) return wrapper

    const range = document.createRange()

    if (safeStart === 0) {
        range.setStart(root, 0)
    } else {
        const a = findDomPointAtTextOffset(root, safeStart)
        range.setStart(a.node, a.offset)
    }

    if (safeEnd === total) {
        range.setEnd(root, root.childNodes.length)
    } else {
        const b = findDomPointAtTextOffset(root, safeEnd)
        range.setEnd(b.node, b.offset)
    }

    wrapper.appendChild(range.cloneContents())
    return wrapper
}

function splitBlockToFit(
    block: HTMLElement,
    measure: HTMLElement,
    maxHeight: number,
) {
    const text = block.textContent ?? ""
    const total = text.length
    if (total === 0) return { head: block.cloneNode(true) as HTMLElement, tail: null as HTMLElement | null }

    let lo = 1
    let hi = total
    let best = 0

    while (lo <= hi) {
        const mid = (lo + hi) >> 1
        const headCandidate = cloneElementSliceByText(block, 0, mid)

        measure.appendChild(headCandidate)
        const ok = measure.scrollHeight <= maxHeight
        measure.removeChild(headCandidate)

        if (ok) {
            best = mid
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }

    // Ensure progress even with a single giant word
    if (best === 0) best = 1

    const head = cloneElementSliceByText(block, 0, best)
    const tail = cloneElementSliceByText(block, best, total)

    // If tail is effectively empty, return null
    const tailText = (tail.textContent ?? "").trim()
    return { head, tail: tailText ? tail : null }
}

export function paginateContent(root: HTMLElement, pageHeight: number) {
    const pages: HTMLElement[] = []

    // Offscreen measuring page for accurate "does it fit?" checks
    const measure = document.createElement("div")
    measure.className = root.className || "ProseMirror"
    measure.style.position = "fixed"
    measure.style.visibility = "hidden"
    measure.style.left = "-10000px"
    measure.style.top = "0"
    measure.style.width = `${root.getBoundingClientRect().width}px`
    document.body.appendChild(measure)

    let page = document.createElement("div")
    page.className = measure.className

    const commitPage = () => {
        pages.push(page)
        page = document.createElement("div")
        page.className = measure.className
        measure.innerHTML = ""
    }

    const tryAppend = (el: HTMLElement) => {
        measure.appendChild(el)
        const ok = measure.scrollHeight <= pageHeight
        if (!ok) measure.removeChild(el)
        return ok
    }

    const blocks = Array.from(root.children) as HTMLElement[]

    for (const block of blocks) {
        const clone = block.cloneNode(true) as HTMLElement

        // Fits on current page
        if (tryAppend(clone)) {
            page.appendChild(clone)
            continue
        }

        // Start a new page if current has content
        if (page.childNodes.length) commitPage()

        // Fits on empty page
        const clone2 = block.cloneNode(true) as HTMLElement
        if (tryAppend(clone2)) {
            page.appendChild(clone2)
            continue
        }

        // Too big even for an empty page -> split inside this block
        let remainder: HTMLElement | null = block
        while (remainder) {
            const { head, tail } = splitBlockToFit(remainder, measure, pageHeight)

            // head must fit now (by construction)
            tryAppend(head)
            page.appendChild(head)

            if (tail) {
                commitPage()
                remainder = tail
            } else {
                remainder = null
            }
        }
    }

    if (page.childNodes.length) pages.push(page)
    document.body.removeChild(measure)
    return pages
}
