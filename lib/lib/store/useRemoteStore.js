"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoteStoreArray = exports.useRemoteSingleStore = exports.useRemoteStore = void 0;
const react_1 = require("react");
const useGetRemoteStore_1 = require("./useGetRemoteStore");
const useRemoteStore = (id, path, params, callback, dependency) => {
    const remoteStore = useGetRemoteStore_1.useGetRemoteStore(id);
    const [data, setData] = react_1.useState(remoteStore.getData(path, params || null));
    const dependencyFulfilled = dependency === undefined || !!dependency;
    const pathId = path.join("/");
    const paramString = params ? JSON.stringify(params) : null;
    react_1.useEffect(() => {
        if (dependencyFulfilled) {
            let setIncomingData = setData;
            if (callback) {
                setIncomingData = (incomingData) => {
                    setData(incomingData);
                    callback(incomingData);
                };
            }
            const deregister = remoteStore.register(path, params || null, setIncomingData);
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
    }, [dependencyFulfilled, pathId, paramString]);
    return data;
};
exports.useRemoteStore = useRemoteStore;
const useRemoteSingleStore = (id, path, params, updateDependent, dependency) => {
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
    const data = exports.useRemoteStore(id, path, params, callback, dependency);
    return data && data.size > 0 ? Array.from(data.values())[0] : undefined;
};
exports.useRemoteSingleStore = useRemoteSingleStore;
const useRemoteStoreArray = (id, path, params, dependency) => {
    const data = exports.useRemoteStore(id, path, params, undefined, dependency);
    return data ? Array.from(data.values()) : undefined;
};
exports.useRemoteStoreArray = useRemoteStoreArray;
exports.default = exports.useRemoteStore;
//# sourceMappingURL=useRemoteStore.js.map