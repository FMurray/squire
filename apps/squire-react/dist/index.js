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
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Prompt: ()=>_Prompt.Prompt,
    ToolList: ()=>_Tools.ToolList
});
const _react = /*#__PURE__*/ _interop_require_default(require("react"));
const _Prompt = require("./components/Prompt");
const _Tools = require("./components/Tools");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
