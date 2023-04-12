import { useEffect, useRef, useState } from 'react'
import { Generation } from '@/models/Generation'
import { supabase } from '@/lib/supabaseClient'

export function Prompt () {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const [content, setContent] = useState<string>()
    const [generation, setGeneration] = useState<Generation>()
    const [logs, setLogs] = useState<any[]>([])
    const [ id, setId ] = useState<string>()

    useEffect(() => {
        if (!id) return

        console.log("id", id)

        const subscription = supabase
            .channel('any')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'generations', filter: `id=eq.${id}`}, (payload: any) => {
                setLogs(payload.new.logs)
            })
            .subscribe()

        return () => {
            console.log("I was unsubscribed!")
            subscription.unsubscribe()
        }
    }, [supabase, id])


    const generate = () => {
        const payload = { "feature_description": content, "id": id }
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
        if (e.key === 'Enter') {
            e.preventDefault()
            generate();
        } else if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
    }

    return (
        <>
            <ul>
                { logs }
            </ul>
            <textarea
                ref={textareaRef}
                className="m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-10 text-black dark:bg-transparent dark:text-white md:py-3 md:pl-10"
                style={{
                resize: 'none',
                bottom: `${textareaRef?.current?.scrollHeight}px`,
                maxHeight: '400px',
                overflow: `${
                    textareaRef.current && textareaRef.current.scrollHeight > 400
                    ? 'auto'
                    : 'hidden'
                }`,
                }}
                placeholder={
                'Type a message or type "/" to select a prompt...'
                }
                value={content}
                // rows={1}
                // onCompositionStart={() => setIsTyping(true)}
                // onCompositionEnd={() => setIsTyping(false)}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {/* <Script id="show-banner" strategy="afterInteractive">
                `console.log(hey)`
            </Script> */}
        </>
    )
}