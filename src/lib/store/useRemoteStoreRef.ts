import { useEffect, Dispatch, SetStateAction, useRef, MutableRefObject } from "react";
import { AbstractWebSocketBean, ReadableStoreParametersBean } from "./beans/Beans";
import { useVariable } from "react-use-variable";
import { ConnectionStateRef, ConnectionStateSetter } from "./connectStore";
import { useGetRemoteStore } from "./useGetRemoteStore";

export const useRemoteStoreRef = (
    id: string | null,
    path: Array<string>,
    params?: ReadableStoreParametersBean | null,
    callback?: (data: Map<string, AbstractWebSocketBean> | undefined) => void,
    dependency?: any,
    connectionStateRef?: ConnectionStateRef,
    setConnectionState?: ConnectionStateSetter
): MutableRefObject<Map<string, any>> => {
    const remoteStore = useGetRemoteStore(id);

    const dataRef = useRef(remoteStore.getData(path, params || null) as Map<string, AbstractWebSocketBean>);

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const pathId = path.join("/");

    const paramString = params ? JSON.stringify(params) : null;

    if (connectionStateRef && connectionStateRef.current && !connectionStateRef.current.has(pathId)) {
        connectionStateRef.current.set(pathId, dataRef.current !== undefined);
    }

    useEffect(() => {
        const setThisConnectionState = (s: boolean) => {
            if (connectionStateRef && connectionStateRef.current.get(pathId) !== s) {
                if (setConnectionState)
                    setConnectionState((state: Map<string, boolean>) => {
                        const newState = new Map(state);
                        newState.set(pathId, s);
                        return newState;
                    });
            }
        };

        if (dataRef.current === undefined) {
            setThisConnectionState(false);
        } else {
            setThisConnectionState(true);
        }

        if (dependencyFulfilled) {
            let setIncomingData = (incomingData: Map<string, AbstractWebSocketBean>) => {
                setThisConnectionState(true);
                dataRef.current = incomingData;
            };

            if (callback) {
                setIncomingData = (incomingData: Map<string, AbstractWebSocketBean>): void => {
                    setThisConnectionState(true);
                    dataRef.current = incomingData;
                    callback(incomingData);
                };
            }

            const deregister = remoteStore.register(path, params || null, setIncomingData);

            return () => {
                deregister();
                dataRef.current = undefined as any;
                if (callback) callback(undefined);
            };
        }

        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        };
    }, [dependencyFulfilled, pathId, paramString]);

    return dataRef;
};

export const useRemoteSingleStoreRef = (
    id: string | null,
    path: Array<string>,
    params?: ReadableStoreParametersBean | null,
    updateDependent?: Dispatch<SetStateAction<AbstractWebSocketBean>>,
    dependency?: any,
    connectionStateRef?: ConnectionStateRef,
    setConnectionState?: ConnectionStateSetter
): MutableRefObject<any> => {
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

    const dataRef: MutableRefObject<Map<string, AbstractWebSocketBean> | undefined> = useRemoteStoreRef(
        id,
        path,
        params,
        callback,
        dependency,
        connectionStateRef,
        setConnectionState
    );

    const singleDataRef = useVariable(
        dataRef.current && dataRef.current.size > 0 ? Array.from(dataRef.current.values())[0] : undefined
    );

    return singleDataRef;
};

export const useRemoteStoreArrayRef = (
    id: string | null,
    path: Array<string>,
    params?: ReadableStoreParametersBean | null,
    dependency?: any,
    connectionStateRef?: ConnectionStateRef,
    setConnectionState?: ConnectionStateSetter
): MutableRefObject<Array<any>> => {
    const dataRef: MutableRefObject<Map<string, AbstractWebSocketBean> | undefined> = useRemoteStoreRef(
        id,
        path,
        params,
        undefined,
        dependency,
        connectionStateRef,
        setConnectionState
    );

    const arrayDataRef = useVariable(dataRef.current ? Array.from(dataRef.current.values()) : (undefined as any));
    return arrayDataRef;
};

export default useRemoteStoreRef;
