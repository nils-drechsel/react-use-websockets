import { ListenerCallback, UnsubscribeCallback, ConnectivityCallback, DefaultListenerCallback } from './WebSocketManager';
export declare const useWebSocket: () => {
    send: (message: string, payload: any, toSid?: any) => void;
    listen: (message: string, callback: ListenerCallback) => UnsubscribeCallback;
    isConnected: () => boolean;
    connectivity: (callback: ConnectivityCallback) => UnsubscribeCallback;
    setDefaultCallback: (callback: DefaultListenerCallback) => void;
};
