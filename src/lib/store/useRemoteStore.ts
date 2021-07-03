import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { AbstractWebSocketBean, ReadableStoreParametersBean } from "./beans/Beans";
import { useGetRemoteStore } from "./useGetRemoteStore";

export const useRemoteStore = (
    id: string | null,
    path: Array<string>,
    params?: ReadableStoreParametersBean | null,
    callback?: (data: Map<string, AbstractWebSocketBean> | undefined) => void,
    dependency?: any
): Map<string, any> => {
    const remoteStore = useGetRemoteStore(id);

    const [data, setData] = useState(remoteStore.getData(path, params || null));

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const pathId = path.join("/");

    const paramString = params ? JSON.stringify(params) : null;

    useEffect(() => {
        if (dependencyFulfilled) {
            let setIncomingData = setData as (incomingData: Map<string, AbstractWebSocketBean>) => void;

            if (callback) {
                setIncomingData = (incomingData: Map<string, AbstractWebSocketBean>): void => {
                    setData(incomingData);
                    callback(incomingData);
                };
            }

            const deregister = remoteStore.register(path, params || null, setIncomingData);

            return () => {
                deregister();
                setData(undefined);
                if (callback) callback(undefined);
            };
        }

        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        };
    }, [dependencyFulfilled, pathId, paramString]);

    return data as any;
};

export const useRemoteSingleStore = (
    id: string | null,
    path: Array<string>,
    params?: ReadableStoreParametersBean | null,
    updateDependent?: Dispatch<SetStateAction<AbstractWebSocketBean>>,
    dependency?: any
): any => {
    let callback = undefined;

    if (updateDependent) {
        callback = (incomingData: Map<string, AbstractWebSocketBean> | undefined): void => {
            const item = incomingData && incomingData.size > 0 ? Array.from(incomingData.values())[0] : null;
            updateDependent((old: any) => {
                if (incomingData === undefined) return undefined;
                if (old === null || old === undefined) {
                    return item;
                } else {
                    return Object.assign({}, old, item);
                }
            });
        };
    }

    const data: Map<string, AbstractWebSocketBean> | undefined = useRemoteStore(id, path, params, callback, dependency);

    return data && data.size > 0 ? Array.from(data.values())[0] : undefined;
};

export const useRemoteStoreArray = (
    id: string | null,
    path: Array<string>,
    params?: ReadableStoreParametersBean | null,
    dependency?: any
): Array<any> => {
    const data: Map<string, AbstractWebSocketBean> | undefined = useRemoteStore(
        id,
        path,
        params,
        undefined,
        dependency
    );

    return data ? Array.from(data.values()) : (undefined as any);
};

export default useRemoteStore;
