"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "drawerItems", {
    enumerable: true,
    get: ()=>drawerItems
});
const _Prompt = require("../Prompt");
const drawerItems = [
    {
        name: 'prompt',
        content: _Prompt.Prompt,
        visible: true
    },
    {
        name: 'Another Thing',
        content: SomerandomComponent,
        visible: false
    },
    {
        name: 'And Another',
        content: AnotherRandomComponent,
        visible: false
    }
];
