'use client'

interface EditorHeaderProps {
article: {
title: string
status: string
}
}

export default function EditorHeader({
article,
}: EditorHeaderProps) {
return ( 
<header className="editor-header"> <div> <h1 className="text-2xl font-bold">
{article.title} </h1>

```
    <p className="text-sm opacity-70">
      Status: {article.status}
    </p>
  </div>
  <div className="editor-actions">

        <button>
          Preview
        </button>

        <button>
          Save Draft
        </button>

      </div>
</header>

)
}
