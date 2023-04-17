import { useEffect, useState } from 'react'
import { supabase } from '@squire-ui/lib/supabaseClient'

export default function Prompts() {
    const client = supabase
    const [generations, setGenerations] = useState<any[]>([])

    useEffect(() => {
      const getGenerations = async () => {
        const { data, error } = await supabase.from('generations').select('*'); 
        if (!error) {
            setGenerations(data)
        }
      }
    }, [client])
    


    return (
        <div>
            <h1>Welcome to Prompts!</h1>
        </div>
    );
}