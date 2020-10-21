"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const RemoteStoreContext_1 = __importDefault(require("./RemoteStoreContext"));
const useWebSocket_1 = require("../client/useWebSocket");
class RemoteStoreAccessor {
    constructor(path, params) {
        this.params = [];
        this.dataCallbackFunction = undefined;
        this.dependencyItem = undefined;
        this.path = path;
        if (params)
            this.params = params;
    }
    dataCallback(dataCallbackFunction) {
        this.dataCallbackFunction = dataCallbackFunction;
        return this;
    }
    dependency(dependencyItem) {
        this.dependencyItem = dependencyItem;
        return this;
    }
    dependent(dependentFunction) {
        this.dependentFunction = dependentFunction;
    }
    map() {
        return exports.useRemoteStore(this.path, this.params, this.dataCallbackFunction);
    }
    single() {
        return exports.useRemoteSingleStore(this.path, this.params, this.dependentFunction, this.dependencyItem);
    }
    array() {
        return exports.useRemoteStoreArray(this.path, this.params, this.dependencyItem);
    }
}
exports.useRemoteStoreAccess = (path, params) => {
    const [accessor] = react_1.useState(new RemoteStoreAccessor(path, params));
    return accessor;
};
exports.useRemoteStore = (path, params, callback, dependency) => {
    const remoteStore = react_1.useContext(RemoteStoreContext_1.default);
    const { listen, send } = useWebSocket_1.useWebSocket();
    const [data, setData] = react_1.useState(remoteStore.getData(path, params || []));
    const [validation, setValidation] = react_1.useState(null);
    const dependencyFulfilled = dependency === undefined || !!dependency;
    const pathId = path.join("/");
    react_1.useEffect(() => {
        if (dependencyFulfilled) {
            let setIncomingData = setData;
            if (callback) {
                setIncomingData = (incomingData) => {
                    setData(incomingData);
                    callback(incomingData);
                };
            }
            const deregister = remoteStore.register(path, params || [], setIncomingData);
            return () => {
                deregister();
                setData(undefined);
                if (callback)
                    callback(undefined);
            };
        }
        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        };
    }, [dependencyFulfilled, pathId]);
    return data;
};
exports.useRemoteSingleStore = (path, params, updateDependent, dependency) => {
    let callback = undefined;
    if (updateDependent) {
        callback = (incomingData) => {
            const item = incomingData && incomingData.size > 0 ? Array.from(incomingData.values())[0] : null;
            updateDependent((old) => {
                if (incomingData === undefined)
                    return undefined;
                if (old === null || old === undefined) {
                    return item;
                }
                else {
                    return Object.assign({}, old, item);
                }
            });
        };
    }
    const data = exports.useRemoteStore(path, params, callback, dependency);
    return data && data.size > 0 ? Array.from(data.values())[0] : undefined;
};
exports.useRemoteStoreArray = (path, params, dependency) => {
    const data = exports.useRemoteStore(path, params, dependency);
    return data ? Array.from(data.values()) : undefined;
};
exports.default = exports.useRemoteStore;
