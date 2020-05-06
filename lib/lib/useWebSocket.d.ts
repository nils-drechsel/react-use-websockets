import { ListenerCallback, UnsubscribeCallback } from './WebSocketManager';
export declare const useWebSocket: () => {
    send: (message: string, payload: any) => void;
    listen: (message: string, callback: ListenerCallback) => UnsubscribeCallback;
    isConnected: () => boolean;
};
