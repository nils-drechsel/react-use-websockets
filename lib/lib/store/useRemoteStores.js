"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMultiRemoteStoreSingleton = exports.useMultiRemoteStoreArray = exports.useMultiRemoteStores = exports.remap = void 0;
const react_1 = require("react");
const Beans_1 = require("../beans/Beans");
const StoreBeanUtils_1 = require("../beans/StoreBeanUtils");
const Serialisation_1 = require("../client/serialisation/Serialisation");
const useGetRemoteStore_1 = require("./useGetRemoteStore");
const remap = (m, fn) => {
    const result = new Map();
    m.forEach((value, key) => {
        const resultValue = fn(key, value);
        result.set(key, resultValue);
    });
    return result;
};
exports.remap = remap;
const useMultiRemoteStores = (id, primaryPaths, params, callbacks, dependency, connectionMetaRefs, setConnectionMetas, optional) => {
    const parameterBeans = (0, exports.remap)(params, (_key, value) => {
        if (!value)
            return (0, Beans_1.createNoParametersBean)({ getPathElements: () => [] });
        else
            return value;
    });
    const remoteStore = (0, useGetRemoteStore_1.useGetRemoteStore)(id);
    const [data, setData] = (0, react_1.useState)((0, exports.remap)(primaryPaths, (key, value) => remoteStore.getData(value, parameterBeans.get(key))));
    const [storeMetas, setStoreMetas] = (0, react_1.useState)((0, exports.remap)(primaryPaths, (key, value) => remoteStore.getStoreMeta(value, parameterBeans.get(key))));
    const updateBean = (0, exports.remap)(primaryPaths, (key, value) => (uid, fn) => {
        if (!data.get(key))
            throw new Error("store has not yet received any data or has been cleared: " + primaryPaths.get(key));
        if (!data.get(key).has(uid))
            throw new Error("uid: " + uid + " does not exist in store " + primaryPaths.get(key));
        remoteStore.updateBean(value, parameterBeans.get(key), fn(data.get(key).get(uid)));
    });
    const insertBean = (0, exports.remap)(primaryPaths, (key, value) => (payload) => remoteStore.insertBean(value, parameterBeans.get(key), payload));
    const removeBean = (0, exports.remap)(primaryPaths, (key, value) => (payload) => remoteStore.removeBean(value, parameterBeans.get(key), payload));
    const dependencyFulfilled = dependency === undefined || !!dependency;
    const storeIds = (0, exports.remap)(primaryPaths, (key, value) => (0, StoreBeanUtils_1.createStoreId)(value, parameterBeans.get(key)));
    const storeIdsString = (0, Serialisation_1.serialise)(storeIds);
    const paramString = JSON.stringify(params);
    if (connectionMetaRefs) {
        connectionMetaRefs.forEach((connectionMetaRef, key) => {
            if (connectionMetaRef && connectionMetaRef.current && !connectionMetaRef.current.has(storeIds.get(key))) {
                connectionMetaRef.current.set(storeIds.get(key), storeMetas.get(key));
            }
        });
    }
    (0, react_1.useEffect)(() => {
        if (dependencyFulfilled) {
            let setIncomingData = (0, exports.remap)(primaryPaths, (key, _primaryPath) => (incomingData) => {
                setData(old => {
                    const newMap = new Map(old);
                    newMap.set(key, incomingData);
                    return newMap;
                });
            });
            if (callbacks) {
                setIncomingData = (0, exports.remap)(primaryPaths, (key, _primaryPath) => (incomingData) => {
                    setData(old => {
                        const newMap = new Map(old);
                        newMap.set(key, incomingData);
                        return newMap;
                    });
                    callbacks.get(key)(incomingData);
                });
            }
            let setMeta = (0, exports.remap)(primaryPaths, (key, _primaryPath) => (meta) => {
                setStoreMetas(old => {
                    const newMap = new Map(old);
                    newMap.set(key, meta);
                    return newMap;
                });
                if (setConnectionMetas) {
                    setConnectionMetas.get(key)((metas) => {
                        const newState = new Map(metas);
                        newState.set(storeIds.get(key), meta);
                        return newState;
                    });
                }
                if (connectionMetaRefs && connectionMetaRefs.get(key).current.get(storeIds.get(key)) !== meta) {
                    connectionMetaRefs.get(key).current.set(storeIds.get(key), meta);
                }
            });
            const deregister = (0, exports.remap)(primaryPaths, (key, primaryPath) => remoteStore.register(primaryPath, parameterBeans.get(key), setIncomingData.get(key), setMeta.get(key), optional ?? false));
            return () => {
                deregister.forEach((value, _key) => {
                    value();
                });
                setData((0, exports.remap)(primaryPaths, () => undefined));
                if (callbacks) {
                    callbacks.forEach((callback, _key) => {
                        callback(undefined);
                    });
                }
            };
        }
        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        };
    }, [dependencyFulfilled, storeIdsString, paramString]);
    return {
        data: data,
        meta: storeMetas,
        updateBean,
        insertBean,
        removeBean
    };
};
exports.useMultiRemoteStores = useMultiRemoteStores;
const useMultiRemoteStoreArray = (id, primaryPaths, params, callbacks, dependency, connectionMetaRefs, setConnectionMetas, optional) => {
    const res = (0, exports.useMultiRemoteStores)(id, primaryPaths, params, callbacks, dependency, connectionMetaRefs, setConnectionMetas, optional);
    return {
        data: (0, exports.remap)(res.data, (_key, data) => data ? Array.from(data.values()) : undefined),
        meta: res.meta,
        updateBean: res.updateBean,
        insertBean: res.insertBean,
        removeBean: res.removeBean
    };
};
exports.useMultiRemoteStoreArray = useMultiRemoteStoreArray;
const useMultiRemoteStoreSingleton = (id, primaryPaths, params, callbacks, dependency, connectionMetaRefs, setConnectionMetas, optional) => {
    const res = (0, exports.useMultiRemoteStores)(id, primaryPaths, params, callbacks, dependency, connectionMetaRefs, setConnectionMetas, optional);
    return {
        data: (0, exports.remap)(res.data, (_key, data) => data && data.size === 1 ? Array.from(data.values())[0] : undefined),
        meta: res.meta,
        updateBean: res.updateBean,
        insertBean: res.insertBean,
        removeBean: res.removeBean
    };
};
exports.useMultiRemoteStoreSingleton = useMultiRemoteStoreSingleton;
exports.default = exports.useMultiRemoteStores;
//# sourceMappingURL=useRemoteStores.js.map