import { useEffect, useState } from "react";
import { AbstractIOBean, AbstractStoreParametersBean } from "./beans/Beans";
import { createStoreId } from "./beans/StoreBeanUtils";
import { ConnectionStateRef, ConnectionStateSetter } from "./connectStore";
import { useGetRemoteStore } from "./useGetRemoteStore";

export const useRemoteStore = (
    id: string | null,
    primaryPath: Array<string>,
    secondaryPath: Array<string>,
    params?: AbstractStoreParametersBean | null,
    callback?: (data: Map<string, AbstractIOBean> | undefined) => void,
    dependency?: any,
    connectionStateRef?: ConnectionStateRef,
    setConnectionState?: ConnectionStateSetter
): Map<string, any> => {
    const remoteStore = useGetRemoteStore(id);

    const [data, setData] = useState(remoteStore.getData(primaryPath, secondaryPath, params || null));

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const storeId = createStoreId(primaryPath, secondaryPath, params);

    const paramString = params ? JSON.stringify(params) : null;

    if (connectionStateRef && connectionStateRef.current && !connectionStateRef.current.has(storeId)) {
        connectionStateRef.current.set(storeId, data !== undefined);
    }

    useEffect(() => {

        const setThisConnectionState = (s: boolean) => {
            if (connectionStateRef && connectionStateRef.current.get(storeId) !== s) {
                if (setConnectionState)
                    setConnectionState((state: Map<string, boolean>) => {
                        const newState = new Map(state);
                        newState.set(storeId, s);
                        return newState;
                    });
            }
        };

        if (data === undefined) {
            setThisConnectionState(false);
        } else {
            setThisConnectionState(true);
        }

        if (dependencyFulfilled) {
            let setIncomingData = (incomingData: Map<string, AbstractIOBean>): void => {
                setData(incomingData);
                setThisConnectionState(true);
            };

            if (callback) {
                setIncomingData = (incomingData: Map<string, AbstractIOBean>): void => {
                    setData(incomingData);
                    callback(incomingData);
                    setThisConnectionState(true);
                };
            }

            const deregister = remoteStore.register(primaryPath, secondaryPath, params || null, setIncomingData);

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

    return data as any;
};


export const useRemoteStoreArray = (
    id: string | null,
    primaryPath: Array<string>,
    secondaryPath: Array<string>,
    params?: AbstractStoreParametersBean | null,
    dependency?: any
): Array<any> => {
    const data: Map<string, AbstractIOBean> | undefined = useRemoteStore(
        id,
        primaryPath,
        secondaryPath,
        params,
        undefined,
        dependency
    );

    return data ? Array.from(data.values()) : (undefined as any);
};

export default useRemoteStore;
