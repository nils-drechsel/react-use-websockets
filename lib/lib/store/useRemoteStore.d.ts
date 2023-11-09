import { AbstractIOBean, AbstractStoreParametersBean } from "./beans/Beans";
import { ConnectionStateRef, ConnectionStateSetter } from "./connectStore";
export declare const useRemoteStore: (id: string | null, primaryPath: Array<string>, secondaryPath: Array<string>, params?: AbstractStoreParametersBean | null, callback?: ((data: Map<string, AbstractIOBean> | undefined) => void) | undefined, dependency?: any, connectionStateRef?: ConnectionStateRef, setConnectionState?: ConnectionStateSetter) => Map<string, any>;
export declare const useRemoteStoreArray: (id: string | null, primaryPath: Array<string>, secondaryPath: Array<string>, params?: AbstractStoreParametersBean | null, dependency?: any) => Array<any>;
export default useRemoteStore;
