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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      {/* <div className="alert shadow-lg">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h3 className="font-bold">New message!</h3>
            <div className="text-xs">You have 1 unread message</div>
          </div>
        </div>
        <div className="flex-none">
          <button className="btn btn-sm">See</button>
        </div>
      </div> */}
      
      <Prompt client={client}></Prompt>
      
    </main>
  )
}
