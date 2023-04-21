// import { createClient } from '@supabase/supabase-js'

// export const supabase = createClient("http://localhost:54321", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU")

// type Props = {
//     children: React.ReactNode
// }

// // Either exec some command to start supabase

// function SquireUIProvider (props: Props) {
//     const { children } = props
//     return (
//         <div className="foo">{children}</div>
//     )
// }
import React from 'react';

import { Prompt } from "./components/Prompt";
import { ToolList } from './components/Tools';
export { Prompt, ToolList };