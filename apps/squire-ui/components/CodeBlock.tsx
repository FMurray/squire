import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useState } from 'react'
import { save } from '@tauri-apps/api/dialog'
import { writeTextFile } from '@tauri-apps/api/fs'
import { writeText, readText } from '@tauri-apps/api/clipboard';
import { Toast } from 'react-daisyui'

type Props = {
  node: any 
  inline: boolean
  className: string
  children: React.ReactNode
  style: React.CSSProperties | null
}

export function CodeBlock({ node, inline, className, children, style }: Props ) {
  const match = /language-(\w+)/.exec(className || '')
  const [isHovering, setIsHovering] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault();
    const filePath = await save()
    console.log(filePath)
    await writeTextFile({ path: filePath, contents: children?.toString() || "" })
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 500)
  }

  const handleCopy=async()=>{
    await writeText(children?.toString() || "")
  }

  return (
    <div className='relative'
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <SyntaxHighlighter
        node={node}
        className={className}
        children={String(children).replace(/\n$/, '')}
        style={oneDark}
        language={!!match ? match[1] : ""}
        PreTag="div"
      
      />
    {isHovering && 
    <div className='absolute top-0 right-0'>
    <button className=' rounded-md btn-primary btn' onClick={(e)=>handleSave(e)}>Save</button> 
    <button className='rounded-md btn-primary btn' onClick={()=>handleCopy()}> Copy </button>
    </div>  
    }
    </div>
  )
}