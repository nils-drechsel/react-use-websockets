import { useEffect, useState } from "react";
import { AbstractStoreBean, AbstractStoreParametersBean, createNoParametersBean } from "../beans/Beans";
import { createStoreId } from "../beans/StoreBeanUtils";
import { InsertBeanFunction, RemoveBeanFunction, StoreMeta, UpdateBeanFunction } from "./RemoteStore";
import { ConnectionMetaRef, ConnectionMetaSetter } from "./connectStore";
import { useGetRemoteStore } from "./useGetRemoteStore";


export interface RemoteStoreType<BEAN extends AbstractStoreBean>{
    data: Map<string, BEAN>, 
    meta: StoreMeta,
    updateBean: UpdateBeanFunction<BEAN>,
    insertBean: InsertBeanFunction<BEAN>,
    removeBean: RemoveBeanFunction
}

export interface RemoteStoreArrayType<BEAN extends AbstractStoreBean> {
    data: Array<BEAN>, 
    meta: StoreMeta,
    updateBean: UpdateBeanFunction<BEAN>,
    insertBean: InsertBeanFunction<BEAN>,
    removeBean: RemoveBeanFunction
}

export const useRemoteStore = <BEAN extends AbstractStoreBean>(
    id: string | null,
    primaryPath: Array<string>,
    params?: AbstractStoreParametersBean | null,
    callback?: (data: Map<string, BEAN> | undefined) => void,
    dependency?: any,
    connectionMetaRef?: ConnectionMetaRef,
    setConnectionMeta?: ConnectionMetaSetter,
    optional?: boolean
): RemoteStoreType<BEAN> => {

    const parametersBean = params ?? createNoParametersBean();

    const remoteStore = useGetRemoteStore<BEAN>(id);

    const [data, setData] = useState(remoteStore.getData(primaryPath, parametersBean));
    const [storeMeta, setStoreMeta] = useState(remoteStore.getStoreMeta(primaryPath, parametersBean));

    const updateBean: UpdateBeanFunction<BEAN> = (payload) => {
        remoteStore.updateBean(primaryPath, parametersBean, payload);
    }

    const insertBean: InsertBeanFunction<BEAN> = (payload) => {
        remoteStore.insertBean(primaryPath, parametersBean, payload, );
    }

    const removeBean: RemoveBeanFunction = (key) => {
        remoteStore.removeBean(primaryPath, parametersBean ?? null, key);
    }

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const storeId = createStoreId(primaryPath, params);

    const paramString = params ? JSON.stringify(params) : null;

    if (connectionMetaRef && connectionMetaRef.current && !connectionMetaRef.current.has(storeId)) {
        connectionMetaRef.current.set(storeId, storeMeta);
    }

    useEffect(() => {

        if (dependencyFulfilled) {
            let setIncomingData = (incomingData: Map<string, BEAN>): void => {
                setData(incomingData);
            };

            if (callback) {
                setIncomingData = (incomingData: Map<string, BEAN>): void => {
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

            const deregister = remoteStore.register(primaryPath, parametersBean, setIncomingData, setMeta, optional ?? false);

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


export const useRemoteStoreArray = <BEAN extends AbstractStoreBean>(
    id: string | null,
    primaryPath: Array<string>,
    params?: AbstractStoreParametersBean | null,
    callback?: (data: Map<string, BEAN> | undefined) => void,
    dependency?: any,
    connectionMetaRef?: ConnectionMetaRef,
    setConnectionMeta?: ConnectionMetaSetter,
    optional?: boolean
): RemoteStoreArrayType<BEAN> => {
    const res = useRemoteStore(
        id,
        primaryPath,
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
