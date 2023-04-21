import '@squire-ui/styles/globals.css'
import type { AppProps } from 'next/app'
import { useCallback, useMemo, useState } from 'react'

import { SessionContextProvider } from '@supabase/auth-helpers-react'

import { TabsContext } from '@squire-ui/lib/context/tabContext'
import Layout from '@squire-ui/components/Layout'
import { UITabType } from '@squire-ui/lib/types'
import { getJsonFromStorage, SEARCH_HISTORY_KEY } from '@squire-ui/lib/services'
import { generateUniqueId } from '@squire-ui/lib/utils'
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
