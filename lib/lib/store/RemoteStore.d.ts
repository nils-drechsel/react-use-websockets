import { WebSocketManager, UnsubscribeCallback } from '../client/WebSocketManager';
import { AbstractWebSocketBean } from "./beans/StoreBeans";
export declare class RemoteStore {
    store: Map<string, Map<string, AbstractWebSocketBean> | undefined>;
    subscribers: Map<string, Map<string, ((data: Map<string, AbstractWebSocketBean>) => void)>>;
    websocketManager: WebSocketManager;
    unsubscribeListener: UnsubscribeCallback;
    constructor(websocketManager: WebSocketManager);
    initRemoteStore(): UnsubscribeCallback;
    releaseRemoteStore(): void;
    openRemoteStore(path: Array<string>, params: Array<string>): void;
    closeRemoteStore(path: Array<string>, params: Array<string>): void;
    getData(path: Array<string>, params: Array<string>): Map<string, AbstractWebSocketBean> | undefined;
    register(path: Array<string>, params: Array<string>, setData: (data: Map<string, AbstractWebSocketBean>) => void): (() => void);
    deregister(path: Array<string>, id: string, params: Array<string>): void;
    editRemoteStore(path: Array<string>, params: Array<string>, payload: AbstractWebSocketBean, originId: string): void;
    update(storeId: string, data: {
        [key: string]: AbstractWebSocketBean;
    }): void;
}
