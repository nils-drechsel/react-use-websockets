export interface ListenerCallback {
    (message: string, payload: any, id: number | null | undefined): void;
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
    listenerIdCount: number;
    noReconnectOn: Set<number>;
    queue: Array<string>;
    messageIdent: string;
    payloadIdent: string;
    constructor(url: string, messageIdent?: string, payloadIdent?: string);
    isConnected(): boolean;
    reinit(): void;
    onConnect(_event: Event): void;
    onClose(event: CloseEvent): void;
    onMessage(event: MessageEvent): void;
    resolveQueue(): void;
    send(message: string, payload?: any): void;
    sendRaw(raw: string): void;
    createId(): number;
    removeListener(id: number): void;
    addListener(message: string, callback: ListenerCallback): UnsubscribeCallback;
}
