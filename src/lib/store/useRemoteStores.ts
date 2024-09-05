import { useEffect, useState } from "react";
import { AbstractStoreBean, AbstractStoreParametersBean, createNoParametersBean } from "../beans/Beans";
import { createStoreId } from "../beans/StoreBeanUtils";
import { serialise } from "../client/serialisation/Serialisation";
import { InsertBeanFunction, RemoveBeanFunction, StoreMeta, UpdateBeanFunction } from "./RemoteStore";
import { ConnectionMetaRef, ConnectionMetaSetter } from "./connectStore";
import { useGetRemoteStore } from "./useGetRemoteStore";

export interface MultiRemoteStoreType<BEAN extends AbstractStoreBean>{
    data: Map<string, Map<string, BEAN>>, 
    meta: Map<string, StoreMeta>,
    updateBean: Map<string, UpdateBeanFunction<BEAN>>,
    insertBean: Map<string, InsertBeanFunction<BEAN>>,
    removeBean: Map<string, RemoveBeanFunction>
}

export interface MultiRemoteStoreArrayType<BEAN extends AbstractStoreBean> {
    data: Map<string, Array<BEAN>>,
    meta: Map<string, StoreMeta>,
    updateBean: Map<string, UpdateBeanFunction<BEAN>>,
    insertBean: Map<string, InsertBeanFunction<BEAN>>,
    removeBean: Map<string, RemoveBeanFunction>
}

export interface MultiRemoteStoreSingletonType<BEAN extends AbstractStoreBean> {
    data:  Map<string, BEAN>,
    meta: Map<string, StoreMeta>,
    updateBean: Map<string, UpdateBeanFunction<BEAN>>,
    insertBean: Map<string, InsertBeanFunction<BEAN>>,
    removeBean: Map<string, RemoveBeanFunction>
}

export const remap = <TYPE, RESULT>(m: Map<string, TYPE>, fn: (key: string, value: TYPE) => RESULT): Map<string, RESULT> => {

    const result = new Map<string, RESULT>();
    m.forEach((value, key) => {
        const resultValue = fn(key, value);
        result.set(key, resultValue);
    });
    return result;
}

    

