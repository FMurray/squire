import React from 'react'

const SomerandomComponent = () => {
    return (
        <div className='flex justify-center mt-3 w-fit bg-black'>
            <textarea className='rounded-md p-2' cols={30} rows={10} defaultValue={'Some Default Text'} />
        </div>
    )
}

export default SomerandomComponent