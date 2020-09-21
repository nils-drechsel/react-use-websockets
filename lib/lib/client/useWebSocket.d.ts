import { ListenerCallback, UnsubscribeCallback, ConnectivityCallback, DefaultListenerCallback } from './WebSocketManager';
export declare type SendFunction = (message: string, payload: any, toSid?: string | null) => void;
export declare const useWebSocket: () => {
    send: SendFunction;
    listen: (message: string, callback: ListenerCallback) => UnsubscribeCallback;
    isConnected: () => boolean;
    connectivity: (callback: ConnectivityCallback) => UnsubscribeCallback;
    setDefaultCallback: (callback: DefaultListenerCallback) => void;
};
