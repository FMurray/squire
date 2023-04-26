import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'

import { invoke } from '@tauri-apps/api/tauri'
import { open } from '@tauri-apps/api/dialog'

import { supabase } from '@squire-ui/lib/supabaseClient'

import { Prompt } from "@squire-ui/components/Prompt"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const client = supabase;

    const handleOpenDialog = async () => {
        const selectedPath = await open({
            'directory': true
        })
        console.log(selectedPath)
    }

    useEffect(() => {
      invoke('plugin:awesome|do_something')
    }, [])

  return (
    <main className="flex max-h-screen flex-col items-center justify-between p-24">
      <Prompt client={client}></Prompt>      
    </main>
  )
}
