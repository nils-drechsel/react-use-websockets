import { useEffect, useState, useContext } from "react"
import RemoteStoreContext from "./RemoteStoreContext";
import { RemoteStore } from "./RemoteStore";
import { useWebSocket } from "../client/useWebSocket";
import { UpdateFunction, SetFunction, EditRemoteStoreFunction } from "./beans/StoreBeanUtils";
import { ValidationBean, CoreMessage, AbstractWebSocketBean } from "./beans/StoreBeans";
import { v4 as uuidv4 } from 'uuid';

class RemoteStoreAccessor {

    path: Array<string>;
    params: Array<string> = [];
    dataCallbackFunction?: (data: Map<string, AbstractWebSocketBean> | undefined) => void = undefined;
    dependencyItem?: any = undefined;
    dependentFunction?: SetFunction<AbstractWebSocketBean>

    constructor(path: Array<string>, params?: Array<string>) {
        this.path = path;
        if (params) this.params = params;
    }

    dataCallback(dataCallbackFunction: (data: Map<string, AbstractWebSocketBean> | undefined) => void) : RemoteStoreAccessor {
        this.dataCallbackFunction = dataCallbackFunction;
        return this;
    }

    dependency(dependencyItem?: AbstractWebSocketBean) : RemoteStoreAccessor {
        this.dependencyItem = dependencyItem;
        return this;
    }

    dependent(dependentFunction?: SetFunction<AbstractWebSocketBean>) {
        this.dependentFunction = dependentFunction;
    }


    map(): Map<string, AbstractWebSocketBean> | undefined {
        
        return useRemoteStore(this.path, this.params, this.dataCallbackFunction);

    }

    single(): AbstractWebSocketBean | undefined {
        
        return useRemoteSingleStore(this.path, this.params, this.dependentFunction, this.dependencyItem);

    }

    array(): Array<AbstractWebSocketBean> | undefined {
        
        return useRemoteStoreArray(this.path, this.params, this.dependencyItem);

    }

}

export const useRemoteStoreAccess = (path: Array<string>, params: Array<string>): RemoteStoreAccessor => {

    const [accessor] = useState(new RemoteStoreAccessor(path, params));
    return accessor;
}



export const useRemoteStore = (path: Array<string>, params?: Array<string>, callback?: (data: Map<string, AbstractWebSocketBean> | undefined) => void, dependency?: any):
    Map<string, AbstractWebSocketBean> | undefined => {

    const remoteStore = useContext(RemoteStoreContext) as unknown as RemoteStore;
    const { listen, send } = useWebSocket();

    const [data, setData] = useState(remoteStore.getData(path, params || []));
    const [validation, setValidation] = useState(null as ValidationBean | null);

    const dependencyFulfilled = dependency === undefined || !!dependency;

    const pathId = path.join("/");

    useEffect(() => {

        if (dependencyFulfilled) {

            let setIncomingData = setData as (incomingData: Map<string, AbstractWebSocketBean>) => void;

            if (callback) {
                setIncomingData = (incomingData: Map<string, AbstractWebSocketBean>): void => {
                    setData(incomingData);
                    callback(incomingData);
                };
            }

            const deregister = remoteStore.register(path, params || [], setIncomingData);


            return () => {
                deregister();
                setData(undefined);
                if (callback) callback(undefined);
            }
        }

        return () => {
            // do nothing in the case we wait for dependencies fulfilled
        }

    }, [dependencyFulfilled, pathId]);


    return data;

}

export const useRemoteSingleStore = (path: Array<string>, params?: Array<string>, updateDependent?: SetFunction<AbstractWebSocketBean>, dependency?: any):
    AbstractWebSocketBean | undefined => {

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

    const data : Map<string, AbstractWebSocketBean> | undefined = useRemoteStore(path, params, callback, dependency);

    return data && data.size > 0 ? Array.from(data.values())[0] : undefined;

}



export const useRemoteStoreArray = (path: Array<string>, params?: Array<string>, dependency?: any):
    Array<AbstractWebSocketBean> | undefined => {

    const data: Map<string, AbstractWebSocketBean> | undefined = useRemoteStore(path, params, dependency);

    return data ? Array.from(data.values()) : undefined;

}


export default useRemoteStore;