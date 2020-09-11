"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RemoteStoreContext_1 = __importDefault(require("./RemoteStoreContext"));
const useWebSocket_1 = require("../client/useWebSocket");
exports.useRemoteStore = (path, callback, dependency) => {
    const remoteStore = react_1.useContext(RemoteStoreContext_1.default);
    const { listen, send } = useWebSocket_1.useWebSocket();
    const [data, setData] = react_1.useState(remoteStore.getData(path));
    const dependencyFulfilled = dependency === undefined || !!dependency;
    react_1.useEffect(() => {
        if (dependencyFulfilled) {
            let setIncomingData = setData;
            if (callback) {
                setIncomingData = (incomingData) => {
                    setData(incomingData);
                    callback(incomingData);
                };
            }
            const deregister = remoteStore.register(path, setIncomingData);
            return () => {
                deregister();
            };
        }
        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        };
    }, [dependencyFulfilled]);
    return data;
};
exports.useRemoteSingleStore = (path, updateDependent, dependency) => {
    let callback = undefined;
    if (updateDependent) {
        callback = (incomingData) => {
            const item = incomingData && incomingData.size > 0 ? Array.from(incomingData.values())[0] : null;
            updateDependent((old) => {
                if (old === null || old === undefined) {
                    return item;
                }
                else {
                    return Object.assign({}, old, incomingData);
                }
            });
        };
    }
    const data = exports.useRemoteStore(path, callback, dependency);
    return data && data.size > 0 ? Array.from(data.values())[0] : undefined;
};
exports.useRemoteStoreArray = (path, dependency) => {
    const data = exports.useRemoteStore(path, dependency);
    return data ? Array.from(data.values()) : undefined;
};
exports.default = exports.useRemoteStore;
