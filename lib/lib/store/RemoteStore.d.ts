import { WebSocketManager, UnsubscribeCallback } from '../client/WebSocketManager';
import { AbstractWebSocketBean, StoreParametersBean } from "./beans/Beans";
declare enum SubscriberType {
    FULL = 0,
    UPDATE = 1
}
interface Subscriber {
    type: SubscriberType;
    callback: ((data: Map<string, AbstractWebSocketBean>) => void);
}
export declare class RemoteStore {
    store: Map<string, Map<string, AbstractWebSocketBean> | undefined>;
    subscribers: Map<string, Map<string, Subscriber>>;
    websocketManager: WebSocketManager;
    unsubscribeUpdateListener: UnsubscribeCallback;
    unsubscribeDisconnectListener: UnsubscribeCallback;
    constructor(websocketManager: WebSocketManager);
    initRemoteStore(): [UnsubscribeCallback, UnsubscribeCallback];
    releaseRemoteStore(): void;
    openRemoteStore(path: Array<string>, params: StoreParametersBean | null): void;
    closeRemoteStore(path: Array<string>, params: StoreParametersBean | null): void;
    getData(path: Array<string>, params: StoreParametersBean | null): Map<string, AbstractWebSocketBean> | undefined;
    register(path: Array<string>, params: StoreParametersBean | null, setData: (data: Map<string, AbstractWebSocketBean>) => void, update?: boolean): (() => void);
    deregister(path: Array<string>, id: string, params: StoreParametersBean | null): void;
    editRemoteStore(msg: string, path: Array<string>, params: StoreParametersBean | null, payload: AbstractWebSocketBean, originId: string): void;
    update(storeId: string, data: {
        [key: string]: AbstractWebSocketBean;
    }): void;
}
export {};
