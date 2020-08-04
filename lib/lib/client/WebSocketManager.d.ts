export interface ListenerCallback {
    (payload: any, fromSid?: string | null): void;
}
export interface DefaultListenerCallback {
    (message: string, payload: any, fromSid?: string | null): void;
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
    listenerToCallback: Map<number, ListenerCallback>;
    listenerToMessage: Map<number, string>;
    defaultCallback: DefaultListenerCallback | null;
    connectivityListeners: Set<number>;
    listenerIdCount: number;
    noReconnectOn: Set<number>;
    queue: Array<string>;
    delimiter: string;
    reconnect: boolean;
    logging: boolean;
    constructor(url: string, delimiter?: string, reconnect?: boolean, logging?: boolean);
    isConnected(): boolean;
    sleep(ms: number): Promise<unknown>;
    reinit(): Promise<void>;
    initListeners(): void;
    onConnect(_event: Event): void;
    onClose(event: CloseEvent): void;
    onMessage(event: MessageEvent): void;
    getSid(value: string | null | undefined): string | null;
    getJSONPayload(payload: any): any;
    resolveQueue(): void;
    send(message: string, payload?: any, toSid?: string | null): void;
    sendRaw(raw: string): void;
    createId(): number;
    removeListener(id: number): void;
    addListener(message: string, callback: ListenerCallback): UnsubscribeCallback;
    removeConnectivityListener(id: number): void;
    addConnectivityListener(callback: ListenerCallback): UnsubscribeCallback;
    setDefaultCallback(callback: DefaultListenerCallback): void;
}
