import { ConnectivityCallback, DefaultListenerCallback, ListenerCallback, UnsubscribeCallback, WebSocketManager } from './WebSocketManager';
export type SendFunction = (message: string, payload: any, toSid?: string | null) => void;
export declare const useWebSocket: (id?: string | null) => {
    manager: WebSocketManager;
    send: SendFunction;
    listen: (endpoint: string, message: string, callback: ListenerCallback) => UnsubscribeCallback;
    isConnected: () => boolean;
    connectivity: (callback: ConnectivityCallback) => UnsubscribeCallback;
    setDefaultCallback: (callback: DefaultListenerCallback) => void;
};
export declare const useSocket: (id?: string | null) => [string, string];
