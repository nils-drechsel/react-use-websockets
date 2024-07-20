import { AbstractIOBean, IOClientToServerCoreBean } from "../beans/Beans";
import { ServerToClientCoreBean } from "./ServerToClientCoreBeanBuilder";
export interface ListenerCallback<BEAN extends AbstractIOBean> {
    (coreBean: ServerToClientCoreBean<BEAN>): void;
}
export interface DefaultListenerCallback {
    (coreBean: ServerToClientCoreBean<AbstractIOBean>): void;
}
export interface ConnectivityCallback {
    (isConnected: boolean, isReady: boolean, sid: string | null, uid: string | null): void;
}
export interface UnsubscribeCallback {
    (): void;
}
export declare class WebSocketManager {
    ws: WebSocket;
    url: string;
    messageToListeners: Map<string, Set<number>>;
    listenerToCallback: Map<number, ListenerCallback<AbstractIOBean>>;
    connectivityListenerToCallback: Map<number, ConnectivityCallback>;
    listenerToMessage: Map<number, string>;
    defaultCallback: DefaultListenerCallback | null;
    connectivityListeners: Set<number>;
    listenerIdCount: number;
    noReconnectOn: Set<number>;
    queue: Array<string>;
    reconnect: boolean;
    logging: boolean;
    sid: string;
    uid: string;
    domain: string;
    unsubscribeInterval: number;
    constructor(url: string, domain: string, reconnect?: boolean, ping?: number, logging?: boolean);
    isConnected(): boolean;
    isReady(): boolean;
    sleep(ms: number): Promise<unknown>;
    reinit(): Promise<void>;
    private initListeners;
    private onConnect;
    private facilitateConnect;
    private onClose;
    private onMessage;
    private resolveQueue;
    send(coreBean: IOClientToServerCoreBean): void;
    sendRaw(raw: string): void;
    private createId;
    removeListener(id: number): void;
    addListener<BEAN extends AbstractIOBean>(endpoint: string, message: string, callback: ListenerCallback<BEAN>): UnsubscribeCallback;
    createMessageId(endpoint: string, message: string): string;
    removeConnectivityListener(id: number): void;
    addConnectivityListener(callback: ConnectivityCallback): UnsubscribeCallback;
    setDefaultCallback(callback: DefaultListenerCallback): void;
    getSid(): string;
    getUid(): string;
    destroy(): void;
}
