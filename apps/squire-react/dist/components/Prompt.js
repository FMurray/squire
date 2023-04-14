"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Prompt", {
    enumerable: true,
    get: ()=>Prompt
});
const _jsxruntime = require("react/jsx-runtime");
const _react = require("react");
const _reactdaisyui = require("react-daisyui");
function Prompt({ client  }) {
    const textareaRef = (0, _react.useRef)(null);
    const [content, setContent] = (0, _react.useState)();
    const [generation, setGeneration] = (0, _react.useState)();
    const [logs, setLogs] = (0, _react.useState)([]);
    const [testLogs, setTestLogs] = (0, _react.useState)([]);
    const [id, setId] = (0, _react.useState)();
    (0, _react.useEffect)(()=>{
        if (!id || !client) return;
        console.log(client);
        const subscription = client.channel('any').on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'generations',
            filter: `id=eq.${id}`
        }, (payload)=>{
            setLogs(payload.new.logs);
        }).subscribe();
        return ()=>{
            console.log("I was unsubscribed!");
            subscription.unsubscribe();
        };
    }, [
        client,
        id
    ]);
    const generate = ()=>{
        const payload = {
            "feature_description": content
        };
        console.log(payload);
        fetch('http://localhost:8000/generate', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response)=>response.json()).then((data)=>{
            console.log(data);
            setGeneration(data);
            setId(data.id);
        });
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generate();
        }
    };
    const stopGeneration = ()=>{
        fetch(`http://localhost:8000/generate/stop/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response)=>response.json()).then((data)=>{
            console.log(data);
        });
    };
    return /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
        children: [
            /*#__PURE__*/ (0, _jsxruntime.jsx)("ul", {
                children: logs
            }),
            /*#__PURE__*/ (0, _jsxruntime.jsx)("textarea", {
                className: "rounded-md  mt-2 p-2 ",
                cols: 80,
                ref: textareaRef,
                placeholder: 'Type a message or type "/" to select a prompt...',
                // onCompositionStart={() => setIsTyping(true)}
                // onCompositionEnd={() => setIsTyping(false)}
                onChange: (e)=>setContent(e.target.value),
                onKeyDown: handleKeyDown
            }),
            /*#__PURE__*/ (0, _jsxruntime.jsx)(_reactdaisyui.Button, {
                onClick: stopGeneration,
                children: "Stop Generation, Man"
            })
        ]
    });
}
