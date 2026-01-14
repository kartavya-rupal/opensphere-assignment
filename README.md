This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel



# Document Pagination Editor

A Tiptap-based rich text editor that shows **real-time page breaks**, allowing users to see exactly how their document will appear when printed.

---

## Features

- Rich text editor using **Tiptap**
- Real-time visual pagination
- Fixed page size with **1-inch margins**
- Automatic page creation and reflow while typing
- Supports headings, paragraphs, bold/italic text, and bullet lists
- Client-side only (no backend)

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tiptap
- Tailwind CSS

---

## Setup

```bash
npm install
npm run dev
```

## Pagination Approach

Pagination is implemented using DOM measurement:

Editor content is rendered into a hidden container

Each block element (paragraphs, headings, lists) is measured by its rendered height

Blocks are added to a page until the usable page height is exceeded

Pagination recalculates on every editor update, enabling live reflow

This ensures page breaks match real print output.

---

## Trade-offs & Limitations

Pagination operates at block level

Very long single paragraphs are not split mid-paragraph and may occupy a full page

This is an intentional trade-off for simplicity and performance



---
