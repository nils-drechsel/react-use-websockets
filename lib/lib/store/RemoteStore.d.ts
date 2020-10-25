import { WebSocketManager, UnsubscribeCallback } from '../client/WebSocketManager';
import { AbstractWebSocketBean, StoreParametersBean } from "./beans/Beans";
export declare class RemoteStore {
    store: Map<string, Map<string, AbstractWebSocketBean> | undefined>;
    subscribers: Map<string, Map<string, ((data: Map<string, AbstractWebSocketBean>) => void)>>;
    websocketManager: WebSocketManager;
    unsubscribeListener: UnsubscribeCallback;
    constructor(websocketManager: WebSocketManager);
    initRemoteStore(): UnsubscribeCallback;
    releaseRemoteStore(): void;
    openRemoteStore(path: Array<string>, params: StoreParametersBean | null): void;
    closeRemoteStore(path: Array<string>, params: StoreParametersBean | null): void;
    getData(path: Array<string>, params: StoreParametersBean | null): Map<string, AbstractWebSocketBean> | undefined;
    register(path: Array<string>, params: StoreParametersBean | null, setData: (data: Map<string, AbstractWebSocketBean>) => void): (() => void);
    deregister(path: Array<string>, id: string, params: StoreParametersBean | null): void;
    editRemoteStore(msg: string, path: Array<string>, params: StoreParametersBean | null, payload: AbstractWebSocketBean, originId: string): void;
    update(storeId: string, data: {
        [key: string]: AbstractWebSocketBean;
    }): void;
}
