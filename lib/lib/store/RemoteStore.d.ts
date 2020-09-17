import { WebSocketManager, UnsubscribeCallback } from '../client/WebSocketManager';
export declare class RemoteStore {
    store: Map<string, Map<string, any> | undefined>;
    subscribers: Map<string, Map<string, ((data: any) => void)>>;
    websocketManager: WebSocketManager;
    unsubscribeListener: UnsubscribeCallback;
    constructor(websocketManager: WebSocketManager);
    initRemoteStore(): UnsubscribeCallback;
    releaseRemoteStore(): void;
    openRemoteStore(path: Array<string>): void;
    closeRemoteStore(path: Array<string>): void;
    getData(path: Array<string>): Map<string, any> | undefined;
    register(path: Array<string>, setData: (data: any) => void): (() => void);
    deregister(path: Array<string>, id: string): void;
    update(storeId: string, data: {
        [key: string]: any;
    }, lol: any): void;
}
