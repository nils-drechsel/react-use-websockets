"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const WebSocketContext_1 = require("./WebSocketContext");
exports.useWebSocket = () => {
    const manager = react_1.useContext(WebSocketContext_1.WebSocketContext);
    const send = (message, payload) => {
        if (!manager)
            throw Error("manager is null, did you provide a <WebSocketProvider> element?");
        manager.send(message, payload);
    };
    const listen = (message, callback) => {
        if (!manager)
            throw Error("manager is null, did you provide a <WebSocketProvider> element?");
        return manager.addListener(message, callback);
    };
    const isConnected = () => {
        if (!manager)
            throw Error("manager is null, did you provide a <WebSocketProvider> element?");
        return manager.isConnected();
    };
    return { send, listen, isConnected };
};
