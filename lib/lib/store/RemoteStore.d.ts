import { UnsubscribeCallback, WebSocketManager } from "../client/WebSocketManager";
import Deserialiser from "../client/serialisation/Deserialisation";
import Serialiser, { BeanSerialisationSignature } from "../client/serialisation/Serialisation";
import { AbstractIOBean, AbstractStoreParametersBean } from "./beans/Beans";
declare enum SubscriberType {
    FULL = 0,
    UPDATE = 1
}
interface Subscriber {
    type: SubscriberType;
    callback: (data: Map<string, AbstractIOBean>) => void;
}
interface ClientStore {
    data: Map<string, AbstractIOBean> | undefined;
}
export declare class RemoteStore {
    clientStore: Map<string, ClientStore>;
    subscribers: Map<string, Map<string, Subscriber>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;
    serialiser: Serialiser;
    deserialiser: Deserialiser;
    constructor(websocketManager: WebSocketManager, serialisationSignatures?: Map<string, BeanSerialisationSignature>);
    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback];
    releaseRemoteStore(): void;
    openRemoteStore(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null): void;
    closeRemoteStore(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null): void;
    getData(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null): Map<String, AbstractIOBean> | undefined;
    register(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, setData: (data: Map<string, AbstractIOBean>) => void, update?: boolean): () => void;
    deregister(primaryPath: Array<string>, secondaryPath: Array<string>, id: string, params: AbstractStoreParametersBean | null): void;
    updateBean(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, payload: AbstractIOBean, origin: string): void;
    insertBean(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, payload: AbstractIOBean, origin: string): void;
    removeBean(primaryPath: Array<string>, secondaryPath: Array<string>, params: AbstractStoreParametersBean | null, key: string, origin: string): void;
    clear(storeId: string): void;
    update(storeId: string, data: {
        [key: string]: AbstractIOBean;
    }): void;
}
export {};
