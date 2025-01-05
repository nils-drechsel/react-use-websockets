import { AbstractStoreBean, AbstractStoreParametersBean, FragmentUpdateBean, StoreConnectionErrorBean } from "../beans/Beans";
import { UnsubscribeCallback, WebSocketManager } from "../client/WebSocketManager";
interface Subscriber<BEAN extends AbstractStoreBean> {
    dataCallback: (data: Map<string, BEAN>) => void;
    metaCallback: (meta: StoreMeta) => void;
}
export declare class SessionError extends Error {
    constructor(message: string);
}
export declare class AsynchronicityError extends Error {
    constructor(message: string);
}
export declare enum StoreConnectionState {
    UNKNOWN = 0,
    CONNECTING = 1,
    CONNECTED = 2,
    READY = 3,
    ERROR = 4,
    ACCESS_DENIED = 5
}
export interface StoreMeta {
    optional: boolean;
    state: StoreConnectionState;
    errors: Array<string> | null;
}
export interface BeanEditor<BEAN> {
    (old: BEAN): BEAN;
}
export interface UpdateBeanFunction<BEAN extends AbstractStoreBean> {
    (uid: string, editor: BeanEditor<BEAN>): void;
}
export interface InsertBeanFunction<BEAN extends AbstractStoreBean> {
    (payload: BEAN): void;
}
export interface RemoveBeanFunction {
    (key: string): void;
}
interface ClientStore<BEAN extends AbstractStoreBean> {
    storeSessionId: string;
    meta: StoreMeta;
    data: Map<string, BeanCache<BEAN>> | undefined;
}
interface BeanCache<BEAN extends AbstractStoreBean> {
    items: Map<string, BEAN>;
    current: BEAN;
}
export declare class RemoteStore {
    clientStore: Map<string, ClientStore<AbstractStoreBean>>;
    subscribers: Map<string, Map<string, Subscriber<AbstractStoreBean>>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;
    connectedListener: UnsubscribeCallback;
    connectionErrorListener: UnsubscribeCallback;
    unsubscribePopulationListener: UnsubscribeCallback;
    constructor(websocketManager: WebSocketManager);
    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback];
    releaseRemoteStore(): void;
    openRemoteStore(primaryPath: Array<string>, params: AbstractStoreParametersBean, optional: boolean): void;
    closeRemoteStore(primaryPath: Array<string>, params: AbstractStoreParametersBean): void;
    getData(primaryPath: Array<string>, params: AbstractStoreParametersBean | null): Map<string, AbstractStoreBean> | undefined;
    getStoreMeta(primaryPath: Array<string>, params: AbstractStoreParametersBean | null, initialOptional?: boolean): StoreMeta;
    register<BEAN extends AbstractStoreBean>(primaryPath: Array<string>, params: AbstractStoreParametersBean, setData: (data: Map<string, BEAN>) => void, setMeta: (meta: StoreMeta) => void, optional: boolean): () => void;
    deregister(primaryPath: Array<string>, id: string, params: AbstractStoreParametersBean): void;
    updateBean(primaryPath: Array<string>, params: AbstractStoreParametersBean, payload: AbstractStoreBean): void;
    insertBean(primaryPath: Array<string>, params: AbstractStoreParametersBean, payload: AbstractStoreBean): void;
    removeBean(primaryPath: Array<string>, params: AbstractStoreParametersBean, key: string): void;
    checkStoreAccess(storeId: string, storeSessionId: string): void;
    clear(storeId: string, storeSessionId: string): void;
    storeConnected(storeId: string, storeSessionId: string): void;
    storeConnectionError(storeId: string, errorBean: StoreConnectionErrorBean, storeSessionId: string): void;
    consolidate<BEAN extends AbstractStoreBean>(store: ClientStore<BEAN>, key: string, version: string | undefined): void;
    hasInCache<BEAN extends AbstractStoreBean>(cache: BeanCache<BEAN> | undefined, version: string | undefined): boolean;
    update(storeId: string, updateBean: FragmentUpdateBean, storeSessionId: string): void;
}
export {};
