'use client'

export default function EditorLayout({
  left,
  center,
  right
}: {
  left: React.ReactNode
  center: React.ReactNode
  right: React.ReactNode
}) {
  return (
    <div className="editor-layout">

      <aside className="editor-sidebar">
        {left}
      </aside>

      <main className="editor-main">
        {center}
      </main>

      <aside className="editor-right">
        {right}
      </aside>

    </div>
  )
}