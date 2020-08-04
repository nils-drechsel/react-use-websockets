import { WebSocketManager, UnsubscribeCallback } from '../client/WebSocketManager';
export declare class RemoteStore {
    store: Map<string, Map<string, any> | null>;
    subscribers: Map<string, Map<string, ((data: any) => void)>>;
    websocketManager: WebSocketManager;
    unsubscribeListener: UnsubscribeCallback;
    constructor(websocketManager: WebSocketManager);
    initRemoteStore(): UnsubscribeCallback;
    releaseRemoteStore(): void;
    openRemoteStore(path: Array<string>): void;
    closeRemoteStore(storeId: string): void;
    register(path: Array<string>, setData: (data: any) => void): (() => void);
    deregister(storeId: string, id: string): void;
    update(storeId: string, data: Map<string, any>): void;
}
