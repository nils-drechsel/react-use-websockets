import { useContext, useEffect } from 'react';
import { WebSocketContext } from "./WebSocketContext";
import { WebSocketManager, ListenerCallback, UnsubscribeCallback, ConnectivityCallback, DefaultListenerCallback } from './WebSocketManager';

export type SendFunction = (message: string, payload: any, toSid?: string | null) => void;

export const useWebSocket = () => {
    const manager = useContext(WebSocketContext) as unknown as WebSocketManager;
    const send: SendFunction = (message: string, payload: any, toSid: string | null = null) => {
        if (!manager) throw Error("manager is null, did you provide a <WebSocketProvider> element?");
        manager.send(message, payload, toSid);
    };
    const listen = (message: string, callback: ListenerCallback): UnsubscribeCallback => {
        if (!manager) throw Error("manager is null, did you provide a <WebSocketProvider> element?");
        return manager.addListener(message, callback);
    }
    const isConnected = (): boolean => {
        if (!manager) throw Error("manager is null, did you provide a <WebSocketProvider> element?");
        return manager.isConnected();
    }
    const connectivity = (callback: ConnectivityCallback): UnsubscribeCallback => {
        if (!manager) throw Error("manager is null, did you provide a <WebSocketProvider> element?");
        return manager.addConnectivityListener(callback);
    }
    const setDefaultCallback = (callback: DefaultListenerCallback): void => {
        if (!manager) throw Error("manager is null, did you provide a <WebSocketProvider> element?");
        return manager.setDefaultCallback(callback);
    }

    return { send, listen, isConnected, connectivity, setDefaultCallback };
}
