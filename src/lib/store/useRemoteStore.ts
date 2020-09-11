import { useEffect, useState, useContext } from "react"
import RemoteStoreContext from "./RemoteStoreContext";
import { RemoteStore } from "./RemoteStore";
import { useWebSocket } from "../client/useWebSocket";
import { UpdateFunction, SetFunction } from "./beans/StoreBeanUtils";


export const useRemoteStore = (path: Array<string>, callback?: (data: Map<string, any>) => void, dependency?: any): Map<string, any> | undefined => {

    const remoteStore = useContext(RemoteStoreContext) as unknown as RemoteStore;
    const { listen, send } = useWebSocket();

    const [data, setData] = useState(remoteStore.getData(path));

    const dependencyFulfilled = dependency === undefined || !!dependency;

    useEffect(() => {

        if (dependencyFulfilled) {

            let setIncomingData = setData;

            if (callback) {
                setIncomingData = (incomingData: any): void => {
                    setData(incomingData);
                    callback(incomingData);
                };
            }

            const deregister = remoteStore.register(path, setIncomingData);

            return () => {
                deregister();
            }
        }

        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        }

    }, [dependencyFulfilled]);


    return data;

}

export const useRemoteSingleStore = (path: Array<string>, updateDependent?: SetFunction<any>, dependency?: any): any | undefined => {

    let callback = undefined;

    if (updateDependent) {
        callback = (incomingData: Map<string, any>): void => {
            const item = incomingData && incomingData.size > 0 ? Array.from(incomingData.values())[0] : null;
            updateDependent((old) => {
                if (old === null || old === undefined) {
                    return item;
                } else {
                    return Object.assign({}, old, incomingData);
                }
            })
        }
    }

    const data: Map<string, any> | undefined = useRemoteStore(path, callback, dependency);

    return data && data.size > 0 ? Array.from(data.values())[0] : undefined;

}



export const useRemoteStoreArray = (path: Array<string>, dependency?: any): Array<any> | undefined => {

    const data: Map<string, any> | undefined = useRemoteStore(path, dependency);

    return data ? Array.from(data.values()) : undefined;

}


export default useRemoteStore;