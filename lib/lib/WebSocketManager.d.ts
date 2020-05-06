export interface ListenerCallback {
    (payload: any): void;
}
export interface ConnectivityCallback {
    (isConnected: boolean): void;
}
export interface UnsubscribeCallback {
    (): void;
}
export declare class WebSocketManager {
    ws: WebSocket;
    url: string;
    messageToListeners: Map<string, Set<number>>;
    listenerToCallback: Map<number, any>;
    listenerToMessage: Map<number, any>;
    connectivityListeners: Set<number>;
    listenerIdCount: number;
    noReconnectOn: Set<number>;
    queue: Array<string>;
    messageIdent: string;
    payloadIdent: string;
    reconnect: boolean;
    constructor(url: string, messageIdent?: string, payloadIdent?: string, reconnect?: boolean);
    isConnected(): boolean;
    sleep(ms: number): Promise<unknown>;
    reinit(): Promise<void>;
    initListeners(): void;
    onConnect(_event: Event): void;
    onClose(event: CloseEvent): void;
    onMessage(event: MessageEvent): void;
    resolveQueue(): void;
    send(message: string, payload?: any): void;
    sendRaw(raw: string): void;
    createId(): number;
    removeListener(id: number): void;
    addListener(message: string, callback: ListenerCallback): UnsubscribeCallback;
    removeConnectivityListener(id: number): void;
    addConnectivityListener(callback: ListenerCallback): UnsubscribeCallback;
}
