import React from 'react'

type Props = {
    thought: string
}

const ThoughtBubble = (thought: string) => {

    return (
        <div className='flex flex-col items-center justify-center border-2 p-2 rounded-lg bg-gray-400 text-black'>
            <p>{thought}</p>
        </div>
    )

}
export default ThoughtBubble