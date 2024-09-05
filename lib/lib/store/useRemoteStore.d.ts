import { AbstractStoreBean, AbstractStoreParametersBean } from "../beans/Beans";
import { InsertBeanFunction, RemoveBeanFunction, StoreMeta, UpdateBeanFunction } from "./RemoteStore";
import { ConnectionMetaRef, ConnectionMetaSetter } from "./connectStore";
export interface RemoteStoreType<BEAN extends AbstractStoreBean> {
    data: Map<string, BEAN>;
    meta: StoreMeta;
    updateBean: UpdateBeanFunction<BEAN>;
    insertBean: InsertBeanFunction<BEAN>;
    removeBean: RemoveBeanFunction;
}
export interface RemoteStoreArrayType<BEAN extends AbstractStoreBean> {
    data: Array<BEAN>;
    meta: StoreMeta;
    updateBean: UpdateBeanFunction<BEAN>;
    insertBean: InsertBeanFunction<BEAN>;
    removeBean: RemoveBeanFunction;
}
export interface RemoteStoreSingletonType<BEAN extends AbstractStoreBean> {
    data: BEAN;
    meta: StoreMeta;
    updateBean: UpdateBeanFunction<BEAN>;
    insertBean: InsertBeanFunction<BEAN>;
    removeBean: RemoveBeanFunction;
}
export declare const useRemoteStore: <BEAN extends AbstractStoreBean>(id: string | null, primaryPath: Array<string>, params?: AbstractStoreParametersBean | null, callback?: ((data: Map<string, BEAN> | undefined) => void) | undefined, dependency?: any, connectionMetaRef?: ConnectionMetaRef, setConnectionMeta?: ConnectionMetaSetter, optional?: boolean) => RemoteStoreType<BEAN>;
export declare const useRemoteStoreArray: <BEAN extends AbstractStoreBean>(id: string | null, primaryPath: Array<string>, params?: AbstractStoreParametersBean | null, callback?: ((data: Map<string, BEAN> | undefined) => void) | undefined, dependency?: any, connectionMetaRef?: ConnectionMetaRef, setConnectionMeta?: ConnectionMetaSetter, optional?: boolean) => RemoteStoreArrayType<BEAN>;
export declare const useRemoteStoreSingleton: <BEAN extends AbstractStoreBean>(id: string | null, primaryPath: Array<string>, params?: AbstractStoreParametersBean | null, callback?: ((data: Map<string, BEAN> | undefined) => void) | undefined, dependency?: any, connectionMetaRef?: ConnectionMetaRef, setConnectionMeta?: ConnectionMetaSetter, optional?: boolean) => RemoteStoreSingletonType<BEAN>;
export default useRemoteStore;
