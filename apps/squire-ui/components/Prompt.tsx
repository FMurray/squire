import { useEffect, useRef, useState } from 'react'
import { Generation } from '@squire-ui/lib/models'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import remarkGfm from 'remark-gfm'
import { v4 as uuidv4 } from 'uuid';

import { CodeBlock } from "@squire-ui/components/CodeBlock"

const promptTypes = {
  "agent": {
    endpoint: "generate/agent",
    displayType: "list"
  },
  "chat": {
    endpoint: "generate/chat",
    displayType: "text"
  },
}

export function Prompt({ client }: any) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const baseUrl = "http://localhost:8000/"

    const [content, setContent] = useState<string>()
    const [generation, setGeneration] = useState<Generation>()
    const [endpoint, setEndpoint] = useState<string>("")
    const [logs, setLogs] = useState<any[]>([])
    const [streamingText, setStreamingText] = useState<string>('')
    const [id, setId] = useState<string>(uuidv4())
    const [promptType, setPromptType] = useState<string>("agent")

    useEffect(() => {
        if (!id || !client) return
        console.log(client)
        const subscription = client
            .channel('any')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'generations', filter: `id=eq.${id}` }, (payload: any) => {
                setLogs(payload.new.logs)
            })
            .subscribe()

        return () => {
            console.log("I was unsubscribed!")
            subscription.unsubscribe()
        }
    }, [client, id])


    const generate = async () => {
        const payload = { "feature_description": content, "run_id": id}
        console.log(payload)

        if (endpoint.indexOf("agent") > -1) {
          const response = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
          const data:any = response.json()
          setGeneration(data)
          setId(data)
              // .then(response => response.json())
              // .then(data => {
              //     console.log(data)
              //     setGeneration(data)
              //     setId(data.id)
              // })
        } else {
            setStreamingText("")
            const response = await fetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

            while (reader && true) {
              const {value, done} = await reader.read();
              if (done) break;
              console.log('Received', value);
              setStreamingText((prev) => prev + value )
            }

            console.log('Response fully received');
        }
    }


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            generate();
        }
    }

    const stopGeneration = () => {
        fetch(`http://localhost:8000/generate/stop/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
    }

    const handlePromptSelect = (e:any) => {
        const type = e.target.value
        const url =  baseUrl + promptTypes[type as keyof typeof promptTypes].endpoint
        setEndpoint(url)
        setPromptType(type)
    }

    return (
        <>
          <select onChange={handlePromptSelect} className="select w-full max-w-xs">
            <option disabled selected>Prompt Type:</option>
              { Object.keys(promptTypes).map((type) => (
                  <option>{ type }</option>
              )) }
          </select>


            { promptType === "chat" ? (
             <ReactMarkdown
              children={streamingText}
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
             

              ) : (
                  <ul>
                    {logs}
                </ul>)
            }

            <textarea className='rounded-md  mt-2 p-2 ' cols={80}
                ref={textareaRef}
                placeholder={
                    'Type a message or type "/" to select a prompt...'
                }
                // onCompositionStart={() => setIsTyping(true)}
                // onCompositionEnd={() => setIsTyping(false)}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
            />


            <button onClick={stopGeneration} className="btn btn-primary">Stop Generation</button>
        </>
    )
}