import { StoreMeta } from "./RemoteStore";
import { AbstractIOBean, AbstractStoreParametersBean } from "./beans/Beans";
import { ConnectionMetaSetter, ConnectionStateRef } from "./connectStore";
export declare const useRemoteStore: (id: string | null, primaryPath: Array<string>, secondaryPath: Array<string>, params?: AbstractStoreParametersBean | null, callback?: ((data: Map<string, AbstractIOBean> | undefined) => void) | undefined, dependency?: any, connectionMetaRef?: ConnectionStateRef, setConnectionMeta?: ConnectionMetaSetter) => [Map<string, any>, StoreMeta];
export declare const useRemoteStoreArray: (id: string | null, primaryPath: Array<string>, secondaryPath: Array<string>, params?: AbstractStoreParametersBean | null, dependency?: any) => [Array<any>, StoreMeta];
export default useRemoteStore;
