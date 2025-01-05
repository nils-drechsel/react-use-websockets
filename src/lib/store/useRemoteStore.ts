import { useEffect, useState } from "react";
import { AbstractStoreBean, AbstractStoreParametersBean, createNoParametersBean } from "../beans/Beans";
import { createStoreId } from "../beans/StoreBeanUtils";
import { BeanEditor, InsertBeanFunction, RemoveBeanFunction, StoreMeta, UpdateBeanFunction } from "./RemoteStore";
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

export interface RemoteStoreSingletonType<BEAN extends AbstractStoreBean> {
    data: BEAN, 
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

    const remoteStore = useGetRemoteStore(id);

    const [data, setData] = useState(remoteStore.getData(primaryPath, parametersBean));

    const [storeMeta, setStoreMeta] = useState(remoteStore.getStoreMeta(primaryPath, parametersBean));

    const updateBean: UpdateBeanFunction<BEAN> = (uid, editor: BeanEditor<BEAN>) => {
        if (!data) throw new Error("store has not yet received any data or has been cleared: " + primaryPath);
        if (!data.has(uid)) throw new Error("uid: " + uid + " does not exist in store " + primaryPath);
        remoteStore.updateBean(primaryPath, parametersBean, editor(data.get(uid)! as BEAN));
    }

    const insertBean: InsertBeanFunction<BEAN> = (payload) => {
        remoteStore.insertBean(primaryPath, parametersBean, payload);
    }

    const removeBean: RemoveBeanFunction = (key) => {
        remoteStore.removeBean(primaryPath, parametersBean ?? null, key);
    }

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const storeId = createStoreId(primaryPath, parametersBean);

    const paramString = JSON.stringify(params);

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

export const useRemoteStoreSingleton = <BEAN extends AbstractStoreBean>(
    id: string | null,
    primaryPath: Array<string>,
    params?: AbstractStoreParametersBean | null,
    callback?: (data: Map<string, BEAN> | undefined) => void,
    dependency?: any,
    connectionMetaRef?: ConnectionMetaRef,
    setConnectionMeta?: ConnectionMetaSetter,
    optional?: boolean
): RemoteStoreSingletonType<BEAN> => {
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
        data: res.data && res.data.size === 1 ? Array.from(res.data.values())[0] : (undefined as any),
        meta: res.meta,
        updateBean: res.updateBean, 
        insertBean: res.insertBean, 
        removeBean: res.removeBean
    }
    
};

export default useRemoteStore;
