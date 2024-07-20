import { AbstractIOBean, AbstractStoreBean, AbstractStoreParametersBean, FragmentUpdateBean, StoreConnectionErrorBean } from "../beans/Beans";
import { UnsubscribeCallback, WebSocketManager } from "../client/WebSocketManager";
interface Subscriber<FRAGMENT extends AbstractIOBean> {
    dataCallback: (data: Map<string, FRAGMENT>) => void;
    metaCallback: (meta: StoreMeta) => void;
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
export interface UpdateBeanFunction<BEAN extends AbstractIOBean> {
    (payload: BEAN): void;
}
export interface InsertBeanFunction<BEAN extends AbstractIOBean> {
    (payload: BEAN): void;
}
export interface RemoveBeanFunction {
    (key: string): void;
}
interface ClientStore<BEAN extends AbstractStoreBean> {
    meta: StoreMeta;
    data: Map<string, BEAN> | undefined;
}
export declare class RemoteStore<BEAN extends AbstractStoreBean> {
    clientStore: Map<string, ClientStore<BEAN>>;
    subscribers: Map<string, Map<string, Subscriber<BEAN>>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;
    connectedListener: UnsubscribeCallback;
    connectionErrorListener: UnsubscribeCallback;
    constructor(websocketManager: WebSocketManager);
    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback];
    releaseRemoteStore(): void;
    openRemoteStore(primaryPath: Array<string>, params: AbstractStoreParametersBean, optional: boolean): void;
    closeRemoteStore(primaryPath: Array<string>, params: AbstractStoreParametersBean): void;
    getData(primaryPath: Array<string>, params: AbstractStoreParametersBean | null): Map<String, BEAN> | undefined;
    getStoreMeta(primaryPath: Array<string>, params: AbstractStoreParametersBean | null, initialOptional?: boolean): StoreMeta;
    register(primaryPath: Array<string>, params: AbstractStoreParametersBean, setData: (data: Map<string, BEAN>) => void, setMeta: (meta: StoreMeta) => void, optional: boolean): () => void;
    deregister(primaryPath: Array<string>, id: string, params: AbstractStoreParametersBean): void;
    updateBean(primaryPath: Array<string>, params: AbstractStoreParametersBean, payload: BEAN): void;
    insertBean(primaryPath: Array<string>, params: AbstractStoreParametersBean, payload: BEAN): void;
    removeBean(primaryPath: Array<string>, params: AbstractStoreParametersBean, key: string): void;
    clear(storeId: string): void;
    storeConnected(storeId: string): void;
    storeConnectionError(storeId: string, errorBean: StoreConnectionErrorBean): void;
    update(storeId: string, updateBean: FragmentUpdateBean): void;
}
export {};
