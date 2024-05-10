import { useEffect, useState } from "react";
import { AbstractIOBean, AbstractStoreParametersBean } from "../beans/Beans";
import { createStoreId } from "../beans/StoreBeanUtils";
import { InsertBeanFunction, RemoveBeanFunction, StoreMeta, UpdateBeanFunction } from "./RemoteStore";
import { ConnectionMetaRef, ConnectionMetaSetter } from "./connectStore";
import { useGetRemoteStore } from "./useGetRemoteStore";


export interface RemoteStoreType<FRAGMENT extends AbstractIOBean>{
    data: Map<string, FRAGMENT>, 
    meta: StoreMeta,
    updateBean: UpdateBeanFunction<FRAGMENT>,
    insertBean: InsertBeanFunction<FRAGMENT>,
    removeBean: RemoveBeanFunction
}

export interface RemoteStoreArrayType<FRAGMENT extends AbstractIOBean> {
    data: Array<FRAGMENT>, 
    meta: StoreMeta,
    updateBean: UpdateBeanFunction<FRAGMENT>,
    insertBean: InsertBeanFunction<FRAGMENT>,
    removeBean: RemoveBeanFunction
}

export const useRemoteStore = <FRAGMENT extends AbstractIOBean>(
    id: string | null,
    primaryPath: Array<string>,
    secondaryPath: Array<string>,
    params?: AbstractStoreParametersBean | null,
    callback?: (data: Map<string, FRAGMENT> | undefined) => void,
    dependency?: any,
    connectionMetaRef?: ConnectionMetaRef,
    setConnectionMeta?: ConnectionMetaSetter,
    optional?: boolean
): RemoteStoreType<FRAGMENT> => {
    const remoteStore = useGetRemoteStore<FRAGMENT>(id);

    const [data, setData] = useState(remoteStore.getData(primaryPath, secondaryPath, params || null));
    const [storeMeta, setStoreMeta] = useState(remoteStore.getStoreMeta(primaryPath, secondaryPath, params || null));

    const updateBean: UpdateBeanFunction<FRAGMENT> = (payload, callback) => {
        remoteStore.updateBean(primaryPath, secondaryPath, params ?? null, payload, callback);
    }

    const insertBean: InsertBeanFunction<FRAGMENT> = (payload, callback) => {
        remoteStore.insertBean(primaryPath, secondaryPath, params ?? null, payload, callback);
    }

    const removeBean: RemoveBeanFunction = (key, callback) => {
        remoteStore.removeBean(primaryPath, secondaryPath, params ?? null, key, callback);
    }

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const storeId = createStoreId(primaryPath, secondaryPath, params);

    const paramString = params ? JSON.stringify(params) : null;

    if (connectionMetaRef && connectionMetaRef.current && !connectionMetaRef.current.has(storeId)) {
        connectionMetaRef.current.set(storeId, storeMeta);
    }

    useEffect(() => {

        if (dependencyFulfilled) {
            let setIncomingData = (incomingData: Map<string, FRAGMENT>): void => {
                setData(incomingData);
            };

            if (callback) {
                setIncomingData = (incomingData: Map<string, FRAGMENT>): void => {
                    setData(incomingData);
                    callback(incomingData);
                };
            }

            let setMeta = (meta: StoreMeta): void => {
                setStoreMeta(meta);
                if (setConnectionMeta) {
                    setConnectionMeta((metas: Map<string, StoreMeta>) => {
                        const newState = new Map(metas);
                        newState.set(storeId, meta);
                        return newState;
                    });
                }

                if (connectionMetaRef && connectionMetaRef.current.get(storeId) !== meta) {
                    connectionMetaRef.current.set(storeId, meta);
                }
            };

            const deregister = remoteStore.register(primaryPath, secondaryPath, params || null, setIncomingData, setMeta, false, optional ?? false);

            return () => {
                deregister();
                setData(undefined);
                if (callback) callback(undefined);
            };
        }

        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        };
    }, [dependencyFulfilled, storeId, paramString]);

    return {
        data: data as any,
        meta: storeMeta,
        updateBean, 
        insertBean, 
        removeBean
    }
};


export const useRemoteStoreArray = <FRAGMENT extends AbstractIOBean>(
    id: string | null,
    primaryPath: Array<string>,
    secondaryPath: Array<string>,
    params?: AbstractStoreParametersBean | null,
    callback?: (data: Map<string, FRAGMENT> | undefined) => void,
    dependency?: any,
    connectionMetaRef?: ConnectionMetaRef,
    setConnectionMeta?: ConnectionMetaSetter,
    optional?: boolean
): RemoteStoreArrayType<FRAGMENT> => {
    const res = useRemoteStore(
        id,
        primaryPath,
        secondaryPath,
        params,
        callback,
        dependency,
        connectionMetaRef,
        setConnectionMeta,
        optional
    );

    return {
        data: res.data ? Array.from(res.data.values()) : (undefined as any),
        meta: res.meta,
        updateBean: res.updateBean, 
        insertBean: res.insertBean, 
        removeBean: res.removeBean
    }
    
};

export default useRemoteStore;
