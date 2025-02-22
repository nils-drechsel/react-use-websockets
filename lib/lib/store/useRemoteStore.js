"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoteStoreSingleton = exports.useRemoteStoreArray = exports.useRemoteStore = void 0;
const react_1 = require("react");
const Beans_1 = require("../beans/Beans");
const StoreBeanUtils_1 = require("../beans/StoreBeanUtils");
const useGetRemoteStore_1 = require("./useGetRemoteStore");
const useRemoteStore = (id, primaryPath, params, callback, dependency, connectionMetaRef, setConnectionMeta, optional) => {
    const parametersBean = params ?? (0, Beans_1.createNoParametersBean)();
    const remoteStore = (0, useGetRemoteStore_1.useGetRemoteStore)(id);
    const [data, setData] = (0, react_1.useState)(remoteStore.getData(primaryPath, parametersBean));
    const [storeMeta, setStoreMeta] = (0, react_1.useState)(remoteStore.getStoreMeta(primaryPath, parametersBean));
    const updateBean = (uid, editor) => {
        if (!data)
            throw new Error("store has not yet received any data or has been cleared: " + primaryPath);
        if (!data.has(uid))
            throw new Error("uid: " + uid + " does not exist in store " + primaryPath);
        remoteStore.updateBean(primaryPath, parametersBean, editor(data.get(uid)));
    };
    const insertBean = (payload) => {
        remoteStore.insertBean(primaryPath, parametersBean, payload);
    };
    const removeBean = (key) => {
        remoteStore.removeBean(primaryPath, parametersBean ?? null, key);
    };
    const dependencyFulfilled = dependency === undefined || !!dependency;
    const storeId = (0, StoreBeanUtils_1.createStoreId)(primaryPath, parametersBean);
    const paramString = JSON.stringify(params);
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
            const deregister = remoteStore.register(primaryPath, parametersBean, setIncomingData, setMeta, optional ?? false);
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
const useRemoteStoreArray = (id, primaryPath, params, callback, dependency, connectionMetaRef, setConnectionMeta, optional) => {
    const res = (0, exports.useRemoteStore)(id, primaryPath, params, callback, dependency, connectionMetaRef, setConnectionMeta, optional);
    return {
        data: res.data ? Array.from(res.data.values()) : undefined,
        meta: res.meta,
        updateBean: res.updateBean,
        insertBean: res.insertBean,
        removeBean: res.removeBean
    };
};
exports.useRemoteStoreArray = useRemoteStoreArray;
const useRemoteStoreSingleton = (id, primaryPath, params, callback, dependency, connectionMetaRef, setConnectionMeta, optional) => {
    const res = (0, exports.useRemoteStore)(id, primaryPath, params, callback, dependency, connectionMetaRef, setConnectionMeta, optional);
    return {
        data: res.data && res.data.size === 1 ? Array.from(res.data.values())[0] : undefined,
        meta: res.meta,
        updateBean: res.updateBean,
        insertBean: res.insertBean,
        removeBean: res.removeBean
    };
};
exports.useRemoteStoreSingleton = useRemoteStoreSingleton;
exports.default = exports.useRemoteStore;
//# sourceMappingURL=useRemoteStore.js.map