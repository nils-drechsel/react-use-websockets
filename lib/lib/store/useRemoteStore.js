"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RemoteStoreContext_1 = __importDefault(require("./RemoteStoreContext"));
const useWebSocket_1 = require("../client/useWebSocket");
exports.useRemoteStore = (path) => {
    const remoteStore = react_1.useContext(RemoteStoreContext_1.default);
    const { listen, send } = useWebSocket_1.useWebSocket();
    const [data, setData] = react_1.useState(null);
    react_1.useEffect(() => {
        const deregister = remoteStore.register(path, setData);
        return () => {
            deregister();
        };
    }, []);
    return data;
};
exports.default = exports.useRemoteStore;
