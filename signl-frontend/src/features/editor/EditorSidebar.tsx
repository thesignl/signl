'use client'

interface EditorSidebarProps {
article: any
}

export default function EditorSidebar({
article,
}: EditorSidebarProps) {
return ( <div className="editor-sidebar">

```
  <div className="editor-card">
    <h3>Metadata</h3>

    <p>
      <strong>Title:</strong>
      {' '}
      {article.title}
    </p>

    <p>
      <strong>Status:</strong>
      {' '}
      {article.status}
    </p>

    <p>
      <strong>Type:</strong>
      {' '}
      {article.articleType}
    </p>
  </div>

</div>


)
}
