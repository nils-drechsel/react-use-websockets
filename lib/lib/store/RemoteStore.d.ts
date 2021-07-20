import Deserialiser from "../client/serialisation/Deserialisation";
import Serialiser, { BeanSerialisationSignature } from "../client/serialisation/Serialisation";
import { WebSocketManager, UnsubscribeCallback } from "../client/WebSocketManager";
import { AbstractWebSocketBean, WritableStoreParametersBean, ReadableStoreParametersBean } from "./beans/Beans";
declare enum SubscriberType {
    FULL = 0,
    UPDATE = 1
}
interface Subscriber {
    type: SubscriberType;
    callback: (data: Map<string, AbstractWebSocketBean>) => void;
}
interface ClientStore {
    data: Map<string, AbstractWebSocketBean> | undefined;
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
    openRemoteStore(path: Array<string>, params: ReadableStoreParametersBean | null): void;
    closeRemoteStore(path: Array<string>, params: ReadableStoreParametersBean | null): void;
    getData(path: Array<string>, params: ReadableStoreParametersBean | null): Map<String, AbstractWebSocketBean> | undefined;
    register(path: Array<string>, params: ReadableStoreParametersBean | null, setData: (data: Map<string, AbstractWebSocketBean>) => void, update?: boolean): () => void;
    deregister(path: Array<string>, id: string, params: ReadableStoreParametersBean | null): void;
    editRemoteStore(msg: string, path: Array<string>, params: WritableStoreParametersBean | null, payload: AbstractWebSocketBean, originId: string): void;
    clear(storeId: string): void;
    update(storeId: string, data: {
        [key: string]: AbstractWebSocketBean;
    }): void;
}
export {};
