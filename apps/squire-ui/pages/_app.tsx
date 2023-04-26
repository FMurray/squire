import '@squire-ui/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'

import { SessionContextProvider } from '@supabase/auth-helpers-react'

import Layout from '@squire-ui/components/Layout'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >  
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionContextProvider>
    )
}
