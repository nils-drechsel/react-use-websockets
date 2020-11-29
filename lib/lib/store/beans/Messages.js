"use strict";
// This file is auto-generated. Do not modify
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore: unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const react_use_websockets_1 = require("react-use-websockets");
exports.useListenForMessage = () => {
    return react_use_websockets_1.useListen("MESSAGE");
};
exports.useListenForMessageEffect = (callback) => {
    react_use_websockets_1.useListenEffect("MESSAGE", callback);
};
exports.useSendClientError = () => {
    const { send } = react_use_websockets_1.useWebSocket();
    return (payload, toSid) => {
        send("CLIENT_ERROR", payload, toSid);
    };
};
//# sourceMappingURL=Messages.js.map