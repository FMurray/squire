import { Generation } from '@/packages/squire-ui/src/models/Generation'
import { useEffect, useState } from 'react'

export function useCreateGeneration(feature_description: string) {
    const [generation, setGeneration] = useState<Generation | null>(null)


    useEffect(function createGeneration() {
        if (!feature_description) return
        
        // make a post request with the feature description

        fetch('http://localhost:8000/generate', {
            method: 'POST',
            body: JSON.stringify({"feature_description": feature_description }), 
            
        })
            .then(response => response.json())
            .then(data => {
                setGeneration(data)
            })

    }, [])

}