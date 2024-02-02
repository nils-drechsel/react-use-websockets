import { useEffect, useState } from "react";
import { StoreMeta } from "./RemoteStore";
import { AbstractIOBean, AbstractStoreParametersBean } from "./beans/Beans";
import { createStoreId } from "./beans/StoreBeanUtils";
import { ConnectionMetaSetter, ConnectionStateRef } from "./connectStore";
import { useGetRemoteStore } from "./useGetRemoteStore";

export const useRemoteStore = (
    id: string | null,
    primaryPath: Array<string>,
    secondaryPath: Array<string>,
    params?: AbstractStoreParametersBean | null,
    callback?: (data: Map<string, AbstractIOBean> | undefined) => void,
    dependency?: any,
    connectionMetaRef?: ConnectionStateRef,
    setConnectionMeta?: ConnectionMetaSetter
): [Map<string, any>, StoreMeta] => {
    const remoteStore = useGetRemoteStore(id);

    const [data, setData] = useState(remoteStore.getData(primaryPath, secondaryPath, params || null));
    const [storeMeta, setStoreMeta] = useState(remoteStore.getStoreMeta(primaryPath, secondaryPath, params || null));

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const storeId = createStoreId(primaryPath, secondaryPath, params);

    const paramString = params ? JSON.stringify(params) : null;

    if (connectionMetaRef && connectionMetaRef.current && !connectionMetaRef.current.has(storeId)) {
        connectionMetaRef.current.set(storeId, storeMeta);
    }

    useEffect(() => {

        if (dependencyFulfilled) {
            let setIncomingData = (incomingData: Map<string, AbstractIOBean>): void => {
                setData(incomingData);
            };

            if (callback) {
                setIncomingData = (incomingData: Map<string, AbstractIOBean>): void => {
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

            const deregister = remoteStore.register(primaryPath, secondaryPath, params || null, setIncomingData, setMeta);

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

    return [data as any, storeMeta];
};


export const useRemoteStoreArray = (
    id: string | null,
    primaryPath: Array<string>,
    secondaryPath: Array<string>,
    params?: AbstractStoreParametersBean | null,
    dependency?: any
): [Array<any>, StoreMeta] => {
    const [data, meta] = useRemoteStore(
        id,
        primaryPath,
        secondaryPath,
        params,
        undefined,
        dependency
    );

    return [data ? Array.from(data.values()) : (undefined as any), meta];
};

export default useRemoteStore;
