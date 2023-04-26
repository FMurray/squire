import { useEffect, useRef, useState } from 'react'
import { Generation } from '../models/Generation'
import { Button } from 'react-daisyui'

export function Prompt({ client }: any) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const [content, setContent] = useState<string>()
    const [generation, setGeneration] = useState<Generation>()
    const [logs, setLogs] = useState<any[]>([])
    const [testLogs, setTestLogs] = useState<any[]>([])
    const [id, setId] = useState<string>()

    useEffect(() => {
        if (!id || !client) return

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


    const generate = () => {
        const payload = { "feature_description": content}
        console.log(payload)

        fetch('http://localhost:8000/generate', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setGeneration(data)
                setId(data.id)
            })

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

    return (
        <>
            <ul>
                {logs}
            </ul>

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

            <Button onClick={stopGeneration}>Stop Generation, Man</Button>
        </>
    )
}