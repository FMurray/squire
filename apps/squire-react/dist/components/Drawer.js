"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>DrawerSideBar
});
const _jsxruntime = require("react/jsx-runtime");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
const _reactdaisyui = require("react-daisyui");
const _DrawerItems = require("./DrawerItems");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function DrawerSideBar() {
    const [Items, setItems] = (0, _react.useState)();
    (0, _react.useEffect)(()=>{
        setItems(_DrawerItems.drawerItems);
    }, [
        _DrawerItems.drawerItems
    ]);
    const toggleVisibleTabItem = (name)=>{
        const newDrawerItems = Items?.map((item)=>{
            if (item.name === name) {
                item.visible = true;
            } else {
                item.visible = false;
            }
            return item;
        });
        setItems(newDrawerItems);
    };
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
        className: "w-screen bg-purple-500 rounded-b-md h-96",
        children: /*#__PURE__*/ (0, _jsxruntime.jsxs)("div", {
            className: "flex flex-row justify-evenly h-12 bg-gray-800",
            id: "drawer-nav",
            children: [
                _DrawerItems.drawerItems?.map((item, index)=>{
                    return /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
                        tabIndex: index,
                        onFocus: ()=>toggleVisibleTabItem(item.name),
                        children: /*#__PURE__*/ (0, _jsxruntime.jsxs)(_reactdaisyui.Button, {
                            className: `'bg-gray-700 h-12 p-3 rounded-t-lg capitalize flex items-center w-max ml-2' ${item.visible && 'bg-purple-500'}`,
                            onClick: ()=>toggleVisibleTabItem(item.name),
                            children: [
                                item.name,
                                item.visible && /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
                                    className: "bg-red-500 rounded-full ml-2 w-2 h-2 "
                                })
                            ]
                        })
                    }, item.name);
                }),
                /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
                    className: "absolute self-start mt-10",
                    children: _DrawerItems.drawerItems?.map((item)=>{
                        return /*#__PURE__*/ (0, _jsxruntime.jsx)("div", {
                            className: `mt-12 w-full h-full' ${item.visible ? 'block' : 'hidden'}`,
                            children: item.content()
                        }, item.name);
                    })
                })
            ]
        })
    });
}
