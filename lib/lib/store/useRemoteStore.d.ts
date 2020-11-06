import { Dispatch, SetStateAction } from "react";
import { AbstractWebSocketBean, StoreParametersBean } from "./beans/Beans";
declare class RemoteStoreAccessor {
    path: Array<string>;
    params: StoreParametersBean | null;
    dataCallbackFunction?: (data: Map<string, AbstractWebSocketBean> | undefined) => void;
    dependencyItem?: any;
    dependentFunction?: Dispatch<SetStateAction<AbstractWebSocketBean>>;
    constructor(path: Array<string>, params?: StoreParametersBean | null);
    dataCallback(dataCallbackFunction: (data: Map<string, AbstractWebSocketBean> | undefined) => void): RemoteStoreAccessor;
    dependency(dependencyItem?: AbstractWebSocketBean): RemoteStoreAccessor;
    dependent(dependentFunction?: Dispatch<SetStateAction<AbstractWebSocketBean>>): void;
    map(): Map<string, AbstractWebSocketBean> | undefined;
    single(): AbstractWebSocketBean | undefined;
    array(): Array<AbstractWebSocketBean> | undefined;
}
export declare const useRemoteStoreAccess: (path: string[], params: StoreParametersBean | null) => RemoteStoreAccessor;
export declare const useRemoteStore: (path: string[], params?: StoreParametersBean | null | undefined, callback?: ((data: Map<string, AbstractWebSocketBean> | undefined) => void) | undefined, dependency?: any) => Map<string, any>;
export declare const useRemoteSingleStore: (path: string[], params?: StoreParametersBean | null | undefined, updateDependent?: Dispatch<SetStateAction<AbstractWebSocketBean>> | undefined, dependency?: any) => any;
export declare const useRemoteStoreArray: (path: string[], params?: StoreParametersBean | null | undefined, dependency?: any) => any[];
export default useRemoteStore;
