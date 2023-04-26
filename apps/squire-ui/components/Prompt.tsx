import { useContext, useEffect, useRef, useState } from 'react'

import { GenerationsContext, TabsContext } from '@squire-ui/lib/context';
import { ChatDisplay } from './ChatDisplay';

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
    const [endpoint, setEndpoint] = useState<string>("")
    const [logs, setLogs] = useState<any[]>([])
    const [streamingText, setStreamingText] = useState<string>('')
    const { activeGeneration } = useContext(GenerationsContext)
    const [ _promptType, setPromptType] = useState<string>(activeGeneration?.prompt_type || "chat")

    useEffect(() => {
        if (!activeGeneration || !client) return

        const subscription = client
            .channel('any')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'generations', filter: `id=eq.${activeGeneration.id}` }, (payload: any) => {
                setLogs(payload.new.logs)
            })
            .subscribe()

        return () => {
            console.log("I was unsubscribed!")
            subscription.unsubscribe()
        }
    }, [client, activeGeneration])
    
    // useEffect(() => {
    //     // get memory from Motorhead
    //     if (!activeGeneration) return

    //     const getMemory = async () => {
    //         console.log(baseUrl + `chat/memory/${activeGeneration.id}`)
    //         const response = await fetch(baseUrl + `generate/memory/${activeGeneration.id}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         const data:any = await response.json()

    //         if (data) {
    //             setStreamingText(data)
    //         }
    //     }

    //     getMemory()

    // }, [activeGeneration, endpoint])

    const generate = async () => {
        const payload = { "feature_description": content, "run_id": activeGeneration?.id}
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
        //   setId(data)
              // .then(response => response.json())
              // .then(data => {
              //     console.log(data)
              //     setGeneration(data)
              //     setId(data.id)
              // })
        } else {
            setStreamingText("")
            console.log(activeGeneration)
            const response = await fetch("http://localhost:8000/generate/chat", {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response)
            const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

            while (reader && true) {
                const {value, done} = await reader.read();
                if (done) break;
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
        fetch(`http://localhost:8000/generate/stop/${activeTab}`, {
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
            <h1> {activeGeneration?.id} </h1>
            { _promptType === "chat" ? (
                <ChatDisplay content={streamingText}></ChatDisplay>
              ) : (
                  <ul>
                    {logs}
                </ul>)
            }
            
            <div>
                <textarea className='rounded-md  mt-2 p-2 ' cols={85}
                    ref={textareaRef}
                    placeholder={
                        'Type a message or type "/" to select a prompt...'
                    }
                    // onCompositionStart={() => setIsTyping(true)}
                    // onCompositionEnd={() => setIsTyping(false)}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <div className="flex justify-between"> 
                    <select onChange={handlePromptSelect} value={_promptType} className="select flex-1 w-64 max-w-md">
                        <option disabled selected>Prompt Type:</option>
                        { Object.keys(promptTypes).map((type) => (
                            <option>{ type }</option>
                        )) }
                    </select>


                    <button onClick={stopGeneration} className="btn btn-primary w-32">Stop Generation</button>
                </div>

            </div>

        </>
    )
}