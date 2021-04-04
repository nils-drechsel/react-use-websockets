import { WebSocketManager, ListenerCallback, UnsubscribeCallback, ConnectivityCallback, DefaultListenerCallback } from './WebSocketManager';
export declare type SendFunction = (message: string, payload: any, toSid?: string | null) => void;
export declare const useWebSocket: (id?: string | null | undefined) => {
    manager: WebSocketManager;
    send: SendFunction;
    listen: (message: string, callback: ListenerCallback) => UnsubscribeCallback;
    isConnected: () => boolean;
    connectivity: (callback: ConnectivityCallback) => UnsubscribeCallback;
    setDefaultCallback: (callback: DefaultListenerCallback) => void;
};
export declare const useSocket: (id?: string | null | undefined) => [string, string];
