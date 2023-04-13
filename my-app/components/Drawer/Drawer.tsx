import React, { useState, useEffect } from 'react'
import { Button } from 'react-daisyui'
import { drawerItems } from './DrawerItems'


export default function DrawerSideBar() {

    const [Items, setItems] = useState<any>()

    useEffect(() => {
        setItems(drawerItems)
    }, [drawerItems])

    const toggleVisibleTabItem = (name: string) => {
        const newDrawerItems = Items?.map((item) => {
            if (item.name === name) {
                item.visible = true
            }
            else {
                item.visible = false
            }
            return item
        })
        setItems(newDrawerItems)
    }

    return (
        <div className='w-screen bg-purple-500 rounded-b-md h-96'>
            <div className='flex flex-row justify-evenly h-12 bg-gray-800' id='drawer-nav'>
                {drawerItems?.map((item, index) => {
                    return (
                        <div tabIndex={index} key={item.name} onFocus={() => toggleVisibleTabItem(item.name)} >
                            <Button className={`'bg-gray-700 h-12 p-3 rounded-t-lg capitalize flex items-center w-max ml-2' ${item.visible && 'bg-purple-500'}`} onClick={() => toggleVisibleTabItem(item.name)}>
                                {item.name}
                                {item.visible && <div className='bg-red-500 rounded-full ml-2 w-2 h-2 '></div>}
                            </Button>

                        </div>
                    )
                })}
                <div className='absolute self-start mt-10'>
                    {drawerItems?.map((item) => {
                        return (
                            <div key={item.name} className={`mt-12 w-full h-full' ${item.visible ? 'block' : 'hidden'}`}>
                                {item.content()}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

