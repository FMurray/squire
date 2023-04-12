import { supabase } from '../lib/supabaseClient' 
import { useEffect, useState} from 'react'
import { Generation } from '@/models/Generation'

export function useLatestGenerationMessage(id: string ) {
    const client = supabase
    const [generationMessages, setGenerationMessages] = useState<Generation[]>([])

    useEffect(function subscribe() {
        console.log(id)
        if (!id) return
    
        // TODO: SECURITY - Enable row security for all tables and configure access to deployments.
        const insertSub = client.channel('any')
          .on('postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'generations',
              filter: `id=eq.${id}`,
            }, payload => {
                console.log(payload)
              if (payload.new.id === id) {
                setGenerationMessages( (old: Generation[]) => [...old, payload.new ])
              }
            })
          .subscribe()
    
        // TODO: SECURITY - Enable row security for all tables and configure access to deployments.
        const updateSub = client
            .channel('schema-db-changes')
            .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
            },
            (payload) => console.log(payload)
            )
            .subscribe()
        
        return () => {
          insertSub.unsubscribe()
          updateSub.unsubscribe()
        }
      }, [
        client,
        id
      ])

    return generationMessages
}