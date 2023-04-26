import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import remarkGfm from 'remark-gfm'
import { CodeBlock } from "./CodeBlock"
import { useMemo, useState } from "react"

export function ChatDisplay({ content }: any) {

  const parseContent = (content: string) => {
    try {
      let parsed = JSON.parse(content)
      return parsed
    } catch(e) {
      console.error(e)
    }
  }

  const [ _content, setContent] = useState<string>("")

  useMemo(() => {
    setContent(parseContent(content))
  }, [content])

  return (
    <div className="max-h-96 max-w-prose overflow-scroll">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, style, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return (
              <CodeBlock node={node} inline={inline || false} children={children} style={style || null} className={className || ""}/>
            )
          }
        }}
      />
    </div>
  )
}