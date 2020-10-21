import { SetFunction } from "./beans/StoreBeanUtils";
import { AbstractWebSocketBean } from "./beans/StoreBeans";
declare class RemoteStoreAccessor {
    path: Array<string>;
    params: Array<string>;
    dataCallbackFunction?: (data: Map<string, AbstractWebSocketBean> | undefined) => void;
    dependencyItem?: any;
    dependentFunction?: SetFunction<AbstractWebSocketBean>;
    constructor(path: Array<string>, params?: Array<string>);
    dataCallback(dataCallbackFunction: (data: Map<string, AbstractWebSocketBean> | undefined) => void): RemoteStoreAccessor;
    dependency(dependencyItem?: AbstractWebSocketBean): RemoteStoreAccessor;
    dependent(dependentFunction?: SetFunction<AbstractWebSocketBean>): void;
    map(): Map<string, AbstractWebSocketBean> | undefined;
    single(): AbstractWebSocketBean | undefined;
    array(): Array<AbstractWebSocketBean> | undefined;
}
export declare const useRemoteStoreAccess: (path: string[], params: string[]) => RemoteStoreAccessor;
export declare const useRemoteStore: (path: string[], params?: string[] | undefined, callback?: ((data: Map<string, AbstractWebSocketBean> | undefined) => void) | undefined, dependency?: any) => Map<string, AbstractWebSocketBean> | undefined;
export declare const useRemoteSingleStore: (path: string[], params?: string[] | undefined, updateDependent?: SetFunction<AbstractWebSocketBean> | undefined, dependency?: any) => AbstractWebSocketBean | undefined;
export declare const useRemoteStoreArray: (path: string[], params?: string[] | undefined, dependency?: any) => AbstractWebSocketBean[] | undefined;
export default useRemoteStore;
