"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoteStoreArray = exports.useRemoteStore = void 0;
const react_1 = require("react");
const StoreBeanUtils_1 = require("./beans/StoreBeanUtils");
const useGetRemoteStore_1 = require("./useGetRemoteStore");
const useRemoteStore = (id, primaryPath, secondaryPath, params, callback, dependency, connectionMetaRef, setConnectionMeta, optional) => {
    const remoteStore = (0, useGetRemoteStore_1.useGetRemoteStore)(id);
    const [data, setData] = (0, react_1.useState)(remoteStore.getData(primaryPath, secondaryPath, params || null));
    const [storeMeta, setStoreMeta] = (0, react_1.useState)(remoteStore.getStoreMeta(primaryPath, secondaryPath, params || null));
    const updateBean = (payload, callback) => {
        remoteStore.updateBean(primaryPath, secondaryPath, params !== null && params !== void 0 ? params : null, payload, callback);
    };
    const insertBean = (payload, callback) => {
        remoteStore.insertBean(primaryPath, secondaryPath, params !== null && params !== void 0 ? params : null, payload, callback);
    };
    const removeBean = (key, callback) => {
        remoteStore.removeBean(primaryPath, secondaryPath, params !== null && params !== void 0 ? params : null, key, callback);
    };
    const dependencyFulfilled = dependency === undefined || !!dependency;
    const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, secondaryPath, params);
    const paramString = params ? JSON.stringify(params) : null;
    if (connectionMetaRef && connectionMetaRef.current && !connectionMetaRef.current.has(storeId)) {
        connectionMetaRef.current.set(storeId, storeMeta);
    }
    (0, react_1.useEffect)(() => {
        if (dependencyFulfilled) {
            let setIncomingData = (incomingData) => {
                setData(incomingData);
            };
            if (callback) {
                setIncomingData = (incomingData) => {
                    setData(incomingData);
                    callback(incomingData);
                };
            }
            let setMeta = (meta) => {
                setStoreMeta(meta);
                if (setConnectionMeta) {
                    setConnectionMeta((metas) => {
                        const newState = new Map(metas);
                        newState.set(storeId, meta);
                        return newState;
                    });
                }
                if (connectionMetaRef && connectionMetaRef.current.get(storeId) !== meta) {
                    connectionMetaRef.current.set(storeId, meta);
                }
            };
            const deregister = remoteStore.register(primaryPath, secondaryPath, params || null, setIncomingData, setMeta, false, optional !== null && optional !== void 0 ? optional : false);
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
    return {
        data: data,
        meta: storeMeta,
        updateBean,
        insertBean,
        removeBean
    };
};
exports.useRemoteStore = useRemoteStore;
const useRemoteStoreArray = (id, primaryPath, secondaryPath, params, callback, dependency, connectionMetaRef, setConnectionMeta, optional) => {
    const res = (0, exports.useRemoteStore)(id, primaryPath, secondaryPath, params, callback, dependency, connectionMetaRef, setConnectionMeta, optional);
    return {
        data: res.data ? Array.from(res.data.values()) : undefined,
        meta: res.meta,
        updateBean: res.updateBean,
        insertBean: res.insertBean,
        removeBean: res.removeBean
    };
};
exports.useRemoteStoreArray = useRemoteStoreArray;
exports.default = exports.useRemoteStore;
//# sourceMappingURL=useRemoteStore.js.map