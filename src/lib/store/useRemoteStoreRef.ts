import { useEffect, useContext, Dispatch, SetStateAction, useRef, MutableRefObject } from "react"
import RemoteStoreContext from "./RemoteStoreContext";
import { RemoteStore } from "./RemoteStore";
import { AbstractWebSocketBean, StoreParametersBean } from "./beans/Beans";
import { useVariable } from "react-use-variable";
import { ConnectionStateRef, ConnectionStateSetter } from "./connectStore";


export const useRemoteStoreRef = (path: Array<string>, params?: StoreParametersBean | null, callback?: (data: Map<string, AbstractWebSocketBean> | undefined) => void, dependency?: any, connectionStateRef?: ConnectionStateRef, setConnectionState?: ConnectionStateSetter):
    MutableRefObject<Map<string, any>> => {

    const remoteStore = useContext(RemoteStoreContext) as unknown as RemoteStore;

    const dataRef = useRef(remoteStore.getData(path, params || null) as Map<string, AbstractWebSocketBean>);

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const pathId = path.join("/");

    useEffect(() => {

        const setThisConnectionState = (s: boolean) => {
            if (connectionStateRef && connectionStateRef.current.get(pathId) !== s) {
                if (setConnectionState) setConnectionState((state: Map<string, boolean>) => {
                    console.log("Setting new connection state", pathId, s);

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
            }

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
            }
        }

        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        }

    }, [dependencyFulfilled, pathId]);


    return dataRef;

}

export const useRemoteSingleStoreRef = (path: Array<string>, params?: StoreParametersBean | null, updateDependent?: Dispatch<SetStateAction<AbstractWebSocketBean>>, dependency?: any, connectionStateRef?: ConnectionStateRef, setConnectionState?: ConnectionStateSetter):
    MutableRefObject<any> => {

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
            })
        }
    }

    const dataRef: MutableRefObject<Map<string, AbstractWebSocketBean> | undefined> = useRemoteStoreRef(path, params, callback, dependency, connectionStateRef, setConnectionState);
    
    const singleDataRef = useVariable(dataRef.current && dataRef.current.size > 0 ? Array.from(dataRef.current.values())[0] : undefined)

    return singleDataRef;

}



export const useRemoteStoreArrayRef = (path: Array<string>, params?: StoreParametersBean | null, dependency?: any, connectionStateRef?: ConnectionStateRef, setConnectionState?: ConnectionStateSetter):
    MutableRefObject<Array<any>> => {

    const dataRef: MutableRefObject<Map<string, AbstractWebSocketBean> | undefined> = useRemoteStoreRef(path, params, undefined, dependency, connectionStateRef, setConnectionState);

    const arrayDataRef = useVariable(dataRef.current ? Array.from(dataRef.current.values()) : undefined as any)
    return arrayDataRef;
}


export default useRemoteStoreRef;