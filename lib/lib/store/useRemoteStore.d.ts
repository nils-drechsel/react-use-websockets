import { InsertBeanFunction, RemoveBeanFunction, StoreMeta, UpdateBeanFunction } from "./RemoteStore";
import { AbstractIOBean, AbstractStoreParametersBean } from "./beans/Beans";
import { ConnectionMetaRef, ConnectionMetaSetter } from "./connectStore";
export interface RemoteStoreType<FRAGMENT extends AbstractIOBean> {
    data: Map<string, FRAGMENT>;
    meta: StoreMeta;
    updateBean: UpdateBeanFunction<FRAGMENT>;
    insertBean: InsertBeanFunction<FRAGMENT>;
    removeBean: RemoveBeanFunction;
}
export interface RemoteStoreArrayType<FRAGMENT extends AbstractIOBean> {
    data: Array<FRAGMENT>;
    meta: StoreMeta;
    updateBean: UpdateBeanFunction<FRAGMENT>;
    insertBean: InsertBeanFunction<FRAGMENT>;
    removeBean: RemoveBeanFunction;
}
export declare const useRemoteStore: <FRAGMENT extends AbstractIOBean>(id: string | null, primaryPath: Array<string>, secondaryPath: Array<string>, params?: AbstractStoreParametersBean | null, callback?: ((data: Map<string, FRAGMENT> | undefined) => void) | undefined, dependency?: any, connectionMetaRef?: ConnectionMetaRef, setConnectionMeta?: ConnectionMetaSetter, optional?: boolean) => RemoteStoreType<FRAGMENT>;
export declare const useRemoteStoreArray: <FRAGMENT extends AbstractIOBean>(id: string | null, primaryPath: Array<string>, secondaryPath: Array<string>, params?: AbstractStoreParametersBean | null, callback?: ((data: Map<string, FRAGMENT> | undefined) => void) | undefined, dependency?: any, connectionMetaRef?: ConnectionMetaRef, setConnectionMeta?: ConnectionMetaSetter, optional?: boolean) => RemoteStoreArrayType<FRAGMENT>;
export default useRemoteStore;
