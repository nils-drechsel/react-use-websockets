import { UnsubscribeCallback, WebSocketManager } from "../client/WebSocketManager";
import Deserialiser from "../client/serialisation/Deserialisation";
import Serialiser, { BeanSerialisationSignature } from "../client/serialisation/Serialisation";
import { AbstractIOBean, AbstractStoreParametersBean, StoreConnectionErrorBean, StoreValidationMessageBean } from "./beans/Beans";
import { ValidationTimeoutCallback, ValidationTimeoutCallbackWithState } from "./beans/StoreBeanUtils";
declare enum SubscriberType {
    FULL = 0,
    UPDATE = 1
}
interface Subscriber<FRAGMENT extends AbstractIOBean> {
    type: SubscriberType;
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
export interface UpdateBeanFunction<FRAGMENT extends AbstractIOBean> {
    (payload: FRAGMENT, callback?: ValidationTimeoutCallbackWithState): void;
}
export interface InsertBeanFunction<FRAGMENT extends AbstractIOBean> {
    (payload: FRAGMENT, callback?: ValidationTimeoutCallbackWithState): void;
}
export interface RemoveBeanFunction {
    (key: string, callback?: ValidationTimeoutCallbackWithState): void;
}
interface ClientStore<FRAGMENT extends AbstractIOBean> {
    meta: StoreMeta;
    data: Map<string, FRAGMENT> | undefined;
}
export declare class RemoteStore<FRAGMENT extends AbstractIOBean> {
    clientStore: Map<string, ClientStore<FRAGMENT>>;
    transactionCallbacks: Map<string, ValidationTimeoutCallback>;
    subscribers: Map<string, Map<string, Subscriber<FRAGMENT>>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;
    connectedListener: UnsubscribeCallback;
    connectionErrorListener: UnsubscribeCallback;
    validationListener: UnsubscribeCallback;
    serialiser: Serialiser;
    deserialiser: Deserialiser;
    constructor(websocketManager: WebSocketManager, serialisationSignatures?: Map<string, BeanSerialisationSignature>);
    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback, UnsubscribeCallback];
    releaseRemoteStore(): void;
    openRemoteStore(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, optional: boolean): void;
    closeRemoteStore(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null): void;
    getData(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null): Map<String, FRAGMENT> | undefined;
    getStoreMeta(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, initialOptional?: boolean): StoreMeta;
    register(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, setData: (data: Map<string, FRAGMENT>) => void, setMeta: (meta: StoreMeta) => void, update: boolean, optional: boolean): () => void;
    deregister(primaryPath: Array<string>, secondaryPath: Array<string>, id: string, params: AbstractStoreParametersBean | null): void;
    createTransactionId(): string;
    addValidationCallback(transactionId: string, validationCallback: ValidationTimeoutCallbackWithState): void;
    updateBean(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, payload: FRAGMENT, validationCallback?: ValidationTimeoutCallbackWithState): void;
    insertBean(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, payload: FRAGMENT, validationCallback?: ValidationTimeoutCallbackWithState): void;
    removeBean(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, key: string, validationCallback?: ValidationTimeoutCallbackWithState): void;
    clear(storeId: string): void;
    storeConnected(storeId: string): void;
    storeConnectionError(storeId: string, errorBean: StoreConnectionErrorBean): void;
    storeValidation(storeId: string, validationMessageBean: StoreValidationMessageBean): void;
    update(storeId: string, data: Map<string, AbstractIOBean>, initial: boolean): void;
}
export {};
