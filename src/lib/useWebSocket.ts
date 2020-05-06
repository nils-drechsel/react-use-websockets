import { useContext } from 'react';
import { WebSocketContext } from "./WebSocketContext";
import { WebSocketManager, ListenerCallback, UnsubscribeCallback, ConnectivityCallback } from './WebSocketManager';



export const useWebSocket = () => {
    const manager = useContext(WebSocketContext) as unknown as WebSocketManager;
    const send = (message: string, payload: any) => {
        if (!manager) throw Error("manager is null, did you provide a <WebSocketProvider> element?");
        manager.send(message, payload);
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

    return { send, listen, isConnected, connectivity };
}
