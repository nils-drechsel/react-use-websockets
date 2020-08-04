"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const WebSocketManager_1 = require("./WebSocketManager");
const WebSocketContext_1 = require("./WebSocketContext");
exports.WebSocketProvider = ({ url, delimiter, logging, children }) => {
    const managerRef = react_1.useRef();
    if (!managerRef.current) {
        managerRef.current = new WebSocketManager_1.WebSocketManager(url, delimiter || "\t", logging || false);
    }
    return (react_1.default.createElement(WebSocketContext_1.WebSocketContext.Provider, { value: managerRef.current }, children));
};