export const useMultiRemoteStores = <BEAN extends AbstractStoreBean>(
    id: string | null,
    primaryPaths: Map<string, Array<string>>,
    params: Map<string, AbstractStoreParametersBean | null>,
    callbacks?: Map<string, (data: Map<string, BEAN> | undefined) => void>,
    dependency?: any,
    connectionMetaRefs?: Map<string, ConnectionMetaRef>,
    setConnectionMetas?: Map<string, ConnectionMetaSetter>,
    optional?: boolean
): MultiRemoteStoreType<BEAN> => {

    const parameterBeans = remap(params, (_key, value: AbstractStoreParametersBean | null) => {
        if (!value) return createNoParametersBean({getPathElements: () => []})
        else return value;
    });



    const remoteStore = useGetRemoteStore(id);

    const [data, setData] = useState(remap(primaryPaths, (key, value) => remoteStore.getData(value, parameterBeans.get(key)!)));

    const [storeMetas, setStoreMetas] = useState(remap(primaryPaths, (key, value) => remoteStore.getStoreMeta(value, parameterBeans.get(key)!)));

    const updateBean: Map<string, UpdateBeanFunction<BEAN>> = 
        remap(primaryPaths, (key, value) => (payload) => remoteStore.updateBean(value, parameterBeans.get(key)!, payload));

    const insertBean: Map<string, InsertBeanFunction<BEAN>> = 
        remap(primaryPaths, (key, value) => (payload) => remoteStore.insertBean(value, parameterBeans.get(key)!, payload));

    const removeBean: Map<string, RemoveBeanFunction> = 
        remap(primaryPaths, (key, value) => (payload) => remoteStore.removeBean(value, parameterBeans.get(key)!, payload));

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const storeIds: Map<string, string> = remap(primaryPaths, (key, value) => createStoreId(value, parameterBeans.get(key)));

    const storeIdsString = serialise(storeIds);
    const paramString = JSON.stringify(params);

    if (connectionMetaRefs) {

        connectionMetaRefs.forEach((connectionMetaRef, key) => {
            if (connectionMetaRef && connectionMetaRef.current && !connectionMetaRef.current.has(storeIds.get(key)!)) {
                connectionMetaRef.current.set(storeIds.get(key)!, storeMetas.get(key)!);
            }
        });
    }

    useEffect(() => {

        if (dependencyFulfilled) {
            let setIncomingData = remap(primaryPaths, (key, _primaryPath) => (incomingData: Map<string, BEAN>): void => {
                setData(old => {
                    const newMap = new Map(old);
                    newMap.set(key, incomingData);
                    return newMap;
                });
            });

            if (callbacks) {
                setIncomingData = remap(primaryPaths, (key, _primaryPath) => (incomingData: Map<string, BEAN>): void => {
                    setData(old => {
                        const newMap = new Map(old);
                        newMap.set(key, incomingData);
                        return newMap;
                    });
                    callbacks.get(key)!(incomingData);
                });
            }


            let setMeta = remap(primaryPaths, (key, _primaryPath) => (meta: StoreMeta): void => {
                setStoreMetas(old => {
                    const newMap = new Map(old);
                    newMap.set(key, meta);
                    return newMap;
                });

                if (setConnectionMetas) {
                    setConnectionMetas.get(key)!((metas: Map<string, StoreMeta>) => {
                        const newState = new Map(metas);
                        newState.set(storeIds.get(key)!, meta);
                        return newState;
                    });
                }

                if (connectionMetaRefs && connectionMetaRefs.get(key)!.current.get(storeIds.get(key)!) !== meta) {
                    connectionMetaRefs.get(key)!.current.set(storeIds.get(key)!, meta);
                }
            });

            const deregister = remap(primaryPaths, (key, primaryPath) => remoteStore.register(primaryPath, parameterBeans.get(key)!, setIncomingData.get(key)!, setMeta.get(key)!, optional ?? false));

            return () => {
                deregister.forEach((value, _key) => {
                    value();
                });

                setData(remap(primaryPaths, () => undefined));

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
        data: data as any,
        meta: storeMetas,
        updateBean, 
        insertBean, 
        removeBean
    }
};


export const useMultiRemoteStoreArray = <BEAN extends AbstractStoreBean>(
    id: string | null,
    primaryPaths: Map<string, Array<string>>,
    params: Map<string, AbstractStoreParametersBean | null>,
    callbacks?: Map<string, (data: Map<string, BEAN> | undefined) => void>,
    dependency?: any,
    connectionMetaRefs?: Map<string, ConnectionMetaRef>,
    setConnectionMetas?: Map<string, ConnectionMetaSetter>,
    optional?: boolean
): MultiRemoteStoreArrayType<BEAN> => {
    const res = useMultiRemoteStores(
        id,
        primaryPaths,
        params,
        callbacks,
        dependency,
        connectionMetaRefs,
        setConnectionMetas,
        optional
    );

    return {
        data: remap(res.data, (_key, data) => data ? Array.from(data.values()) : (undefined as any)),
        meta: res.meta,
        updateBean: res.updateBean, 
        insertBean: res.insertBean, 
        removeBean: res.removeBean
    }
    
};

export const useMultiRemoteStoreSingleton = <BEAN extends AbstractStoreBean>(
    id: string | null,
    primaryPaths: Map<string, Array<string>>,
    params: Map<string, AbstractStoreParametersBean | null>,
    callbacks?: Map<string, (data: Map<string, BEAN> | undefined) => void>,
    dependency?: any,
    connectionMetaRefs?: Map<string, ConnectionMetaRef>,
    setConnectionMetas?: Map<string, ConnectionMetaSetter>,
    optional?: boolean
): MultiRemoteStoreSingletonType<BEAN> => {
    const res = useMultiRemoteStores(
        id,
        primaryPaths,
        params,
        callbacks,
        dependency,
        connectionMetaRefs,
        setConnectionMetas,
        optional
    );

    return {
        data: remap(res.data, (_key, data) => data && data.size === 1 ? Array.from(data.values())[0] : (undefined as any)),
        meta: res.meta,
        updateBean: res.updateBean, 
        insertBean: res.insertBean, 
        removeBean: res.removeBean
    }
    
};

export default useMultiRemoteStores;
