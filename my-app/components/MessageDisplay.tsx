import React, { useMemo } from 'react'
import ThoughtBubble from './thoughtBubble'

type Log = {
    type: string,
    content?: string
    tool_name?: string
    tool_input?: string
}

const MessageDisplay = (Logs: any) => {
    console.log("Logs", Logs)
    if (Logs['Logs'] != undefined) {
        console.log(typeof Logs['Logs'])
        console.log(Logs['Logs'])
        //const Log = JSON.parse(Logs['Logs'])

        return (
            <ul>
                {Logs['Logs'].map((log: Log) => {
                    if (log.content)
                        return (
                            <li>
                                {ThoughtBubble(log.content)}
                            </li>
                        )
                })
                }

            </ul>

        )
    }
}









export default MessageDisplay