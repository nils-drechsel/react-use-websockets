import { AbstractStoreBean, AbstractStoreParametersBean } from "../beans/Beans";
import { InsertBeanFunction, RemoveBeanFunction, StoreMeta, UpdateBeanFunction } from "./RemoteStore";
import { ConnectionMetaRef, ConnectionMetaSetter } from "./connectStore";
export interface MultiRemoteStoreType<BEAN extends AbstractStoreBean> {
    data: Map<string, Map<string, BEAN>>;
    meta: Map<string, StoreMeta>;
    updateBean: Map<string, UpdateBeanFunction<BEAN>>;
    insertBean: Map<string, InsertBeanFunction<BEAN>>;
    removeBean: Map<string, RemoveBeanFunction>;
}
export interface MultiRemoteStoreArrayType<BEAN extends AbstractStoreBean> {
    data: Map<string, Array<BEAN>>;
    meta: Map<string, StoreMeta>;
    updateBean: Map<string, UpdateBeanFunction<BEAN>>;
    insertBean: Map<string, InsertBeanFunction<BEAN>>;
    removeBean: Map<string, RemoveBeanFunction>;
}
export interface MultiRemoteStoreSingletonType<BEAN extends AbstractStoreBean> {
    data: Map<string, BEAN>;
    meta: Map<string, StoreMeta>;
    updateBean: Map<string, UpdateBeanFunction<BEAN>>;
    insertBean: Map<string, InsertBeanFunction<BEAN>>;
    removeBean: Map<string, RemoveBeanFunction>;
}
export declare const remap: <TYPE, RESULT>(m: Map<string, TYPE>, fn: (key: string, value: TYPE) => RESULT) => Map<string, RESULT>;
export declare const useMultiRemoteStores: <BEAN extends AbstractStoreBean>(id: string | null, primaryPaths: Map<string, Array<string>>, params: Map<string, AbstractStoreParametersBean | null>, callbacks?: Map<string, (data: Map<string, BEAN> | undefined) => void> | undefined, dependency?: any, connectionMetaRefs?: Map<string, ConnectionMetaRef>, setConnectionMetas?: Map<string, ConnectionMetaSetter>, optional?: boolean) => MultiRemoteStoreType<BEAN>;
export declare const useMultiRemoteStoreArray: <BEAN extends AbstractStoreBean>(id: string | null, primaryPaths: Map<string, Array<string>>, params: Map<string, AbstractStoreParametersBean | null>, callbacks?: Map<string, (data: Map<string, BEAN> | undefined) => void> | undefined, dependency?: any, connectionMetaRefs?: Map<string, ConnectionMetaRef>, setConnectionMetas?: Map<string, ConnectionMetaSetter>, optional?: boolean) => MultiRemoteStoreArrayType<BEAN>;
export declare const useMultiRemoteStoreSingleton: <BEAN extends AbstractStoreBean>(id: string | null, primaryPaths: Map<string, Array<string>>, params: Map<string, AbstractStoreParametersBean | null>, callbacks?: Map<string, (data: Map<string, BEAN> | undefined) => void> | undefined, dependency?: any, connectionMetaRefs?: Map<string, ConnectionMetaRef>, setConnectionMetas?: Map<string, ConnectionMetaSetter>, optional?: boolean) => MultiRemoteStoreSingletonType<BEAN>;
export default useMultiRemoteStores;
