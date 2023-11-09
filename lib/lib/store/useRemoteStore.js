"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoteStoreArray = exports.useRemoteStore = void 0;
const react_1 = require("react");
const StoreBeanUtils_1 = require("./beans/StoreBeanUtils");
const useGetRemoteStore_1 = require("./useGetRemoteStore");
const useRemoteStore = (id, primaryPath, secondaryPath, params, callback, dependency, connectionStateRef, setConnectionState) => {
    const remoteStore = (0, useGetRemoteStore_1.useGetRemoteStore)(id);
    const [data, setData] = (0, react_1.useState)(remoteStore.getData(primaryPath, secondaryPath, params || null));
    const dependencyFulfilled = dependency === undefined || !!dependency;
    const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
    const paramString = params ? JSON.stringify(params) : null;
    if (connectionStateRef && connectionStateRef.current && !connectionStateRef.current.has(storeId)) {
        connectionStateRef.current.set(storeId, data !== undefined);
    }
    (0, react_1.useEffect)(() => {
        const setThisConnectionState = (s) => {
            if (connectionStateRef && connectionStateRef.current.get(storeId) !== s) {
                if (setConnectionState)
                    setConnectionState((state) => {
                        const newState = new Map(state);
                        newState.set(storeId, s);
                        return newState;
                    });
            }
        };
        if (data === undefined) {
            setThisConnectionState(false);
        }
        else {
            setThisConnectionState(true);
        }
        if (dependencyFulfilled) {
            let setIncomingData = (incomingData) => {
                setData(incomingData);
                setThisConnectionState(true);
            };
            if (callback) {
                setIncomingData = (incomingData) => {
                    setData(incomingData);
                    callback(incomingData);
                    setThisConnectionState(true);
                };
            }
            const deregister = remoteStore.register(primaryPath, secondaryPath, params || null, setIncomingData);
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
    }, [dependencyFulfilled, storeId, paramString]);
    return data;
};
exports.useRemoteStore = useRemoteStore;
const useRemoteStoreArray = (id, primaryPath, secondaryPath, params, dependency) => {
    const data = (0, exports.useRemoteStore)(id, primaryPath, secondaryPath, params, undefined, dependency);
    return data ? Array.from(data.values()) : undefined;
};
exports.useRemoteStoreArray = useRemoteStoreArray;
exports.default = exports.useRemoteStore;
//# sourceMappingURL=useRemoteStore.js.map